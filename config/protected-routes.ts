// Routes that must never be indexed or cached. The public cover page ("/")
// is intentionally absent so anonymous prospects can discover the site.
// Token-guarded appointment links are covered separately in next.config.ts
// headers (they stay reachable without a session).
export const protectedRoutes = [
  "/dashboard",
  "/leads",
  "/access",
  "/crm",
  "/admin",
  "/assessments",
  "/assessment-results",
  "/appointments",
  "/engagement",
  "/on-behalf",
  "/blogs",
  "/careers",
  "/privacy-policy",
  "/terms-of-use",
  // Public free assessment (noindex); completion creates client access.
  "/sales-alignment-assessment",
  "/login",
  "/signup",
  "/forgot-password",
  "/verification-code",
  "/update-password",
] as const;
