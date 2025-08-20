
"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell, Calendar, Search, Settings, Phone, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardHeader() {
  const { handleLogout } = useAuth();
  const [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="relative w-full max-w-sm hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search..." 
                className="pl-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>

        <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
            <Phone className="h-5 w-5" />
            <span className="sr-only">Call</span>
        </Button>
         <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
        </Button>

        <Button className="rounded-full gap-2 hidden md:flex">
            <Plus className="h-5 w-5" />
            <span>New Task</span>
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" />
                <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/dashboard-admin/ajustes">Ajustes</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Soporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                Cerrar Sesión
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

