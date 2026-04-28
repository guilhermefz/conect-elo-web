export function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split(".")[1];
  const padded = base64.replace(/-/g, "+").replace(/_/g, "/").padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return JSON.parse(atob(padded));
}

export function getUsuarioIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = decodeJwtPayload(token);

    const id =
      (payload["nameid"] as string) ??
      (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string) ??
      (payload["sub"] as string) ??
      null;
    return id;
  } catch {
    return null;
  }
}
