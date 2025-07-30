import Link from "next/link";
import {
  BookOpenCheck,
  ClipboardList,
  LayoutDashboard,
  Settings,
  UsersRound,
  Wallet,
  BarChartHorizontal
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
                  href="/dashboard"
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    Dashboard
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
                    <BookOpenCheck />
                    Cursos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard/inscripciones" tooltip="Inscripciones">
                  <Link href="/dashboard/inscripciones">
                    <ClipboardList />
                    Inscripciones
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
