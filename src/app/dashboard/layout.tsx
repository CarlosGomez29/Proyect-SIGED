
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  School,
  Users,
  Settings,
  Award,
  BarChart3,
  ShieldCheck,
  LogOut,
  LifeBuoy,
  CalendarDays
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
import { Icons } from "@/components/icons";
import DashboardHeader from "@/components/dashboard-header";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleLogout, role } = useAuth();
  const pathname = usePathname();

  const menuInicio = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin" },
  ];

  const menuInstituciones = [
    { label: "Escuelas", icon: School, href: "/dashboard/admin/escuelas" },
    { label: "Usuarios", icon: Users, href: "/dashboard/admin/usuarios" },
  ];

  const menuAcademico = [
    { label: "Periodos Académicos", icon: CalendarDays, href: "/dashboard/admin/periodos" },
    { label: "Configuración Académica", icon: Settings, href: "/dashboard/admin/academica" },
    { label: "Certificaciones", icon: Award, href: "/dashboard/admin/certificaciones" },
  ];

  const menuSistema = [
    { label: "Reportes", icon: BarChart3, href: "/dashboard/admin/reportes" },
    { label: "Auditoría", icon: ShieldCheck, href: "/dashboard/admin/auditoria" },
  ];

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
              <AvatarFallback className="bg-primary/5 text-primary">
                <Icons.logo className="h-10 w-10 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-bold text-foreground text-sm tracking-tight">SIGED - DIGEV</p>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-bold text-primary uppercase tracking-widest">
                {role === 'superadmin' ? 'Super Admin' : 'Portal Administrativo'}
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 space-y-6">
            {role === 'superadmin' && (
              <>
                <div className="px-4">
                  <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Inicio</p>
                  {renderMenuItems(menuInicio)}
                </div>

                <div className="px-4">
                  <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Instituciones y Usuarios</p>
                  {renderMenuItems(menuInstituciones)}
                </div>

                <div className="px-4">
                  <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Gestión Académica</p>
                  {renderMenuItems(menuAcademico)}
                </div>

                <div className="px-4 pb-8">
                  <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Sistema y Control</p>
                  {renderMenuItems(menuSistema)}
                </div>
              </>
            )}
            {role !== 'superadmin' && (
              <div className="px-4 pb-8 pt-4 flex justify-center text-sm text-center text-muted-foreground opacity-70">
                Solo el Super Admin puede ver estas opciones.
              </div>
            )}
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border/50">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Centro de Ayuda">
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
