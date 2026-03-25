import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT, revokeToken } from '@/lib/auth-server';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('siged_session')?.value;

  if (token) {
    const payload = await verifyJWT(token);
    if (payload && payload.jti) {
      // Registrar revocación real
      await revokeToken(payload.jti, payload.exp);
    }
  }

  const response = NextResponse.json({ success: true });
  
  // Eliminar cookie
  response.cookies.set('siged_session', '', { 
    maxAge: 0,
    path: '/'
  });

  return response;
}
