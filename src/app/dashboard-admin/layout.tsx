
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Library,
  UsersRound,
  UserPlus,
  ClipboardList,
  Globe,
  UserMinus,
  Search,
  Activity,
  History,
  BarChart3,
  FileStack,
  ShieldAlert,
  ArrowLeftCircle
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
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import { useAuth } from "@/contexts/auth-context";

const academicOffering = [
  { href: "/dashboard-admin/secciones/apertura", label: "Apertura de Secciones", icon: PlusCircle },
  { href: "/dashboard-admin/cursos", label: "Gestión de Secciones", icon: Library },
  { href: "/dashboard-admin/docentes", label: "Docentes", icon: Users },
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
  const { impersonatedSchool, stopImpersonation, role } = useAuth();

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
                src="/img/logo-digev.jpg"
                alt="Admin Profile"
              />
              <AvatarFallback className="bg-primary/5 text-primary">AD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-bold text-foreground text-sm tracking-tight">SIGED - DIGEV</p>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-bold text-primary uppercase tracking-widest">
                {impersonatedSchool ? impersonatedSchool.nombre : 'Administrador de escuela'}
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
            <div className="flex items-center justify-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">SIGED v0.1.0</span>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          {impersonatedSchool && (
            <div className="bg-primary px-6 py-2 flex items-center justify-between animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-3 text-white">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Modo Super Admin — Administrando: <span className="underline">{impersonatedSchool.nombre}</span>
                </span>
              </div>
              <Button
                onClick={stopImpersonation}
                variant="outline"
                size="sm"
                className="h-7 px-4 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white text-[10px] font-black uppercase tracking-tighter"
              >
                <ArrowLeftCircle className="h-3 w-3 mr-2" /> Salir de esta escuela
              </Button>
            </div>
          )}
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
