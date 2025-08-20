
"use client";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    BookCopy,
    CalendarClock,
    ClipboardCheck,
    FileText,
    GraduationCap,
    PlusCircle,
    UserPlus,
    Users,
    Wallet,
    BadgePercent
  } from "lucide-react";
  
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  import { EnrollmentChart } from "@/components/enrollment-chart";
  import { Separator } from "@/components/ui/separator";
  import { motion } from "framer-motion";
  import Link from "next/link";
  
  const alumnosData = [
    { id: 1, nombre: "Juan", apellido: "Pérez", curso: "Seguridad de la Carga Aérea", estado: "Activo" },
    { id: 2, nombre: "María", apellido: "García", curso: "Mercancías Peligrosas", estado: "Activo" },
    { id: 3, nombre: "Carlos", apellido: "López", curso: "AVSEC para Tripulación", estado: "Inactivo" },
    { id: 4, nombre: "Ana", apellido: "Martínez", curso: "Manejo de Crisis", estado: "Activo" },
    { id: 5, nombre: "Luis", apellido: "Hernández", curso: "Seguridad Aeroportuaria", estado: "Suspendido" },
    { id: 6, nombre: "Laura", apellido: "Gómez", curso: "Seguridad de la Carga Aérea", estado: "Activo" },
    { id: 7, nombre: "José", apellido: "Díaz", curso: "Mercancías Peligrosas", estado: "Activo" },
  ];
  
  const inscripcionesData = [
    { id: 1, alumno: "Carlos López", curso: "Seguridad Aeroportuaria", fecha: "2024-05-20", estado: "Pendiente" },
    { id: 2, alumno: "Ana Martínez", curso: "Manejo de Crisis", fecha: "2024-05-19", estado: "Aprobada" },
    { id: 3, alumno: "Luis Hernández", curso: "Mercancías Peligrosas", fecha: "2024-05-18", estado: "Rechazada" },
    { id: 4, alumno: "Laura Gómez", curso: "AVSEC para Tripulación", fecha: "2024-05-17", estado: "Pendiente" },
    { id: 5, alumno: "José Díaz", curso: "Seguridad de la Carga Aérea", fecha: "2024-05-16", estado: "Aprobada" },
  ];

  const alumnosActivos = alumnosData.filter(a => a.estado === 'Activo').length;
  const inscripcionesPendientes = inscripcionesData.filter(i => i.estado === 'Pendiente').length;

  const statCards = [
      { title: "Alumnos Activos", value: alumnosActivos, delta: "En tiempo real", icon: Users, link: "/dashboard-admin/alumnos" },
      { title: "Inscripciones Pendientes", value: inscripcionesPendientes, delta: "Requieren aprobación", icon: ClipboardCheck, color: "text-amber-500", link: "/dashboard-admin/inscripciones" },
      { title: "Instructores Asignados", value: "8", delta: "Activos en cursos", icon: GraduationCap, link: "/dashboard-admin/instructores" },
      { title: "Próximas Evaluaciones", value: "9", delta: "En los próximos 7 días", icon: CalendarClock, link: "/dashboard-admin/evaluaciones" },
      { title: "Certificados Emitidos", value: "4,502", delta: "Total histórico", icon: FileText, link: "/dashboard-admin/certificados" }
  ];
  
  const quickActions = [
      { label: "Registrar Alumno", icon: UserPlus, link: "/dashboard-admin/alumnos" },
      { label: "Crear Nuevo Curso", icon: BookCopy, link: "/dashboard-admin/cursos" },
      { label: "Gestionar Inscripciones", icon: ClipboardCheck, link: "/dashboard-admin/inscripciones" },
  ];
  
  const recentActivity = [
      { type: "Nuevo Alumno", description: "Juan Pérez se ha registrado.", time: "hace 5 min", icon: UserPlus },
      { type: "Inscripción", description: "Maria Rodriguez se inscribió en Seguridad de la Carga Aérea.", time: "hace 15 min", icon: ClipboardCheck },
      { type: "Calificación Registrada", description: "Se registró la calificación de Carlos Gomez.", time: "hace 1 hora", icon: GraduationCap },
      { type: "Certificado Emitido", description: "Se emitió certificado para Ana Martinez.", time: "hace 3 horas", icon: FileText },
  ];
  
  export default function DashboardAdminPage() {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dashboard Principal del Administrador
        </h1>
  
        {/* Visión General y Métricas Clave */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-5">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.delta}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
  
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Acciones Rápidas */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold font-headline mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                     whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                  >
                    <Link href={action.link} passHref>
                        <Button variant="outline" className="h-24 flex-col gap-2 justify-center text-sm w-full">
                          <action.icon className="h-6 w-6" />
                          <span>{action.label}</span>
                        </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
  
            {/* Alertas y Actividad Reciente */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Tabs defaultValue="alerts">
                <TabsList>
                  <TabsTrigger value="alerts">Alertas y Notificaciones</TabsTrigger>
                  <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
                </TabsList>
                <TabsContent value="alerts">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <div>
                              <p className="font-medium">{inscripcionesPendientes} Inscripciones pendientes de aprobación</p>
                              <p className="text-sm text-muted-foreground">Revise y confirme las nuevas solicitudes.</p>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto"><ArrowRight className="h-4 w-4"/></Button>
                      </div>
                       <Separator />
                       <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                          <AlertTriangle className="h-5 w-5 text-blue-500" />
                          <div>
                              <p className="font-medium">5 cursos inician la próxima semana</p>
                              <p className="text-sm text-muted-foreground">Prepare la logística y bienvenida.</p>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto"><ArrowRight className="h-4 w-4"/></Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="activity">
                   <Card>
                    <CardContent className="p-4 space-y-2">
                      {recentActivity.map((item, index) => (
                           <motion.div 
                            key={`${item.description}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                              <item.icon className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-grow">
                                  <p className="font-medium">{item.type}</p>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.time}</p>
                          </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.section>
          </div>
  
          {/* Estadísticas y Tendencias */}
          <div className="lg:col-span-1 space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
               <h2 className="text-xl font-semibold font-headline mb-4">Tendencia de Inscripciones</h2>
              <Card>
                <CardHeader>
                   <CardDescription>
                      Análisis de inscripciones en los últimos 6 meses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnrollmentChart />
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </div>
      </div>
    );
  }
  
