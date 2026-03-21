SIGED - DIGEV 🎓

SIGED - DIGEV es una plataforma web desarrollada para la gestión educativa de la Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N. (República Dominicana).

El sistema funciona como un panel administrativo (dashboard) que permite gestionar en tiempo real centros educativos, estudiantes, docentes y ofertas académicas, optimizando los procesos institucionales y reduciendo la carga operativa manual.

Características
Gestión completa de Escuelas, Sedes, Períodos y Oferta Académica.
Registro integral de docentes con información personal, laboral y formación.
Creación y control de secciones (clases), incluyendo asignación de docentes y cupos.
Generación de reportes en formatos PDF, Excel y Word con membretes institucionales.
Sistema de autenticación con distintos roles de usuario (Admin, Super Admin, etc.).
Actualización de datos en tiempo real gracias a Firebase.
Interfaz moderna, dinámica y responsiva.
Estructura del Proyecto

El proyecto está organizado en base a una arquitectura moderna con Next.js (App Router), separando lógica, componentes y servicios:

app/: Rutas principales del sistema (App Router).
components/: Componentes reutilizables de la interfaz.
lib/ o services/: Lógica de negocio y conexión con Firebase.
styles/: Configuración de estilos globales (Tailwind).
public/: Archivos estáticos.
Instalación
Clona el repositorio:
git clone https://github.com/CarlosGomez29/Proyect-SIGED.git
Accede al directorio del proyecto:
cd Proyect-SIGED
Instala las dependencias:
npm install
Configura las variables de entorno (Firebase):
Crea un archivo .env.local en la raíz del proyecto y agrega:
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
Uso
Inicia el servidor de desarrollo:
npm run dev
Abre la aplicación en tu navegador:
http://localhost:3000
Interactúa con el sistema:
Gestiona docentes, estudiantes y ofertas académicas.
Crea secciones y asigna profesores.
Genera reportes institucionales.
Personalización
Roles de usuario: Puedes adaptar la lógica para agregar nuevos roles o permisos.
Diseño: Modificable fácilmente con Tailwind CSS y componentes de shadcn/ui.
Reportes: Puedes extender la generación de documentos agregando nuevos formatos o estructuras.
Firebase: Se puede escalar a nuevas colecciones o servicios según necesidades institucionales.
Requisitos
Node.js (versión recomendada LTS)
npm
Cuenta activa en Firebase
Navegador web moderno
Tecnologías Utilizadas
Next.js 15 (App Router)
React 18
TypeScript
Tailwind CSS
shadcn/ui (Radix UI)
Framer Motion
Firebase (Firestore)
Librerías: jspdf, xlsx, docx
Comandos Disponibles
npm run dev: Ejecuta el entorno de desarrollo.
npm run build: Construye la aplicación para producción.
npm run lint: Analiza el código con ESLint.
npm run typecheck: Verifica errores de tipos en TypeScript.
Estructura del Código
app/: Define las rutas y vistas principales del sistema.
components/: Componentes UI reutilizables.
services/ o lib/: Conexión con Firebase y lógica del sistema.
Configuración adicional distribuida en archivos de entorno y estilos.

Autor: Carlos Gómez
Repositorio: https://github.com/CarlosGomez29/Proyect-SIGED
