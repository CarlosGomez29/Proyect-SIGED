
/**
 * Utilidad para hashear contraseñas utilizando SHA-256 (Web Crypto API).
 * Proporciona un método seguro y ligero para no almacenar contraseñas en texto plano.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
