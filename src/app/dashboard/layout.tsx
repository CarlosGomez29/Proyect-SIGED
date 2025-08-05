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

  const { handleLogout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader>
             <div className="flex items-center gap-2 p-2" data-sidebar="header-content">
                <Icons.logo className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-semibold font-headline">ESAC</h1>
             </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/admin" tooltip="Dashboard" isActive>
                  <Link href="/dashboard/admin">
                    <LayoutDashboard />
                    Dashboard
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
                    Inscripciones
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/alumnos" tooltip="Alumnos">
                  <Link href="/dashboard/alumnos">
                    <UsersRound />
                    Alumnos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/cursos" tooltip="Cursos">
                  <Link href="/dashboard/cursos">
                    <Library />
                    Cursos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/calificaciones" tooltip="Calificaciones">
                  <Link href="/dashboard/calificaciones">
                    <GraduationCap />
                    Calificaciones
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/reportes" tooltip="Reportes">
                  <Link href="/dashboard/reportes">
                    <BarChartHorizontal />
                    Reportes
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
                    Ayuda
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/ajustes" tooltip="Ajustes">
                  <Link href="/dashboard/ajustes">
                    <Settings />
                    Ajustes
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
                  <LogOut />
                  Cerrar Sesión
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <SidebarInset>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
