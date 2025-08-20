
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  BookOpenCheck,
  ClipboardList,
  LayoutDashboard,
  Settings,
  UsersRound,
  GraduationCap,
  Library,
  BarChartHorizontal,
  MessageSquare,
  HelpCircle
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
import { Badge } from "@/components/ui/badge";

const menuItems = [
    { href: "/dashboard-admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard-admin/inscripciones", icon: ClipboardList, label: "Inscripciones", badge: "130" },
    { href: "/dashboard-admin/alumnos", icon: UsersRound, label: "Alumnos" },
    { href: "/dashboard-admin/cursos", icon: Library, label: "Cursos" },
    { href: "/dashboard-admin/calificaciones", icon: GraduationCap, label: "Calificaciones" },
    { href: "/dashboard-admin/reportes", icon: BarChartHorizontal, label: "Reportes" },
];

const secondaryMenuItems = [
    { href: "#", icon: MessageSquare, label: "Chat", badge: "4" },
    { href: "/dashboard-admin/ajustes", icon: Settings, label: "Ajustes" },
    { href: "#", icon: HelpCircle, label: "FAQ", badge: "1" },
]

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="p-4">
             <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="Vitalii Tk." data-ai-hint="person" />
                    <AvatarFallback>VT</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-foreground">Admin User</p>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                </div>
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
                        className="justify-start"
                    >
                        <Link href={item.href} className="flex items-center justify-between w-full">
                           <div className="flex items-center gap-3">
                             <item.icon className="h-5 w-5" />
                             <span>{item.label}</span>
                           </div>
                           {item.badge && <Badge variant="secondary" className="bg-sidebar-accent text-sidebar-accent-foreground">{item.badge}</Badge>}
                        </Link>
                    </SidebarMenuButton>
              </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarMenu className="mt-auto">
               {secondaryMenuItems.map((item) => (
                 <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        href={item.href}
                        tooltip={item.label}
                        isActive={pathname === item.href}
                        className="justify-start"
                    >
                        <Link href={item.href} className="flex items-center justify-between w-full">
                           <div className="flex items-center gap-3">
                             <item.icon className="h-5 w-5" />
                             <span>{item.label}</span>
                           </div>
                           {item.badge && <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-none">{item.badge}</Badge>}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
               ))}
            </SidebarMenu>
          </SidebarContent>
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
