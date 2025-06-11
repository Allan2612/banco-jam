import { NextRequest, NextResponse } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/accounts',
  '/transfers',
  '/settings'
]

// Rutas que solo pueden acceder usuarios NO autenticados
const authRoutes = [
  '/login',
  '/register'
]

// Rutas públicas que no necesitan verificación
const publicRoutes = [
  '/',
  '/about',
  '/contact'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Obtener el token/usuario del localStorage simulado via cookies
  const userCookie = request.cookies.get('jam_user')
  const isAuthenticated = !!userCookie?.value
  
  // Verificar si la ruta actual es protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Verificar si la ruta actual es de autenticación
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Si es una ruta protegida y no está autenticado
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si es una ruta de auth y YA está autenticado, redirigir al dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if (pathname.startsWith('/api') && pathname !== '/api/sinpe-transfer') {
    return new NextResponse('Bloqueado por políticas de seguridad', { status: 403 });
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};