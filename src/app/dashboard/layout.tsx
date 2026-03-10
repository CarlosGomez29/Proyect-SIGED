
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

  const superAdminMenu = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin" },
    { label: "Escuelas", icon: School, href: "/dashboard/admin/escuelas" },
    { label: "Usuarios", icon: Users, href: "/dashboard/admin/usuarios" },
    { label: "Periodos Académicos", icon: CalendarDays, href: "/dashboard/admin/periodos" },
    { label: "Configuración Académica", icon: Settings, href: "/dashboard/admin/academica" },
    { label: "Certificaciones", icon: Award, href: "/dashboard/admin/certificaciones" },
    { label: "Reportes", icon: BarChart3, href: "/dashboard/admin/reportes" },
    { label: "Auditoría", icon: ShieldCheck, href: "/dashboard/admin/auditoria" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/50">
        <Sidebar className="border-r border-border/50 bg-background/80 backdrop-blur-xl">
          <SidebarHeader>
            <div className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icons.logo className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black font-headline tracking-tighter text-primary leading-none">SIGED - DIGEV</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {role === 'super-admin' ? 'Super Admin' : 'Portal Administrativo'}
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-2">
            <SidebarMenu className="gap-1">
              {role === 'super-admin' && superAdminMenu.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label} isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
