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
    <header className="flex h-20 items-center gap-4 border-b border-border/40 bg-background/60 backdrop-blur-xl px-6 lg:px-10 sticky top-0 z-30 transition-all duration-300">
      <SidebarTrigger className="md:hidden" />
      
      <div className="w-full flex-1">
        <div className="relative max-w-sm hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-11 h-10 bg-muted/30 border-none focus-visible:ring-1 rounded-full transition-all focus:bg-muted/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-muted/50 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-background animate-pulse"></span>
        </Button>
        
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 overflow-hidden ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
              <Avatar className="h-10 w-10 border-2 border-muted/50">
                <AvatarImage 
                  src="/img/logo-digev.jpg" 
                  alt="Admin" 
                />
                <AvatarFallback className="font-bold">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-2xl shadow-2xl p-2 border-border/50" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">Administrador General</p>
                <p className="text-[10px] leading-none text-muted-foreground font-mono">admin@digev.mil.do</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="opacity-50" />
            <div className="p-1 space-y-1">
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/dashboard-admin/perfil" className="flex items-center py-2">
                  <UserCircle className="mr-3 h-4 w-4 opacity-70" />
                  <span className="font-medium text-sm">Mi Perfil Profesional</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/dashboard-admin/ajustes" className="flex items-center py-2">
                  <Settings className="mr-3 h-4 w-4 opacity-70" />
                  <span className="font-medium text-sm">Ajustes de Institución</span>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="opacity-50" />
            <div className="p-1 space-y-1">
              <DropdownMenuItem className="cursor-pointer rounded-lg py-2">
                <School className="mr-3 h-4 w-4 opacity-70" />
                <span className="font-medium text-sm">Cambiar Campus</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg py-2">
                <KeyRound className="mr-3 h-4 w-4 opacity-70" />
                <span className="font-medium text-sm">Seguridad de Acceso</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="opacity-50" />
            <div className="p-1">
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg py-2"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-tighter">Cerrar Sesión</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
