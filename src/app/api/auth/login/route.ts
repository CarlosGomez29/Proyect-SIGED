import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { verifyPassword, signJWT } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const { username, password, expectedRole } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 });
    }

    // 1. Buscar usuario en Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.trim().toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // Para evitar enumeración de usuarios, devolvemos un error genérico tras un delay corto
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const storedHash = userData.passwordHash;

    // 2. Verificar contraseña con estrategia de migración
    let isValid = false;
    let needsMigration = false;

    if (storedHash.includes(':')) {
      // Formato PBKDF2 (salt:hash)
      isValid = await verifyPassword(password, storedHash);
    } else {
      // Formato antiguo SHA-256 (solo hash hex)
      // Re-implementamos el hash simple para el check
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      isValid = (sha256Hash === storedHash);
      if (isValid) needsMigration = true;
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 2.1 Migración automática a PBKDF2 si es necesario
    if (needsMigration) {
      const { hashPassword } = await import('@/lib/auth-server');
      const newHash = await hashPassword(password);
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'users', userDoc.id), {
        passwordHash: newHash
      });
      console.log(`Usuario ${username} migrado a PBKDF2 exitosamente.`);
    }

    // 3. Validar Rol (Autorización básica)
    if (expectedRole && userData.rol !== expectedRole) {
      return NextResponse.json({ error: 'Acceso no autorizado para este perfil' }, { status: 403 });
    }

    // 4. Validar Estado
    if ((userData.estado || '').toLowerCase() !== 'activo') {
      return NextResponse.json({ error: 'Usuario desactivado' }, { status: 403 });
    }

    // 5. Generar JWT
    const token = await signJWT({
      uid: userDoc.id,
      username: userData.username,
      rol: userData.rol,
      nombre: userData.nombre,
      apellido: userData.apellido,
      escuelaId: userData.escuelaId
    });

    // 6. Enviar cookie HttpOnly
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        uid: userDoc.id, 
        username: userData.username, 
        rol: userData.rol,
        nombre: userData.nombre,
        apellido: userData.apellido,
        escuelaId: userData.escuelaId
      } 
    });

    response.cookies.set('siged_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8 // 8 horas
    });

    return response;

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
