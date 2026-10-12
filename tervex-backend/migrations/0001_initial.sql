CREATE TABLE IF NOT EXISTS gpu_listings (
  id TEXT PRIMARY KEY,
  model TEXT NOT NULL,
  count INTEGER NOT NULL CHECK(count > 0),
  vram TEXT NOT NULL,
  interconnect TEXT NOT NULL,
  region TEXT NOT NULL,
  location TEXT NOT NULL,
  datacenter TEXT NOT NULL,
  spot_rate REAL NOT NULL CHECK(spot_rate >= 0),
  forward_30d_rate REAL NOT NULL CHECK(forward_30d_rate >= 0),
  available_hours INTEGER NOT NULL CHECK(available_hours >= 0),
  tier TEXT NOT NULL,
  provider TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  min_commitment TEXT NOT NULL,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_gpu_listings_model ON gpu_listings(model);
CREATE INDEX IF NOT EXISTS idx_gpu_listings_region ON gpu_listings(region);

CREATE TABLE IF NOT EXISTS reservation_requests (
  id TEXT PRIMARY KEY,
  listing_id TEXT,
  mode TEXT NOT NULL CHECK(mode IN ('spot','forward')),
  cluster_model TEXT NOT NULL,
  duration TEXT NOT NULL,
  email TEXT NOT NULL,
  gpu_count INTEGER NOT NULL CHECK(gpu_count > 0),
  estimated_total REAL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(listing_id) REFERENCES gpu_listings(id)
);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservation_requests(status);

CREATE TABLE IF NOT EXISTS provider_applications (
  id TEXT PRIMARY KEY,
  cluster_model TEXT NOT NULL,
  duration TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enterprise_inquiries (
  id TEXT PRIMARY KEY,
  cluster_model TEXT NOT NULL,
  duration TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Authentication accounts. Passwords are stored only as Argon2 hashes.
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user','provider')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
