import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { hashPassword, verifyJWT } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // 1. Verificar sesión y permisos de admin
    const cookieStore = await cookies();
    const token = cookieStore.get('siged_session')?.value;
    const payload = await verifyJWT(token || '');

    if (!payload || (payload.rol !== 'superadmin' && payload.rol !== 'admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id, username, password, ...userData } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username es requerido' }, { status: 400 });
    }

    // 2. Si es nuevo usuario, verificar duplicidad
    if (!id) {
      const q = query(collection(db, 'users'), where('username', '==', username.trim().toLowerCase()), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 400 });
      }

      if (!password) {
        return NextResponse.json({ error: 'Contraseña requerida para nuevos usuarios' }, { status: 400 });
      }

      // Hashing seguro
      const hashedPassword = await hashPassword(password);
      
      const newDoc = await addDoc(collection(db, 'users'), {
        ...userData,
        username: username.trim().toLowerCase(),
        passwordHash: hashedPassword,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        estado: 'activo'
      });

      return NextResponse.json({ success: true, id: newDoc.id });
    } else {
      // 3. Actualizar usuario existente
      const userRef = doc(db, 'users', id);
      const updateData: any = {
        ...userData,
        updatedAt: serverTimestamp()
      };

      // Si se envió una contraseña explícita (aunque solemos usar el endpoint de reset)
      if (password) {
        updateData.passwordHash = await hashPassword(password);
      }

      await updateDoc(userRef, updateData);
      return NextResponse.json({ success: true });
    }

  } catch (error) {
    console.error('Save User API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
