
import Link from "next/link";
import {
  BookOpenCheck,
  ClipboardList,
  LayoutDashboard,
  Settings,
  UsersRound,
  Wallet,
  BarChartHorizontal,
  GraduationCap,
  Library,
  UserPlus,
  FileText,
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

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold font-headline">ESAC Manager</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  href="/dashboard-admin"
                  tooltip="Dashboard"
                  isActive
                >
                  <Link href="/dashboard-admin">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard-admin/alumnos" tooltip="Alumnos">
                  <Link href="/dashboard-admin/alumnos">
                    <UsersRound />
                    Alumnos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard-admin/cursos" tooltip="Cursos">
                  <Link href="/dashboard-admin/cursos">
                    <Library />
                    Cursos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard-admin/inscripciones" tooltip="Inscripciones">
                  <Link href="/dashboard-admin/inscripciones">
                    <ClipboardList />
                    Inscripciones
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard-admin/calificaciones" tooltip="Calificaciones">
                  <Link href="/dashboard-admin/calificaciones">
                    <GraduationCap />
                    Calificaciones
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard-admin/reportes" tooltip="Reportes">
                  <Link href="/dashboard-admin/reportes">
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
                <SidebarMenuButton asChild href="/dashboard-admin/ajustes" tooltip="Ajustes">
                  <Link href="/dashboard-admin/ajustes">
                    <Settings />
                    Ajustes
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <SidebarInset>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
