
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
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

const menuItems = [
    { href: "/dashboard-admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard-admin/alumnos", icon: UsersRound, label: "Alumnos" },
    { href: "/dashboard-admin/cursos", icon: Library, label: "Cursos" },
    { href: "/dashboard-admin/inscripciones", icon: ClipboardList, label: "Inscripciones" },
    { href: "/dashboard-admin/calificaciones", icon: GraduationCap, label: "Calificaciones" },
    { href: "/dashboard-admin/reportes", icon: BarChartHorizontal, label: "Reportes" },
];

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        href={item.href}
                        tooltip={item.label}
                        isActive={pathname === item.href}
                    >
                        <Link href={item.href}>
                            <item.icon />
                            {item.label}
                        </Link>
                    </SidebarMenuButton>
              </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                <SidebarMenuButton asChild href="/dashboard-admin/ajustes" tooltip="Ajustes" isActive={pathname === '/dashboard-admin/ajustes'}>
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
