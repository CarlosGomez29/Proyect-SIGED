
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings2,
  School,
  UserCog,
  Settings,
  CalendarRange,
  BookCheck,
  Library,
  Layers,
  ClipboardList,
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  Send,
  FileCheck,
  BarChart3,
  ShieldCheck,
  Activity,
  History,
  Database,
  ChevronRight,
  LogOut,
  LifeBuoy,
  BarChart,
  UsersRound,
  UserSquare,
  BookOpen,
  ListTodo,
  FileSignature
} from "lucide-react";

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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icons } from "@/components/icons";
import DashboardHeader from "@/components/dashboard-header";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleLogout } = useAuth();
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/50">
        <Sidebar className="border-r border-border/50 bg-background/80 backdrop-blur-xl">
          <SidebarHeader>
            <div className="flex items-center gap-3 p-4" data-sidebar="header-content">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icons.logo className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black font-headline tracking-tighter text-primary leading-none">SIGED - DIGEV</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Super Admin</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-2">
            <SidebarMenu className="gap-1">
              {/* 1. Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === "/dashboard/admin"}>
                  <Link href="/dashboard/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 2. Gestión del Sistema */}
              <CollapsibleMenu
                title="Gestión del Sistema"
                icon={Settings2}
                items={[
                  { label: "Escuelas", icon: School, href: "/dashboard/admin/escuelas", subItems: ["Crear escuela", "Gestionar escuelas"] },
                  { label: "Usuarios", icon: UserCog, href: "/dashboard/admin/usuarios", subItems: ["Crear usuario", "Gestionar usuarios", "Asignar roles"] },
                ]}
              />

              {/* 3. Configuración Académica */}
              <CollapsibleMenu
                title="Configuración Académica"
                icon={Settings}
                items={[
                  { label: "Períodos", icon: CalendarRange, href: "/dashboard/admin/periodos", subItems: ["Crear período", "Gestionar períodos"] },
                  { label: "Cursos", icon: BookCheck, href: "/dashboard/admin/cursos", subItems: ["Crear acción formativa", "Gestionar acciones"] },
                ]}
              />

              {/* 4. Gestión Académica Global */}
              <SidebarSectionTitle title="Gestión Académica Global" />
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Secciones Globales">
                  <Link href="/dashboard/admin/global/secciones">
                    <Layers />
                    <span>Secciones Globales</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Inscripciones Globales">
                  <Link href="/dashboard/admin/global/inscripciones">
                    <ClipboardList />
                    <span>Inscripciones Globales</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Docentes Registrados">
                  <Link href="/dashboard/admin/global/docentes">
                    <Users />
                    <span>Docentes Registrados</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Estudiantes Registrados">
                  <Link href="/dashboard/admin/global/estudiantes">
                    <GraduationCap />
                    <span>Estudiantes Registrados</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 5. Certificaciones */}
              <CollapsibleMenu
                title="Certificaciones"
                icon={Award}
                items={[
                  { label: "Secciones Finalizadas", icon: CheckCircle2, href: "/dashboard/admin/certificados/finalizadas" },
                  { label: "Publicar Certificados", icon: Send, href: "/dashboard/admin/certificados/publicar" },
                  { label: "Historial de Certificados", icon: FileCheck, href: "/dashboard/admin/certificados/historial" },
                ]}
              />

              {/* 6. Reportes Globales */}
              <CollapsibleMenu
                title="Reportes Globales"
                icon={BarChart3}
                items={[
                  { label: "Reporte Escuelas", icon: BarChart, href: "/dashboard/admin/reportes/escuelas" },
                  { label: "Reporte Estudiantes", icon: UsersRound, href: "/dashboard/admin/reportes/estudiantes" },
                  { label: "Reporte Docentes", icon: UserSquare, href: "/dashboard/admin/reportes/docentes" },
                  { label: "Reporte Cursos", icon: BookOpen, href: "/dashboard/admin/reportes/cursos" },
                  { label: "Reporte Secciones", icon: ListTodo, href: "/dashboard/admin/reportes/secciones" },
                  { label: "Reporte Certificados", icon: FileSignature, href: "/dashboard/admin/reportes/certificados" },
                ]}
              />

              {/* 7. Auditoría del Sistema */}
              <CollapsibleMenu
                title="Auditoría"
                icon={ShieldCheck}
                items={[
                  { label: "Actividad Usuarios", icon: Activity, href: "/dashboard/admin/auditoria/actividad" },
                  { label: "Historial Acciones", icon: History, href: "/dashboard/admin/auditoria/historial" },
                  { label: "Registro Sistema", icon: Database, href: "/dashboard/admin/auditoria/sistema" },
                ]}
              />
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border/50">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="#" tooltip="Centro de Ayuda">
                  <Link href="#">
                    <LifeBuoy />
                    <span>Ayuda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <LogOut />
                  <span className="font-bold">Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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

function SidebarSectionTitle({ title }: { title: string }) {
  return (
    <li className="mt-6 mb-2 px-4">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</span>
    </li>
  );
}

function CollapsibleMenu({ 
  title, 
  icon: Icon, 
  items 
}: { 
  title: string; 
  icon: any; 
  items: { label: string; icon: any; href: string; subItems?: string[] }[] 
}) {
  return (
    <Collapsible className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            <Icon className="shrink-0" />
            <span className="flex-1">{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu className="mt-1 gap-1 border-l border-border/50 ml-4 pl-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.label}>
                {item.subItems ? (
                  <Collapsible className="group/sub-collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="h-9 text-xs">
                        <item.icon className="h-3.5 w-3.5 opacity-70" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="ml-auto h-3 w-3 opacity-50 group-data-[state=open]/sub-collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="mt-1 ml-4 space-y-1 border-l border-border/30 pl-3">
                        {item.subItems.map((sub) => (
                          <li key={sub}>
                            <Link href="#" className="block py-1.5 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors">
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild className="h-9 text-xs">
                    <Link href={item.href}>
                      <item.icon className="h-3.5 w-3.5 opacity-70" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
