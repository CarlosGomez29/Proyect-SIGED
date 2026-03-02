
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Library,
  Trash2,
  UsersRound,
  UserPlus,
  ClipboardList,
  Globe,
  UserMinus,
  GraduationCap,
  Search,
  Activity,
  History,
  BarChart3,
  FileStack,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard-header";

const academicOffering = [
    { href: "/dashboard-admin/docentes", label: "Docentes", icon: Users },
    { href: "/dashboard-admin/secciones/apertura", label: "Apertura de Secciones", icon: PlusCircle },
    { href: "/dashboard-admin/cursos", label: "Gestión de Secciones", icon: Library },
    { href: "/dashboard-admin/secciones/limpieza", label: "Eliminar Sección Vacía", icon: Trash2 },
];

const studentsModule = [
    { href: "/dashboard-admin/alumnos", label: "Gestión de Estudiantes", icon: UsersRound },
    { href: "/dashboard-admin/solicitudes", label: "Solicitudes de Ingreso", icon: UserPlus },
];

const academicManagement = [
    { href: "/dashboard-admin/inscripciones", label: "Inscripciones", icon: ClipboardList },
    { href: "/dashboard-admin/inscripciones-web", label: "Inscripciones Web", icon: Globe },
    { href: "/dashboard-admin/inscripciones/liberar", label: "Liberar Inscripción", icon: UserMinus },
    { href: "/dashboard-admin/calificaciones", label: "Calificaciones", icon: GraduationCap },
];

const reportsModule = [
    { href: "/dashboard-admin/consultas", label: "Consultas", icon: Search },
    { href: "/dashboard-admin/ocupacion", label: "Ocupación", icon: Activity },
    { href: "/dashboard-admin/historicos", label: "Históricos", icon: History },
    { href: "/dashboard-admin/graficas", label: "Gráficas", icon: BarChart3 },
    { href: "/dashboard-admin/reportes", label: "Reportes Avanzados", icon: FileStack },
];

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const renderMenuItems = (items: any[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            tooltip={item.label}
            isActive={pathname === item.href}
          >
            <Link href={item.href} className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="p-6 flex flex-col items-center justify-center text-center gap-3">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src="https://placehold.co/80x80.png" alt="Admin" data-ai-hint="person" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-foreground text-sm">Administrador</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Gestión Académica</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4 py-2 space-y-6">
            <div>
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">General</p>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === "/dashboard-admin"}>
                    <Link href="/dashboard-admin" className="flex items-center gap-3">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Resumen General</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div>
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Oferta Académica</p>
              {renderMenuItems(academicOffering)}
            </div>

            <div>
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estudiantes</p>
              {renderMenuItems(studentsModule)}
            </div>

            <div>
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gestión Académica</p>
              {renderMenuItems(academicManagement)}
            </div>

            <div>
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reportes e Indicadores</p>
              {renderMenuItems(reportsModule)}
            </div>
          </SidebarContent>

          <SidebarFooter className="p-6 border-t bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={`https://placehold.co/32x32.png?text=${i}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">+72 Activos</span>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <SidebarInset>
            <main className="flex-1 p-4 lg:p-8 bg-muted/5">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
