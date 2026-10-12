$ErrorActionPreference = "Stop"
$base = if ($env:TERVEX_API_BASE_URL) { $env:TERVEX_API_BASE_URL.TrimEnd('/') } else { "http://127.0.0.1:3000/api" }
$checks = 0
function Pass([string]$message) { Write-Host "[PASS] $message" -ForegroundColor Green; $script:checks++ }
function Assert($condition, [string]$message) { if (-not $condition) { throw "[FAIL] $message" }; Pass $message }

Write-Host "TerveX API smoke test -> $base" -ForegroundColor Cyan
$health = Invoke-RestMethod "$base/health"
Assert ($health.status -eq "ok") "Health endpoint responds"
$listings = Invoke-RestMethod "$base/listings?limit=10"
Assert ($listings.items.Count -ge 1) "GPU listing endpoint returns inventory"
Assert ($listings.dataType -eq "seeded_demo_inventory") "Inventory is clearly marked as demo data"
$quoteBody = @{ model = "H100"; gpu_count = 2; hours = 10 } | ConvertTo-Json
$quote = Invoke-RestMethod -Uri "$base/compute/quote" -Method Post -ContentType "application/json" -Body $quoteBody
Assert ([math]::Abs($quote.spotTotal - 44.8) -lt 0.01) "Quote calculation: 2 H100 GPUs x 10 hours = $44.80 spot estimate"
Assert ($quote.demoPricing -eq $true) "Quote explicitly identifies demo pricing"

$email = "hackathon-$([guid]::NewGuid().ToString('N'))@example.test"
$registerBody = @{ name = "Hackathon Smoke Test"; email = $email; password = "TerveX-Demo-123!"; role = "user" } | ConvertTo-Json
$account = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -ContentType "application/json" -Body $registerBody
Assert (-not [string]::IsNullOrWhiteSpace($account.token)) "Registration returns a session token"
$me = Invoke-RestMethod -Uri "$base/auth/me" -Headers @{ Authorization = "Bearer $($account.token)" }
Assert ($me.user.email -eq $email) "Protected current-account endpoint validates token"

$reservationBody = @{ listing_id = $listings.items[0].id; mode = "spot"; cluster_model = $listings.items[0].model; duration = "2 hours"; email = $email; gpu_count = 1; estimated_total = 4.48 } | ConvertTo-Json
$reservation = Invoke-RestMethod -Uri "$base/reservations" -Method Post -ContentType "application/json" -Body $reservationBody
Assert ($reservation.status -eq "pending_review") "Reservation request is stored as pending review (not GPU allocation)"
Write-Host "`n$checks checks passed. This is a smoke test, not a security audit or load test." -ForegroundColor Cyan
