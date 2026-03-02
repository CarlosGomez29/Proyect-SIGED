
"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter, useParams } from 'next/navigation';
import {
  ShieldCheck,
  UserCog,
  UserPlus,
  BookUser,
  GraduationCap,
  Terminal,
  User,
  Lock,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import images from "@/app/lib/placeholder-images.json";

const profileDetails: { [key: string]: { name: string; icon: React.ElementType; user: string; dashboard: string; accentColor: string; shadowColor: string; welcomeMessage: string; } } = {
  'super-admin': { name: 'Super Admin', icon: ShieldCheck, user: 'superadmin', dashboard: '/dashboard/admin', accentColor: 'text-primary', shadowColor: 'shadow-primary/20', welcomeMessage: 'Bienvenido, Super Admin' },
  'administrador': { name: 'Administrador', icon: UserCog, user: 'admin', dashboard: '/dashboard-admin', accentColor: 'text-blue-500', shadowColor: 'shadow-blue-500/20', welcomeMessage: 'Bienvenido, Administrador' },
  'admision': { name: 'Admisiones', icon: UserPlus, user: 'admision', dashboard: '/dashboard/admision', accentColor: 'text-green-500', shadowColor: 'shadow-green-500/20', welcomeMessage: 'Bienvenido a Admisiones' },
  'instructor': { name: 'Docente', icon: BookUser, user: 'instructor', dashboard: '/dashboard/instructor', accentColor: 'text-teal-500', shadowColor: 'shadow-teal-500/20', welcomeMessage: 'Bienvenido, Docente' },
  'alumno': { name: 'Estudiante', icon: GraduationCap, user: 'alumno', dashboard: '/dashboard/alumno', accentColor: 'text-sky-500', shadowColor: 'shadow-sky-500/20', welcomeMessage: 'Bienvenido, Estudiante' },
};


export default function RoleLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { role } = useParams() as { role: string };

  const details = profileDetails[role];

  if (!details) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
             <div className="relative z-10 w-full max-w-md">
                <div className="bg-black/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-white text-center">Perfil no válido</h1>
                    <p className="text-muted-foreground mt-2 text-center">El perfil seleccionado no existe.</p>
                    <Button onClick={() => router.push('/login')} className="w-full mt-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a la selección
                    </Button>
                </div>
            </div>
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
          description: "Nombre de usuario o contraseña incorrectos.",
      });
    }
  };
  
  const Icon = details.icon;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-white p-4">
       <Image
        src={images.hero_institutional.url}
        alt="Background"
        fill
        priority
        className="z-0 object-cover filter brightness-50 blur-md"
        data-ai-hint={images.hero_institutional.hint}
      />
       <Button asChild variant="ghost" className="absolute top-4 left-4 z-20 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Link>
        </Button>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        <div className={`w-full bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl ${details.shadowColor}`}>
            <div className="flex flex-col items-center p-8">
                 <div className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-lg mb-6 ${details.accentColor}`}>
                    <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl"></div>
                    <Icon className="h-12 w-12" />
                </div>
                 <h1 className="text-2xl font-bold text-center">{details.welcomeMessage}</h1>
                 <p className="text-muted-foreground text-center text-sm">Portal de {details.name}</p>
                 
                <Alert className="mt-6 mb-4 bg-primary/20 border-primary/30 text-white">
                    <Terminal className="h-4 w-4 !text-primary" />
                    <AlertTitle className="font-semibold">Modo Desarrollo</AlertTitle>
                    <AlertDescription className="text-xs">
                    Usuario: <strong>{details.user}</strong> (sin contraseña)
                    </AlertDescription>
                </Alert>
          
                <form onSubmit={handleLogin} className="grid gap-4 w-full mt-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="username"
                            type="text"
                            placeholder="Nombre de usuario"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center justify-end text-sm mt-2">
                        <Link href="#" className="text-white hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full mt-4 text-base py-6">
                        Ingresar
                    </Button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
