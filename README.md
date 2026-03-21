# SIGED - DIGEV 🎓

**Sistema Integrado de Gestión Educativa** para la *Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N.* (República Dominicana).

Este proyecto es el Panel de Control Administrativo (Dashboard) diseñado para modernizar y optimizar la gestión de centros educativos, estudiantes, docentes y ofertas académicas en tiempo real.

## ✨ Características Principales

- **Gestión Institucional**: Administración completa de Escuelas, Sedes, Períodos y Oferta Académica.
- **Módulo de Docentes**: Registro integral de profesores, incluyendo datos personales, perfil laboral, formación militar y hoja de vida.
- **Apertura y Control de Secciones**: Creación de nuevas clases, asignación de docentes, control de métricas de cupos y horarios.
- **Exportación de Reportes**: Generación automática de reportes oficiales en formato **PDF**, **Excel** y **Word** con membretes institucionales configurados.
- **Autenticación y Roles**: Accesos en distintos niveles (por ejemplo, Portal Administrativo y Super Admin).
- **Arquitectura en Tiempo Real**: Construido sobre Firebase para garantizar la fluidez de datos al instante sin recargar.

## 🛠️ Tecnologías y Herramientas

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) y [React 18](https://react.dev/)
- **Lenguaje**: TypeScript
- **Estilos e Interfaces**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Manejo de Animaciones**: [Framer Motion](https://www.framer.com/motion/) para dar modernidad a los componentes.
- **Base de Datos & Servicios**: [Firebase](https://firebase.google.com/) (Firestore)
- **Librerías de Reportes**: `jspdf` (PDF), `xlsx` (Excel), `docx` (Word).

## 🚀 Guía de Instalación Local

Sigue estos pasos básicos para clonar y levantar el proyecto en tu máquina local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/CarlosGomez29/Proyect-SIGED.git
cd Proyect-SIGED
```

### 2. Instalar las Dependencias
El proyecto utiliza [npm](https://www.npmjs.com/) como gestor de paquetes.
```bash
npm install
```

### 3. Configurar Variables de Entorno (Firebase)
Para que la base de datos funcione, necesitas crear un archivo `.env` o `.env.local` en la carpeta raíz y agregar las credenciales correspondientes de Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 4. Levantar el Servidor de Desarrollo
El proyecto usa Turbopack para que cargue mucho más rápido.
```bash
npm run dev
```
Finalmente, abre tu navegador en [http://localhost:3000](http://localhost:3000) para visualizar el sistema en tiempo real.

## 📦 Comandos y Scripts Disponibles

- `npm run dev`: Arranca el servidor de desarrollo.
- `npm run build`: Construye y empaqueta la aplicación de forma optimizada para su pase a producción.
- `npm run lint`: Busca y detecta advertencias en el código mediante ESLint.
- `npm run typecheck`: Revisa todo el código de TypeScript para asegurar que no hay errores de tipo antes de compilar.

---
*Plataforma desarrollada para la modernización de los procesos académicos de las Escuelas Vocacionales DIGEV.*
