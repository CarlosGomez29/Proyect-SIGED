
"use client";

import React from "react";
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
import { 
  Bell, 
  Search, 
  LogOut, 
  Settings, 
  School, 
  KeyRound,
  UserCircle 
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "./theme-toggle";

export default function DashboardHeader() {
  const { handleLogout } = useAuth();
  
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:px-6 sticky top-0 z-30">
      <SidebarTrigger className="md:hidden" />
      
      <div className="w-full flex-1">
        <div className="relative max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar estudiantes, secciones o reportes..."
            className="pl-9 h-9 bg-muted/40 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background"></span>
        </Button>
        
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-9 w-9 border-2 border-muted transition-colors hover:border-primary/40">
                <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">admin@digev.mil.do</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard-admin/perfil" className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-primary">
              <Link href="/dashboard-admin/ajustes" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración de Escuela</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <School className="mr-2 h-4 w-4" />
              <span>Cambiar de Escuela</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Cambiar Contraseña</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
