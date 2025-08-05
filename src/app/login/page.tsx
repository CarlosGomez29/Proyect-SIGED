"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
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
import { Terminal } from "lucide-react"

// Hardcoded test users for development
const testUsers = [
  { email: 'superadmin@esac.edu.do', password: 'password123', role: 'super-admin' },
  { email: 'admin@esac.edu.do', password: 'password123', role: 'administrador' },
  { email: 'admision@esac.edu.do', password: 'password123', role: 'admision' },
  { email: 'instructor@esac.edu.do', password: 'password123', role: 'instructor' },
  { email: 'alumno@esac.edu.do', password: 'password123', role: 'alumno' },
];

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Development login logic
    const foundUser = testUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      // Store role in local storage to be picked up by AuthContext
      localStorage.setItem('userRole', foundUser.role);
      
      switch (foundUser.role) {
        case 'super-admin':
        case 'administrador':
          router.push('/dashboard-admin');
          break;
        case 'admision':
          router.push('/dashboard-admision');
          break;
        case 'instructor':
          router.push('/dashboard-instructor');
          break;
        case 'alumno':
          router.push('/dashboard-alumno');
          break;
        default:
          router.push('/login');
      }
    } else {
      toast({
          variant: "destructive",
          title: "Error de Autenticación",
          description: "Credenciales incorrectas.",
      });
    }

    /*
    // Original Firebase Auth Logic
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        switch (role) {
          case 'super-admin':
          case 'administrador':
            router.push('/dashboard-admin');
            break;
          case 'admision':
            router.push('/dashboard-admision');
            break;
          case 'instructor':
            router.push('/dashboard-instructor');
            break;
          case 'alumno':
            router.push('/dashboard-alumno');
            break;
          default:
            router.push('/login');
        }
      } else {
        toast({
            variant: "destructive",
            title: "Error de Rol",
            description: "No se pudo determinar el rol del usuario.",
        });
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error de Autenticación",
            description: "Correo o contraseña incorrectos.",
        });
    }
    */
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
            <Icons.logo className="h-12 w-12 text-primary mx-auto" />
          <CardTitle className="text-2xl font-headline mt-4">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
            <Terminal className="h-4 w-4 !text-amber-800" />
            <AlertTitle className="font-semibold">MODO DE DESARROLLO</AlertTitle>
            <AlertDescription className="text-xs">
              Autenticación de prueba habilitada.
            </AlertDescription>
          </Alert>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{' '}
              <Link href="/signup" className="underline">
                Registrarse
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}