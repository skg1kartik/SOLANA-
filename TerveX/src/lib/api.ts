export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000/api"

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.name = "ApiError"; this.status = status }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    })
  } catch {
    throw new ApiError("Cannot reach the TerveX API. Start the Rust backend and try again.", 0)
  }
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new ApiError(payload.error || `API request failed (${response.status})`, response.status)
  return payload as T
}

export const api = {
  getListings: (params = "") => apiRequest<{ items: import("@/components/MarketplaceExplorer").GpuListing[]; count: number; dataType: string }>(`/listings${params}`),
  quote: (model: string, gpu_count: number, hours: number) => apiRequest<{ spotTotal: number; forwardTotal: number; estimatedSavings: number; estimatedSavingsPercent: number; spotRatePerGpuHour: number; forwardRatePerGpuHour: number; note: string }>("/compute/quote", { method: "POST", body: JSON.stringify({ model, gpu_count, hours }) }),
  createReservation: (body: Record<string, unknown>) => apiRequest<{ id: string; status: string; message: string }>("/reservations", { method: "POST", body: JSON.stringify(body) }),
  createProviderApplication: (body: Record<string, unknown>) => apiRequest<{ id: string; status: string; message: string }>("/providers/applications", { method: "POST", body: JSON.stringify(body) }),
  createEnterpriseInquiry: (body: Record<string, unknown>) => apiRequest<{ id: string; status: string; message: string }>("/enterprise/inquiries", { method: "POST", body: JSON.stringify(body) }),
  getMarketMetrics: () => apiRequest<{ demo: boolean; label: string; capacityGpus: number; volume24hUsd: number; matchingLatencyMs: number; slaTargetPercent: number; prices: Array<{ model: string; spot: number; forward: number }> }>("/market-metrics"),
}


export interface AuthUser { id: string; name: string; email: string; role: "user" | "provider"; created_at: string }
export interface AuthResponse { token: string; user: AuthUser; message: string }
export const AUTH_TOKEN_KEY = "tervex_auth_token"
export const authApi = {
  register: (body: { name: string; email: string; password: string; role: "user" | "provider" }) =>
    apiRequest<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: (token: string) => apiRequest<{ user: AuthUser }>("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
}
