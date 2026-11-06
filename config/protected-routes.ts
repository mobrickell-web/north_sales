// Routes that must never be indexed or cached. The public cover page ("/")
// and the token-guarded appointment links are intentionally absent.
export const protectedRoutes = [
  "/dashboard",
  "/leads",
  "/access",
  "/admin",
  "/assessments",
  "/appointments",
  "/blogs",
  "/careers",
  "/privacy-policy",
  "/terms-of-use",
  "/sales-alignment-assessment",
  "/login",
  "/signup",
  "/forgot-password",
  "/verification-code",
  "/update-password",
];
