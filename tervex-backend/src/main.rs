use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use chrono::{Duration, Utc};
use argon2::{password_hash::{rand_core::OsRng, PasswordHash, SaltString}, Argon2, PasswordHasher, PasswordVerifier};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::{sqlite::{SqliteConnectOptions, SqlitePoolOptions}, FromRow, SqlitePool};
use std::{env, net::SocketAddr, str::FromStr};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use uuid::Uuid;

#[derive(Clone)]
struct AppState { db: SqlitePool, jwt_secret: String }

#[derive(Debug)]
struct ApiError(StatusCode, String);
impl IntoResponse for ApiError {
    fn into_response(self) -> Response { (self.0, Json(json!({"error": self.1}))).into_response() }
}
impl From<sqlx::Error> for ApiError {
    fn from(e: sqlx::Error) -> Self { eprintln!("database error: {e}"); Self(StatusCode::INTERNAL_SERVER_ERROR, "Database operation failed".into()) }
}
type ApiResult<T> = Result<T, ApiError>;

#[derive(Debug, Serialize, FromRow)]
struct Listing {
    id: String, model: String, count: i64, vram: String, interconnect: String,
    region: String, location: String, datacenter: String,
    #[sqlx(rename = "spot_rate")] spot_rate: f64,
    #[sqlx(rename = "forward_30d_rate")] forward_30d_rate: f64,
    available_hours: i64, tier: String, provider: String, verified: i64,
    min_commitment: String, is_demo: i64,
}
#[derive(Deserialize)]
struct ListingQuery { model: Option<String>, region: Option<String>, search: Option<String>, mode: Option<String>, limit: Option<i64>, offset: Option<i64> }
#[derive(Deserialize)]
struct NewListing {
    model: String, count: i64, vram: String, interconnect: String, region: String,
    location: String, datacenter: String, spot_rate: f64, forward_30d_rate: f64,
    available_hours: i64, tier: String, provider: String, verified: Option<bool>, min_commitment: String,
}
#[derive(Deserialize)]
struct ReservationRequest {
    listing_id: Option<String>, mode: String, cluster_model: String, duration: String,
    email: String, gpu_count: Option<i64>, estimated_total: Option<f64>,
}
#[derive(Deserialize)]
struct ApplicationRequest { cluster_model: String, duration: String, email: String }
#[derive(Deserialize)]
struct QuoteRequest { model: String, gpu_count: i64, hours: i64 }


#[derive(Debug, Deserialize)]
struct RegisterRequest { name: String, email: String, password: String, role: Option<String> }
#[derive(Debug, Deserialize)]
struct LoginRequest { email: String, password: String }
#[derive(Debug, Serialize, Deserialize)]
struct Claims { sub: String, email: String, name: String, role: String, exp: usize }
#[derive(Debug, Serialize, FromRow)]
struct User { id: String, name: String, email: String, role: String, created_at: String }

fn token_for(user: &User, secret: &str) -> Result<String, ApiError> {
    let exp = (Utc::now() + Duration::hours(24)).timestamp() as usize;
    encode(&Header::default(), &Claims { sub: user.id.clone(), email: user.email.clone(), name: user.name.clone(), role: user.role.clone(), exp }, &EncodingKey::from_secret(secret.as_bytes()))
        .map_err(|_| ApiError(StatusCode::INTERNAL_SERVER_ERROR, "Could not create session".into()))
}
fn hash_password(password: &str) -> ApiResult<String> {
    if password.len() < 8 { return Err(bad_request("Password must be at least 8 characters")); }
    if password.len() > 128 { return Err(bad_request("Password must be at most 128 characters")); }
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default().hash_password(password.as_bytes(), &salt).map(|h| h.to_string())
        .map_err(|_| ApiError(StatusCode::INTERNAL_SERVER_ERROR, "Could not secure password".into()))
}
async fn register(State(st): State<AppState>, Json(input): Json<RegisterRequest>) -> ApiResult<(StatusCode, Json<Value>)> {
    valid_text(&input.name, "name", 80)?; valid_email(&input.email)?;
    let email = input.email.trim().to_ascii_lowercase();
    let role = input.role.as_deref().unwrap_or("user");
    if role != "user" && role != "provider" { return Err(bad_request("role must be user or provider")); }
    let password_hash = hash_password(&input.password)?;
    let id = Uuid::new_v4().to_string();
    let result = sqlx::query("INSERT INTO users(id,name,email,password_hash,role) VALUES(?,?,?,?,?)")
        .bind(&id).bind(input.name.trim()).bind(&email).bind(password_hash).bind(role).execute(&st.db).await;
    if let Err(e) = result {
        if let sqlx::Error::Database(db_err) = &e { if db_err.is_unique_violation() { return Err(ApiError(StatusCode::CONFLICT, "An account with this email already exists".into())); } }
        return Err(e.into());
    }
    let user = sqlx::query_as::<_, User>("SELECT id,name,email,role,created_at FROM users WHERE id=?").bind(&id).fetch_one(&st.db).await?;
    let token = token_for(&user, &st.jwt_secret)?;
    Ok((StatusCode::CREATED, Json(json!({"token":token,"user":user,"message":"Account created"}))))
}
async fn login(State(st): State<AppState>, Json(input): Json<LoginRequest>) -> ApiResult<Json<Value>> {
    valid_email(&input.email)?;
    let email = input.email.trim().to_ascii_lowercase();
    let row = sqlx::query("SELECT id,name,email,password_hash,role,created_at FROM users WHERE email=?").bind(email).fetch_optional(&st.db).await?
        .ok_or_else(|| ApiError(StatusCode::UNAUTHORIZED, "Invalid email or password".into()))?;
    let stored: String = sqlx::Row::try_get(&row, "password_hash").map_err(|_| ApiError(StatusCode::INTERNAL_SERVER_ERROR, "Account data is invalid".into()))?;
    let parsed = PasswordHash::new(&stored).map_err(|_| ApiError(StatusCode::INTERNAL_SERVER_ERROR, "Account password data is invalid".into()))?;
    if Argon2::default().verify_password(input.password.as_bytes(), &parsed).is_err() { return Err(ApiError(StatusCode::UNAUTHORIZED, "Invalid email or password".into())); }
    let user = User { id: sqlx::Row::try_get(&row,"id")?, name: sqlx::Row::try_get(&row,"name")?, email: sqlx::Row::try_get(&row,"email")?, role: sqlx::Row::try_get(&row,"role")?, created_at: sqlx::Row::try_get(&row,"created_at")? };
    let token = token_for(&user, &st.jwt_secret)?;
    Ok(Json(json!({"token":token,"user":user,"message":"Signed in successfully"})))
}
async fn me(State(st): State<AppState>, headers: axum::http::HeaderMap) -> ApiResult<Json<Value>> {
    let header = headers.get(axum::http::header::AUTHORIZATION).and_then(|v| v.to_str().ok()).unwrap_or("");
    let token = header.strip_prefix("Bearer ").ok_or_else(|| ApiError(StatusCode::UNAUTHORIZED, "Sign in required".into()))?;
    let claims = decode::<Claims>(token, &DecodingKey::from_secret(st.jwt_secret.as_bytes()), &Validation::default())
        .map_err(|_| ApiError(StatusCode::UNAUTHORIZED, "Session is invalid or expired".into()))?.claims;
    let user = sqlx::query_as::<_, User>("SELECT id,name,email,role,created_at FROM users WHERE id=?").bind(&claims.sub).fetch_optional(&st.db).await?
        .ok_or_else(|| ApiError(StatusCode::UNAUTHORIZED, "Account no longer exists".into()))?;
    Ok(Json(json!({"user":user})))
}

fn bad_request(msg: &str) -> ApiError { ApiError(StatusCode::BAD_REQUEST, msg.to_string()) }
fn valid_text(s: &str, label: &str, max: usize) -> ApiResult<()> {
    let v = s.trim();
    if v.is_empty() { return Err(bad_request(&format!("{label} is required"))); }
    if v.len() > max { return Err(bad_request(&format!("{label} must be at most {max} characters"))); }
    Ok(())
}
fn valid_email(s: &str) -> ApiResult<()> {
    valid_text(s, "email", 254)?;
    if !s.contains('@') || !s.rsplit('@').next().unwrap_or("").contains('.') { return Err(bad_request("A valid email address is required")); }
    Ok(())
}

async fn health() -> Json<Value> { Json(json!({"status":"ok","service":"TerveX API","timestamp":Utc::now()})) }
async fn list_listings(State(st): State<AppState>, Query(q): Query<ListingQuery>) -> ApiResult<Json<Value>> {
    let limit = q.limit.unwrap_or(100).clamp(1, 250);
    let offset = q.offset.unwrap_or(0).max(0);
    let search = q.search.unwrap_or_default();
    let model = q.model.unwrap_or_default();
    let region = q.region.unwrap_or_default();
    let mut rows = sqlx::query_as::<_, Listing>(
        "SELECT id,model,count,vram,interconnect,region,location,datacenter,spot_rate,forward_30d_rate,available_hours,tier,provider,verified,min_commitment,is_demo FROM gpu_listings WHERE (? = '' OR lower(model) LIKE lower('%' || ? || '%')) AND (? = '' OR lower(region) = lower(?)) AND (? = '' OR lower(model || ' ' || provider || ' ' || location || ' ' || datacenter) LIKE lower('%' || ? || '%')) ORDER BY model LIMIT ? OFFSET ?")
        .bind(&model).bind(&model).bind(&region).bind(&region).bind(&search).bind(&search).bind(limit).bind(offset).fetch_all(&st.db).await?;
    // Keep API JSON aligned to the frontend's camelCase property names.
    let items: Vec<Value> = rows.drain(..).map(|r| json!({
        "id":r.id,"model":r.model,"count":r.count,"vram":r.vram,"interconnect":r.interconnect,
        "region":r.region,"location":r.location,"datacenter":r.datacenter,"spotRate":r.spot_rate,
        "forward30dRate":r.forward_30d_rate,"availableHours":r.available_hours,"tier":r.tier,
        "provider":r.provider,"verified":r.verified != 0,"minCommitment":r.min_commitment,"demoData":r.is_demo != 0
    })).collect();
    let _ = q.mode; // Reserved for future mode-specific inventory.
    let count = items.len();
    Ok(Json(json!({"items":items,"count":count,"limit":limit,"offset":offset,"dataType":"seeded_demo_inventory"})))
}
async fn get_listing(State(st): State<AppState>, Path(id): Path<String>) -> ApiResult<Json<Value>> {
    let r = sqlx::query_as::<_, Listing>("SELECT id,model,count,vram,interconnect,region,location,datacenter,spot_rate,forward_30d_rate,available_hours,tier,provider,verified,min_commitment,is_demo FROM gpu_listings WHERE id=?").bind(&id).fetch_optional(&st.db).await?
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "Listing not found".into()))?;
    Ok(Json(json!({"id":r.id,"model":r.model,"count":r.count,"vram":r.vram,"interconnect":r.interconnect,"region":r.region,"location":r.location,"datacenter":r.datacenter,"spotRate":r.spot_rate,"forward30dRate":r.forward_30d_rate,"availableHours":r.available_hours,"tier":r.tier,"provider":r.provider,"verified":r.verified != 0,"minCommitment":r.min_commitment,"demoData":r.is_demo != 0})))
}
async fn create_listing(State(st): State<AppState>, Json(input): Json<NewListing>) -> ApiResult<(StatusCode, Json<Value>)> {
    for (v,l) in [(&input.model,"model"),(&input.vram,"vram"),(&input.interconnect,"interconnect"),(&input.region,"region"),(&input.location,"location"),(&input.datacenter,"datacenter"),(&input.tier,"tier"),(&input.provider,"provider"),(&input.min_commitment,"min_commitment")] { valid_text(v,l,200)?; }
    if input.count < 1 || input.count > 10000 || input.available_hours < 0 || input.spot_rate < 0.0 || input.forward_30d_rate < 0.0 || !input.spot_rate.is_finite() || !input.forward_30d_rate.is_finite() { return Err(bad_request("Invalid count, availability, or price")); }
    let id = format!("listing-{}", Uuid::new_v4());
    sqlx::query("INSERT INTO gpu_listings (id,model,count,vram,interconnect,region,location,datacenter,spot_rate,forward_30d_rate,available_hours,tier,provider,verified,min_commitment,is_demo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0)")
        .bind(&id).bind(&input.model).bind(input.count).bind(&input.vram).bind(&input.interconnect).bind(&input.region).bind(&input.location).bind(&input.datacenter).bind(input.spot_rate).bind(input.forward_30d_rate).bind(input.available_hours).bind(&input.tier).bind(&input.provider).bind(input.verified.unwrap_or(false) as i64).bind(&input.min_commitment).execute(&st.db).await?;
    Ok((StatusCode::CREATED, Json(json!({"id":id,"status":"created","demoData":false}))))
}
async fn create_reservation(State(st): State<AppState>, Json(input): Json<ReservationRequest>) -> ApiResult<(StatusCode, Json<Value>)> {
    if input.mode != "spot" && input.mode != "forward" { return Err(bad_request("mode must be spot or forward")); }
    for (v,l) in [(&input.cluster_model,"cluster_model"),(&input.duration,"duration")] { valid_text(v,l,200)?; }
    valid_email(&input.email)?;
    let gpu_count = input.gpu_count.unwrap_or(1);
    if !(1..=10000).contains(&gpu_count) { return Err(bad_request("gpu_count must be between 1 and 10000")); }
    if let Some(total) = input.estimated_total { if !total.is_finite() || total < 0.0 { return Err(bad_request("estimated_total must be a non-negative number")); } }
    if let Some(ref listing_id) = input.listing_id {
        let exists: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM gpu_listings WHERE id=?").bind(listing_id).fetch_one(&st.db).await?;
        if exists == 0 { return Err(ApiError(StatusCode::NOT_FOUND, "Listing not found".into())); }
    }
    let id = Uuid::new_v4().to_string();
    sqlx::query("INSERT INTO reservation_requests(id,listing_id,mode,cluster_model,duration,email,gpu_count,estimated_total,status) VALUES(?,?,?,?,?,?,?,?, 'pending_review')")
        .bind(&id).bind(&input.listing_id).bind(&input.mode).bind(&input.cluster_model).bind(&input.duration).bind(&input.email).bind(gpu_count).bind(input.estimated_total).execute(&st.db).await?;
    Ok((StatusCode::CREATED, Json(json!({"id":id,"status":"pending_review","message":"Request saved. This prototype does not allocate GPUs, charge payments, or execute contracts."}))))
}
async fn create_provider(State(st): State<AppState>, Json(input): Json<ApplicationRequest>) -> ApiResult<(StatusCode, Json<Value>)> {
    create_application(st, input, true).await
}
async fn create_enterprise(State(st): State<AppState>, Json(input): Json<ApplicationRequest>) -> ApiResult<(StatusCode, Json<Value>)> {
    create_application(st, input, false).await
}
async fn create_application(st: AppState, input: ApplicationRequest, provider: bool) -> ApiResult<(StatusCode, Json<Value>)> {
    valid_text(&input.cluster_model,"cluster_model",200)?; valid_text(&input.duration,"duration",200)?; valid_email(&input.email)?;
    let id = Uuid::new_v4().to_string();
    let table = if provider { "provider_applications" } else { "enterprise_inquiries" };
    let sql = format!("INSERT INTO {table}(id,cluster_model,duration,email,status) VALUES(?,?,?,?,'pending_review')");
    sqlx::query(&sql).bind(&id).bind(&input.cluster_model).bind(&input.duration).bind(&input.email).execute(&st.db).await?;
    Ok((StatusCode::CREATED, Json(json!({"id":id,"status":"pending_review","message":if provider {"Provider application saved for review"} else {"Enterprise inquiry saved for review"}}))))
}
async fn quote(Json(input): Json<QuoteRequest>) -> ApiResult<Json<Value>> {
    valid_text(&input.model,"model",100)?;
    if !(1..=10000).contains(&input.gpu_count) || !(1..=8760).contains(&input.hours) { return Err(bad_request("gpu_count must be 1..10000 and hours must be 1..8760")); }
    let model = input.model.to_ascii_lowercase();
    let (spot, forward, canonical) = if model.contains("b200") { (3.85,3.40,"NVIDIA B200 NVL") }
        else if model.contains("a100") { (1.15,0.94,"NVIDIA A100 SXM4") }
        else if model.contains("l40s") { (0.82,0.68,"NVIDIA L40S") }
        else if model.contains("gh200") { (3.10,2.70,"NVIDIA GH200 Grace Hopper") }
        else if model.contains("h100") { (2.24,1.95,"NVIDIA H100 SXM5") }
        else { return Err(bad_request("Unsupported model. Use H100, B200, A100, GH200, or L40S.")); };
    let units = input.gpu_count as f64 * input.hours as f64;
    let spot_total = ((units * spot) * 100.0).round() / 100.0;
    let forward_total = ((units * forward) * 100.0).round() / 100.0;
    let savings = ((spot_total - forward_total) * 100.0).round() / 100.0;
    Ok(Json(json!({"model":canonical,"gpuCount":input.gpu_count,"hours":input.hours,"gpuHours":input.gpu_count * input.hours,"currency":"USD","spotRatePerGpuHour":spot,"forwardRatePerGpuHour":forward,"spotTotal":spot_total,"forwardTotal":forward_total,"estimatedSavings":savings,"estimatedSavingsPercent":if spot_total > 0.0 {(savings / spot_total * 100.0).round()} else {0.0},"demoPricing":true,"note":"Illustrative demo rates, not a binding quote."})))
}
async fn market_metrics() -> Json<Value> { Json(json!({"demo":true,"label":"Illustrative demo metrics — not live marketplace telemetry","capacityGpus":12480,"volume24hUsd":2840000,"matchingLatencyMs":42,"slaTargetPercent":99.5,"prices":[{"model":"H100 SXM5","spot":2.24,"forward":1.95},{"model":"B200 NVL","spot":3.85,"forward":3.40},{"model":"A100 SXM4","spot":1.15,"forward":0.94},{"model":"L40S","spot":0.82,"forward":0.68}]})) }

async fn init_db(db: &SqlitePool) -> Result<(), Box<dyn std::error::Error>> {
    sqlx::raw_sql(include_str!("../migrations/0001_initial.sql")).execute(db).await?;
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM gpu_listings").fetch_one(db).await?;
    if count == 0 {
        let seed = [
            ("tx-gpu-01","NVIDIA H100 SXM5",8,"80GB HBM3 (640GB Total)","3.2 Tbps Quantum-2 InfiniBand / 900 GB/s NVLink","North America","US-East (Virginia)","Equinix DC11",2.24,1.95,4200,"Tier IV","ApexCompute Infrastructure","1 Hour (Spot) / 168 Hrs (Fwd)"),
            ("tx-gpu-02","NVIDIA B200 NVL",8,"192GB HBM3e (1.5TB Total)","Dual 800 Gbps OSFP / NVLink 5.0 (1.8 TB/s)","Europe","EU-West (Dublin)","Digital Realty DUB1",3.85,3.40,1840,"Tier IV","Helios Cloud GmbH","4 Hours (Spot) / 336 Hrs (Fwd)"),
            ("tx-gpu-03","NVIDIA A100 SXM4",8,"80GB HBM2e (640GB Total)","1.6 Tbps HDR InfiniBand / 600 GB/s NVLink","North America","US-Central (Texas)","CyrusOne DFW",1.15,0.94,12500,"Tier III+","TerraCore Datacenters","1 Hour (Spot) / 72 Hrs (Fwd)"),
            ("tx-gpu-04","NVIDIA GH200 Grace Hopper",1,"96GB HBM3 + 480GB LPDDR5X","NVLink-C2C 900 GB/s Coherent Memory","Asia-Pacific","AP-East (Tokyo)","NTT Communications TY5",3.10,2.70,2900,"Tier IV","Tokyo SuperCluster Ltd","2 Hours (Spot) / 120 Hrs (Fwd)"),
            ("tx-gpu-05","NVIDIA L40S",4,"48GB GDDR6","PCIe Gen4 x16","Europe","EU-Central (Frankfurt)","Kaiser AI Hosting FRA1",0.82,0.68,8700,"Tier III+","Kaiser AI Hosting","1 Hour (Spot) / 48 Hrs (Fwd)"),
            ("tx-gpu-06","NVIDIA H100 PCIe",4,"80GB HBM3","PCIe Gen5 x16","North America","US-West (Oregon)","Cascades Compute PDX",1.88,1.60,5100,"Tier III","Cascades Compute Co","1 Hour (Spot) / 72 Hrs (Fwd)"),
        ];
        for r in seed {
            sqlx::query("INSERT INTO gpu_listings(id,model,count,vram,interconnect,region,location,datacenter,spot_rate,forward_30d_rate,available_hours,tier,provider,verified,min_commitment,is_demo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,1)")
                .bind(r.0).bind(r.1).bind(r.2).bind(r.3).bind(r.4).bind(r.5).bind(r.6).bind(r.7).bind(r.8).bind(r.9).bind(r.10).bind(r.11).bind(r.12).bind(r.13).execute(db).await?;
        }
        println!("Seeded {} illustrative GPU listings (not live inventory).", seed.len());
    }
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite://data/tervex.db".to_string());
    if let Some(path) = database_url.strip_prefix("sqlite://") {
        if path != ":memory:" { if let Some(parent) = std::path::Path::new(path).parent() { if !parent.as_os_str().is_empty() { std::fs::create_dir_all(parent)?; } } }
    }
    let options = SqliteConnectOptions::from_str(&database_url)?.create_if_missing(true).foreign_keys(true);
    let db = SqlitePoolOptions::new().max_connections(5).connect_with(options).await?;
    init_db(&db).await?;
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "DEV_ONLY_CHANGE_THIS_TERVEX_SECRET_BEFORE_DEPLOYMENT_2026".to_string());
    if jwt_secret.len() < 32 { return Err("JWT_SECRET must be at least 32 characters".into()); }
    let state = AppState { db, jwt_secret };
    let app = Router::new()
        .route("/api/health", get(health))
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .route("/api/auth/me", get(me))
        .route("/api/listings", get(list_listings).post(create_listing))
        .route("/api/listings/{id}", get(get_listing))
        .route("/api/reservations", post(create_reservation))
        .route("/api/providers/applications", post(create_provider))
        .route("/api/enterprise/inquiries", post(create_enterprise))
        .route("/api/compute/quote", post(quote))
        .route("/api/market-metrics", get(market_metrics))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .with_state(state);
    let host = env::var("HOST").unwrap_or_else(|_| "127.0.0.1".into());
    let port: u16 = env::var("PORT").unwrap_or_else(|_| "3000".into()).parse()?;
    let addr: SocketAddr = format!("{host}:{port}").parse()?;
    let listener = tokio::net::TcpListener::bind(addr).await?;
    println!("TerveX API listening at http://{addr}");
    println!("Demo listings are seeded; reservations are saved as pending_review only.");
    axum::serve(listener, app).await?;
    Ok(())
}
