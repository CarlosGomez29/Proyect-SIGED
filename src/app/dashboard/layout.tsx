
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  UsersRound,
  Library,
  ClipboardList,
  GraduationCap,
  Wallet,
  BarChartHorizontal,
  Settings,
  LifeBuoy,
  LogOut
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
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import DashboardHeader from "@/components/dashboard-header";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { handleLogout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
             <div className="flex items-center gap-2 p-2" data-sidebar="header-content">
                <Icons.logo className="h-8 w-8 text-primary" />
                <span className="text-xl font-semibold font-headline">SIGED</span>
             </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/admin" tooltip="Dashboard" isActive>
                  <Link href="/dashboard/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  href="/dashboard/inscripciones"
                  tooltip="Inscripciones"
                >
                  <Link href="/dashboard/inscripciones">
                    <ClipboardList />
                    <span>Inscripciones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/alumnos" tooltip="Alumnos">
                  <Link href="/dashboard/alumnos">
                    <UsersRound />
                    <span>Alumnos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/cursos" tooltip="Cursos">
                  <Link href="/dashboard/cursos">
                    <Library />
                    <span>Cursos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/calificaciones" tooltip="Calificaciones">
                  <Link href="/dashboard/calificaciones">
                    <GraduationCap />
                    <span>Calificaciones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/reportes" tooltip="Reportes">
                  <Link href="/dashboard/reportes">
                    <BarChartHorizontal />
                    <span>Reportes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="#" tooltip="Ayuda">
                  <Link href="#">
                    <LifeBuoy />
                    <span>Ayuda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/ajustes" tooltip="Ajustes">
                  <Link href="/dashboard/ajustes">
                    <Settings />
                    <span>Ajustes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
                  <LogOut />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <DashboardHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
              {children}
            </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
