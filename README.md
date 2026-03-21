# SIGED - DIGEV 🎓

**SIGED - DIGEV** es una aplicación web desarrollada con Next.js que funciona como un sistema integrado de gestión educativa para la *Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N.* (República Dominicana).

Permite administrar en tiempo real centros educativos, estudiantes, docentes y ofertas académicas, optimizando los procesos institucionales y facilitando la toma de decisiones.

## Características

- Gestión completa de Escuelas, Sedes, Períodos y Oferta Académica.
- Registro integral de docentes con información personal, laboral y formación.
- Creación y control de secciones (clases), incluyendo asignación de docentes y cupos.
- Generación de reportes en formato **PDF**, **Excel** y **Word**.
- Sistema de autenticación con distintos roles de usuario.
- Actualización de datos en tiempo real mediante Firebase.
- Interfaz moderna, dinámica y responsiva.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- `app`: Contiene las rutas principales del sistema (App Router).
- `components`: Componentes reutilizables de la interfaz.
- `services` o `lib`: Lógica de negocio y conexión con Firebase.
- `styles`: Configuración de estilos globales.
- `public`: Archivos estáticos.

## Instalación

1. **Clona el repositorio:**  
```bash
git clone https://github.com/CarlosGomez29/Proyect-SIGED.git
```

2. **Accede al proyecto:**  
```bash
cd Proyect-SIGED
```

3. **Instala las dependencias:**  
```bash
npm install
```

4. **Configura las variables de entorno:**  
Crea un archivo `.env.local` en la raíz del proyecto y agrega:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## Uso

1. **Ejecuta el proyecto:**  
```bash
npm run dev
```

2. **Abre la aplicación:**  
http://localhost:3000

3. **Funcionalidades:**
- Gestión de docentes, estudiantes y centros.
- Creación de secciones académicas.
- Generación de reportes institucionales.

## Personalización

- **Roles:** Puedes adaptar el sistema de permisos según la institución.
- **Diseño:** Modificable con Tailwind CSS y componentes UI.
- **Reportes:** Extensible a nuevos formatos o estructuras.
- **Firebase:** Escalable según las necesidades del sistema.

## Requisitos

- Node.js (versión LTS recomendada)
- npm
- Cuenta en Firebase
- Navegador web moderno

## Estructura del Código

- `app/`: Rutas principales del sistema.
- `components/`: Componentes reutilizables.
- `services/` o `lib/`: Lógica del sistema y conexión a Firebase.
- Archivos de configuración para estilos y entorno.

---

**Autor:** Carlos Gómez  
**Repositorio:** Proyect-SIGED
