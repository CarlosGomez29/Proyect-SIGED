import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookCopy,
  CalendarClock,
  ClipboardCheck,
  FilePlus2,
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

const statCards = [
    { title: "Alumnos Activos", value: "1,254", delta: "+20.1% mes anterior", icon: Users, link: "/dashboard/alumnos" },
    { title: "Inscripciones Pendientes", value: "42", delta: "Requieren aprobación", icon: ClipboardCheck, color: "text-amber-500", link: "/dashboard/inscripciones" },
    { title: "Pagos Vencidos", value: "18", delta: "Necesitan seguimiento", icon: Wallet, color: "text-red-500", link: "/dashboard/pagos" },
    { title: "Instructores Asignados", value: "58", delta: "Activos en cursos", icon: GraduationCap, link: "/dashboard/instructores" },
    { title: "Próximas Evaluaciones", value: "9", delta: "En los próximos 7 días", icon: CalendarClock, link: "/dashboard/evaluaciones" },
];

const quickActions = [
    { label: "Registrar Alumno", icon: UserPlus, link: "/dashboard/alumnos/nuevo" },
    { label: "Registrar Pago", icon: Wallet, link: "/dashboard/pagos/nuevo" },
    { label: "Emitir Certificado", icon: FileText, link: "/dashboard/certificados/emitir" },
    { label: "Gestionar Instructores", icon: GraduationCap, link: "/dashboard/instructores" },
    { label: "Subir Material de Curso", icon: FilePlus2, link: "/dashboard/cursos/material" },
];

const recentActivity = [
    { type: "Nuevo Alumno", description: "Juan Pérez se ha registrado.", time: "hace 5 min", icon: UserPlus },
    { type: "Inscripción", description: "Maria Rodriguez se inscribió en Seguridad de la Carga Aérea.", time: "hace 15 min", icon: ClipboardCheck },
    { type: "Pago Registrado", description: "Se registró un pago de Carlos Gomez.", time: "hace 1 hora", icon: Wallet },
    { type: "Certificado Emitido", description: "Se emitió certificado para Ana Martinez.", time: "hace 3 horas", icon: FileText },
];

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight">
        Dashboard Principal del Administrador
      </h1>

      {/* Visión General y Métricas Clave */}
      <section>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.delta}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Acciones Rápidas */}
          <section>
            <h2 className="text-xl font-semibold font-headline mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Button key={action.label} variant="outline" className="h-20 flex-col gap-2 justify-center text-sm">
                  <action.icon className="h-6 w-6" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </section>

          {/* Alertas y Actividad Reciente */}
          <section>
            <Tabs defaultValue="alerts">
              <TabsList>
                <TabsTrigger value="alerts">Alertas y Notificaciones Críticas</TabsTrigger>
                <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
              </TabsList>
              <TabsContent value="alerts">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                            <p className="font-medium">42 Inscripciones pendientes de aprobación</p>
                            <p className="text-sm text-muted-foreground">Revise y confirme las nuevas solicitudes.</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto"><ArrowRight className="h-4 w-4"/></Button>
                    </div>
                     <Separator />
                    <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="font-medium">18 Pagos vencidos</p>
                            <p className="text-sm text-muted-foreground">Se requiere acción de seguimiento inmediata.</p>
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
                    {recentActivity.map(item => (
                         <div key={item.description} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                            <item.icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-grow">
                                <p className="font-medium">{item.type}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        {/* Estadísticas y Tendencias */}
        <div className="lg:col-span-1 space-y-6">
          <section>
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
          </section>
        </div>
      </div>
    </div>
  );
}
