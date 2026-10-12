import React, { useEffect, useState } from "react"
import { X, ShieldCheck, UserRound, LogOut, Eye, EyeOff } from "lucide-react"
import { authApi, AUTH_TOKEN_KEY, type AuthUser, ApiError } from "@/lib/api"

interface AuthPanelProps {
  open: boolean
  onClose: () => void
  user: AuthUser | null
  onAuthenticated: (user: AuthUser, token: string) => void
  onSignOut: () => void
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ open, onClose, user, onAuthenticated, onSignOut }) => {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"user" | "provider">("user")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => { if (open) setError("") }, [open, mode])
  if (!open) return null

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true); setError("")
    try {
      const result = mode === "register"
        ? await authApi.register({ name: name.trim(), email: email.trim(), password, role })
        : await authApi.login({ email: email.trim(), password })
      localStorage.setItem(AUTH_TOKEN_KEY, result.token)
      onAuthenticated(result.user, result.token)
      setPassword("")
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Check that the TerveX backend is running.")
    } finally { setBusy(false) }
  }

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-label="TerveX account" className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#101210] p-6 sm:p-8 shadow-2xl">
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"><X size={18} /></button>
      <div className="mb-6 flex items-center gap-3"><div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-primary"><ShieldCheck size={23} /></div><div><div className="text-xl font-bold text-white">Terve<span className="text-primary">X</span> Account</div><p className="text-xs text-white/50">Secure access to your compute marketplace</p></div></div>
      {user ? <div className="space-y-5">
        <div><p className="text-sm text-white/50">Signed in as</p><h2 className="mt-1 text-2xl font-semibold text-white">{user.name}</h2><p className="text-sm text-white/65">{user.email}</p></div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-center gap-2 text-primary"><UserRound size={17}/><span className="text-sm font-semibold">{user.role === "provider" ? "GPU Provider Dashboard" : "Compute User Dashboard"}</span></div><p className="mt-2 text-sm text-white/65">Account type: {user.role === "provider" ? "Provider" : "Compute user"}</p><p className="mt-1 text-xs text-white/40">Account ID: {user.id}</p></div>
        <button onClick={() => { onSignOut(); onClose() }} className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/5"><LogOut size={16}/> Sign out</button>
      </div> : <>
        <div className="mb-5 grid grid-cols-2 rounded-lg border border-white/10 bg-white/[0.03] p-1"><button onClick={() => setMode("login")} className={`rounded-md py-2 text-sm font-semibold ${mode === "login" ? "bg-primary text-black" : "text-white/60 hover:text-white"}`}>Sign in</button><button onClick={() => setMode("register")} className={`rounded-md py-2 text-sm font-semibold ${mode === "register" ? "bg-primary text-black" : "text-white/60 hover:text-white"}`}>Create account</button></div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && <><label className="block text-sm text-white/75">Full name<input required maxLength={80} value={name} onChange={e => setName(e.target.value)} autoComplete="name" className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-white outline-none focus:border-primary" placeholder="Your name" /></label><label className="block text-sm text-white/75">Account type<select value={role} onChange={e => setRole(e.target.value as "user" | "provider")} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#171917] px-3 py-3 text-white outline-none focus:border-primary"><option value="user">Compute user — rent GPUs</option><option value="provider">GPU provider — list capacity</option></select></label></>}
          <label className="block text-sm text-white/75">Email address<input required type="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-white outline-none focus:border-primary" placeholder="you@example.com" /></label>
          <label className="block text-sm text-white/75">Password<div className="relative mt-1.5"><input required minLength={8} maxLength={128} type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-3 pr-11 text-white outline-none focus:border-primary" placeholder={mode === "register" ? "At least 8 characters" : "Your password"} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-3.5 text-white/45 hover:text-white">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
          {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          <button disabled={busy} type="submit" className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-50">{busy ? "Please wait…" : mode === "register" ? "Create secure account" : "Sign in"}</button>
        </form>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-white/40">Passwords are hashed by the Rust backend. This prototype uses a bearer token stored in this browser; use HTTPS and a production secret before deployment.</p>
      </>}
    </section>
  </div>
}
