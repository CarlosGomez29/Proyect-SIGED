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
                  href="/dashboard"
                  isActive
                  tooltip="Dashboard"
                >
                  <LayoutDashboard />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Alumnos">
                  <UsersRound />
                  Alumnos
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Cursos">
                  <BookOpenCheck />
                  Cursos
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Inscripciones">
                  <ClipboardList />
                  Inscripciones
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Pagos">
                  <Wallet />
                  Pagos
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Reportes">
                  <BarChartHorizontal />
                  Reportes
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Ajustes">
                  <Settings />
                  Ajustes
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
