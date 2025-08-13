
"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  UserCog,
  UserPlus,
  BookUser,
  GraduationCap,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const profileDetails: { [key: string]: { name: string; icon: React.ElementType, user: string, dashboard: string } } = {
  'super-admin': { name: 'Super Admin', icon: ShieldCheck, user: 'superadmin', dashboard: '/dashboard/admin' },
  'administrador': { name: 'Administrador', icon: UserCog, user: 'admin', dashboard: '/dashboard/admin' },
  'admision': { name: 'Admisiones', icon: UserPlus, user: 'admision', dashboard: '/dashboard/admision' },
  'instructor': { name: 'Instructor', icon: BookUser, user: 'instructor', dashboard: '/dashboard/instructor' },
  'alumno': { name: 'Alumno', icon: GraduationCap, user: 'alumno', dashboard: '/dashboard/alumno' },
};


export default function RoleLoginPage({ params }: { params: { role: string } }) {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { role } = params;

  const details = profileDetails[role];

  if (!details) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
             <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle>Perfil no válido</CardTitle>
                    <CardDescription>El perfil seleccionado no existe.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => router.push('/')} className="w-full">Volver a la selección</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === details.user) {
      localStorage.setItem('userRole', role);
      router.push(details.dashboard);
    } else {
      toast({
          variant: "destructive",
          title: "Error de Autenticación",
          description: "Nombre de usuario incorrecto para este perfil.",
      });
    }
  };
  
  const Icon = details.icon;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
            <Icon className="h-12 w-12 text-primary mx-auto" />
          <CardTitle className="text-2xl font-headline mt-4">Portal de {details.name}</CardTitle>
          <CardDescription>
            Ingresa tu usuario para acceder al panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
            <Terminal className="h-4 w-4 !text-amber-800" />
            <AlertTitle className="font-semibold">MODO DE DESARROLLO</AlertTitle>
            <AlertDescription className="text-xs">
              Autenticación de prueba sin contraseña. Usuario: <strong>{details.user}</strong>
            </AlertDescription>
          </Alert>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
             <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
              Volver a la selección
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
