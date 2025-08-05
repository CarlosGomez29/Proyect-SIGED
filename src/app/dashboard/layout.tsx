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
  Calendar,
  LifeBuoy,
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
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import DashboardHeader from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.08V15h-2v-2h2v-1.92c0-2.11 1.28-3.08 3-3.08.88 0 1.62.06 1.83.09v1.82h-1.09c-1.03 0-1.23.49-1.23 1.2v1.89h2.16l-.28 2h-1.88v2.08c-2.02.43-3.8.1-4.71-.42z"/></svg>
              <h1 className="text-xl font-semibold font-headline text-sidebar-foreground">ESAC</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/admin" tooltip="Dashboard">
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
                  isActive
                >
                  <Link href="/dashboard/inscripciones">
                    <ClipboardList />
                    Inscripciones
                    <SidebarMenuBadge>150</SidebarMenuBadge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/alumnos" tooltip="Alumnos">
                  <Link href="/dashboard/alumnos">
                    <UsersRound />
                    Alumnos
                    <SidebarMenuBadge>90</SidebarMenuBadge>
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
                <SidebarMenuButton asChild href="/dashboard/pagos" tooltip="Pagos">
                  <Link href="/dashboard/pagos">
                    <Wallet />
                    Pagos
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
                <SidebarMenuButton asChild href="/dashboard/ajustes" tooltip="Ajustes">
                  <Link href="/dashboard/ajustes">
                    <Settings />
                    Ajustes
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="#" tooltip="Ayuda">
                  <Link href="#">
                    <LifeBuoy />
                    Ayuda
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 bg-background">
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