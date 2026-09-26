/**
 * Cryptographic helper using Web Crypto API to hash passwords
 * and avoid storing or transmitting plaintext passwords.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSessionToken(role: string, username: string): string {
  const timestamp = Date.now();
  const raw = `${role}:${username}:${timestamp}:${Math.random().toString(36).slice(2)}`;
  return btoa(raw);
}
