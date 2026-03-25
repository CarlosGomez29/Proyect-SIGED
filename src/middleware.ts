import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth-server';

// Rutas que requieren validación de rol específica
const ROLE_ROUTES: Record<string, string[]> = {
  '/dashboard-admin': ['superadmin', 'admin'],
  '/dashboard-admision': ['admision'],
  '/dashboard-docente': ['docente'],
  '/dashboard-alumno': ['alumno'],
  '/dashboard-instructor': ['instructor', 'superadmin'],
  '/dashboard/admin': ['superadmin'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('siged_session')?.value;

  // 1. Identificar si es una ruta protegida (Dashboard o API sensible)
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/dashboard-');
  const isApiRoute = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/login');

  if (isDashboardRoute || isApiRoute) {
    if (!token) {
      console.log(`[Middleware] No token found for ${pathname}. Redirecting to /login`);
      if (isApiRoute) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      console.log(`[Middleware] Invalid JWT for ${pathname}. Redirecting to /login`);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('siged_session');
      return response;
    }
    console.log(`[Middleware] Valid JWT for ${pathname}. User: ${payload.username}, Role: ${payload.rol}`);

    // 2. Validación de ROLES (Autorización en Middleware)
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(routePrefix)) {
        if (!allowedRoles.includes(payload.rol)) {
            // Si el rol no coincide, redirigir a su propio dashboard o login
            return NextResponse.redirect(new URL('/login', request.url));
        }
      }
    }
  }

  // 3. INYECCIÓN DE HEADERS DE SEGURIDAD (Hardening)
  const response = NextResponse.next();
  
  // CSP: Política de Seguridad de Contenido estricta
  // Ajustada para permitir los recursos necesarios de este proyecto
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://firebasestorage.googleapis.com;
    font-src 'self' data:;
    connect-src 'self' https://firestore.googleapis.com https://esac-manager.firebaseio.com;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
}

// Configurar los matchers para el middleware
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/dashboard-admin/:path*', 
    '/dashboard-admision/:path*', 
    '/dashboard-alumno/:path*', 
    '/dashboard-docente/:path*',
    '/dashboard-instructor/:path*',
    '/api/:path*'
  ],
};
