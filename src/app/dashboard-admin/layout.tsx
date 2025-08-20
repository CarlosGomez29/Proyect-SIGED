
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
    { href: "/dashboard-admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard-admin/inscripciones", label: "Inscripciones", icon: ClipboardList, badge: "130" },
    { href: "/dashboard-admin/alumnos", label: "Alumnos", icon: UsersRound },
    { href: "/dashboard-admin/cursos", label: "Cursos", icon: Library },
    { href: "/dashboard-admin/calificaciones", label: "Calificaciones", icon: GraduationCap },
    { href: "/dashboard-admin/reportes", label: "Reportes", icon: BarChartHorizontal },
];

const secondaryMenuItems = [
    { href: "#chat", label: "Chat", icon: MessageSquare, badge: "4" },
    { href: "/dashboard-admin/ajustes", label: "Ajustes", icon: Settings },
    { href: "#faq", label: "FAQ", icon: HelpCircle, badge: "1" },
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
          <SidebarHeader className="p-4 flex flex-col items-center justify-center text-center gap-3">
             <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src="https://placehold.co/80x80.png" alt="Admin User" data-ai-hint="person" />
                <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-foreground text-lg">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@esac.com</p>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                        asChild
                        href={item.href}
                        tooltip={item.label}
                        isActive={pathname === item.href}
                        className="justify-start"
                    >
                        <Link href={item.href} className="flex items-center w-full">
                           <div className="flex items-center gap-3">
                             <item.icon className="h-5 w-5" />
                             <span>{item.label}</span>
                           </div>
                        </Link>
                    </SidebarMenuButton>
              </SidebarMenuItem>
              ))}
               <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        href={"/dashboard-admin/ajustes"}
                        tooltip={"Ajustes"}
                        isActive={pathname === "/dashboard-admin/ajustes"}
                        className="justify-start"
                    >
                        <Link href={"/dashboard-admin/ajustes"} className="flex items-center w-full">
                           <div className="flex items-center gap-3">
                             <Settings className="h-5 w-5" />
                             <span>Ajustes</span>
                           </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
           <SidebarFooter className="p-4 border-none">
              <div className="text-center">
                  <p className="text-sm font-semibold text-foreground mb-2">Active Users</p>
                  <div className="flex items-center justify-center -space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src="https://placehold.co/32x32.png" data-ai-hint="person woman" />
                          <AvatarFallback>U1</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-background">
                           <AvatarImage src="https://placehold.co/32x32.png" data-ai-hint="person man" />
                          <AvatarFallback>U2</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-background">
                           <AvatarImage src="https://placehold.co/32x32.png" data-ai-hint="person" />
                          <AvatarFallback>U3</AvatarFallback>
                      </Avatar>
                       <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center border-2 border-background font-semibold">
                          +70
                       </div>
                  </div>
              </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <SidebarInset>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/30 dark:bg-card/20">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
