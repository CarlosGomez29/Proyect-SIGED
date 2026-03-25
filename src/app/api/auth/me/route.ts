import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth-server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('siged_session')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // Devolver solo datos públicos necesarios
  return NextResponse.json({
    user: {
      uid: payload.uid,
      username: payload.username,
      rol: payload.rol,
      nombre: payload.nombre,
      apellido: payload.apellido,
      escuelaId: payload.escuelaId
    }
  });
}
