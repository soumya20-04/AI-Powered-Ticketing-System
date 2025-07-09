import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
  if (!token) {
    console.warn("⚠️ Token is missing or null");
    return true;
  }

  try {
    const { exp } = jwtDecode(token); // ✅ updated here
    if (!exp) {
      console.warn("⚠️ No exp in token payload");
      return true;
    }
    const isExpired = Date.now() >= exp * 1000;
    console.log("✅ Is token expired?", isExpired);
    return isExpired;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
}


