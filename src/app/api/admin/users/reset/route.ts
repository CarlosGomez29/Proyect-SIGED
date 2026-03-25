import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { hashPassword, verifyJWT } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siged_session')?.value;
    const payload = await verifyJWT(token || '');

    if (!payload || (payload.rol !== 'superadmin' && payload.rol !== 'admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      passwordHash: hashedPassword,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
