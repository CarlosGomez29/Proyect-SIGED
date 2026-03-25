// Utilidades de servidor para gestión de identidad
// Nota: Evitamos importar el SDK de Firebase directamente para mantener compatibilidad con Edge Runtime.

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-de-emergencia-cambiar-ya';
const ITERATIONS = parseInt(process.env.AUTH_SALT_ROUNDS || '600000', 10);
const KEY_LEN = 32; // 256 bits
const ALGO = 'SHA-256';

/**
 * Utilidades para encoding Base64URL (estándar JWT)
 */
function base64UrlEncode(str: string | Uint8Array): string {
  const base64 = typeof str === 'string' 
    ? btoa(unescape(encodeURIComponent(str)))
    : btoa(String.fromCharCode(...str));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Hashing de contraseñas con PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: ALGO
    },
    passwordKey,
    KEY_LEN * 8
  );

  const hashArray = new Uint8Array(hashBuffer);
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  if (!saltHex || !hashHex) return false;

  const encoder = new TextEncoder();
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: ALGO
    },
    passwordKey,
    KEY_LEN * 8
  );

  const hashArray = new Uint8Array(hashBuffer);
  const currentHashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return currentHashHex === hashHex;
}

/**
 * Implementación manual de JWT (HS256)
 */
export async function signJWT(payload: any): Promise<string> {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // 8 horas
    jti: crypto.randomUUID()
  }));

  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: ALGO },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToSign)
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signature));
  return `${dataToSign}.${encodedSignature}`;
}

export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

    const encoder = new TextEncoder();
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(JWT_SECRET),
      { name: 'HMAC', hash: ALGO },
      false,
      ['verify']
    );

    const signatureBin = atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/'));
    const signature = new Uint8Array(signatureBin.length);
    for (let i = 0; i < signatureBin.length; i++) {
      signature[i] = signatureBin.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      encoder.encode(dataToVerify)
    );

    if (!isValid) {
      console.log('JWT Verification: Signature mismatch');
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Validar expiración
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      console.log('JWT Verification: Token expired');
      return null;
    }

    // Validar revocación vía REST API (compatible con Edge/Middleware)
    const projectId = 'esac-manager';
    const restUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/revoked_tokens/${payload.jti}`;
    
    try {
      const resp = await fetch(restUrl);
      if (resp.status === 200) {
        console.log('JWT Verification: Token revoked (found in DB)');
        return null;
      }
    } catch (restError) {
      console.error('Error checking revocation via REST:', restError);
      // En caso de error de red, fallar por seguridad o permitir? 
      // Permitimos para no bloquear el sistema si la API REST falla, 
      // confiando en la firma y expiración.
    }

    return payload;
  } catch (e) {
    console.error('JWT Verification Error:', e);
    return null;
  }
}

/**
 * Invalidación de sesión (Logout Real)
 */
export async function revokeToken(jti: string, exp: number) {
  if (!jti) return;
  const projectId = 'esac-manager';
  const restUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/revoked_tokens/${jti}`;
  
  try {
    await fetch(restUrl, {
      method: 'PATCH', // En Firestore REST, PATCH con query param currentDocument.exists=false crea o actualiza
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          revokedAt: { integerValue: Date.now() },
          expiresAt: { integerValue: exp * 1000 }
        }
      })
    });
  } catch (e) {
    console.error('Error revoking token via REST:', e);
  }
}
