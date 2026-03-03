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
    { href: "/dashboard-admin/secciones/apertura", label: "Apertura de Secciones", icon: PlusCircle },
    { href: "/dashboard-admin/docentes", label: "Docentes", icon: Users },
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
    <SidebarMenu className="gap-1 px-2">
      {items.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            tooltip={item.label}
            isActive={pathname === item.href}
            className="rounded-lg transition-all duration-200"
          >
            <Link href={item.href} className="flex items-center gap-3">
              <item.icon className="h-[18px] w-[18px]" />
              <span className="font-medium">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/50">
        <Sidebar className="border-r border-border/50 bg-background/80 backdrop-blur-xl">
          <SidebarHeader className="p-8 flex flex-col items-center justify-center text-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-primary/10 shadow-xl ring-2 ring-background">
              <AvatarImage 
                src="https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/464333115_966007555565670_4128720996564005167_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=EMvGNmceS2MQ7kNvwEsOLIQ&_nc_oc=Adn7yCmL1L0d_q_T3RmKPjlNzNjoymkuBFubAEUATP6uhRXx1xO45dP6A-fSHuRry6k&_nc_zt=23&_nc_ht=scontent.fhex4-1.fna&_nc_gid=35N8dRsWtTgy_9p_7yqYng&_nc_ss=8&oh=00_AfxRE-ecS-k6qO0l6hnbMY25NXpjbn4q3gKAjekZExqomQ&oe=69ACA028" 
                alt="Admin Profile" 
                data-ai-hint="institutional logo" 
              />
              <AvatarFallback className="bg-primary/5 text-primary">AD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-bold text-foreground text-sm tracking-tight">Panel Administrativo</p>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-bold text-primary uppercase tracking-widest">
                DIGEV - Institucional
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-2 space-y-6">
            <div className="px-4">
              <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Inicio</p>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === "/dashboard-admin"} className="rounded-lg">
                    <Link href="/dashboard-admin" className="flex items-center gap-3">
                      <LayoutDashboard className="h-[18px] w-[18px]" />
                      <span className="font-medium">Resumen General</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div className="px-4">
              <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Oferta Académica</p>
              {renderMenuItems(academicOffering)}
            </div>

            <div className="px-4">
              <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Estudiantes</p>
              {renderMenuItems(studentsModule)}
            </div>

            <div className="px-4">
              <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Gestión</p>
              {renderMenuItems(academicManagement)}
            </div>

            <div className="px-4 pb-8">
              <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Reportes</p>
              {renderMenuItems(reportsModule)}
            </div>
          </SidebarContent>

          <SidebarFooter className="p-6 border-t border-border/50 bg-muted/5">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="h-7 w-7 border-2 border-background shadow-sm">
                    <AvatarImage src={`https://picsum.photos/seed/stu${i}/32/32`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">+72 Activos</span>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <SidebarInset className="bg-transparent">
            <main className="flex-1 p-6 lg:p-10">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
