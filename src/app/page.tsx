
"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import {
  ShieldCheck,
  UserCog,
  UserPlus,
  BookUser,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";

const profiles = [
  {
    role: "super-admin",
    name: "Super Admin",
    description: "Acceso total al sistema",
    icon: ShieldCheck,
    href: "/login/super-admin",
  },
  {
    role: "administrador",
    name: "Administrador",
    description: "Gestión de la escuela",
    icon: UserCog,
    href: "/login/administrador",
  },
  {
    role: "admision",
    name: "Admisiones",
    description: "Gestión de inscripciones",
    icon: UserPlus,
    href: "/login/admision",
  },
  {
    role: "instructor",
    name: "Instructor",
    description: "Gestión de cursos y alumnos",
    icon: BookUser,
    href: "/login/instructor",
  },
  {
    role: "alumno",
    name: "Alumno",
    description: "Portal del estudiante",
    icon: GraduationCap,
    href: "/login/alumno",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function ProfileSelectionPage() {
    const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icons.logo className="h-20 w-20 text-primary mx-auto" />
        <h1 className="text-4xl font-bold font-headline mt-6">Bienvenido a ESAC Manager</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Selecciona tu perfil para continuar
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {profiles.map((profile) => (
          <motion.div
            key={profile.role}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.03, transition: { type: "spring", stiffness: 300 } }}
            onClick={() => router.push(profile.href)}
          >
            <Card className="cursor-pointer h-full transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <profile.icon className="w-8 h-8 text-primary" />
                  <div className="flex flex-col">
                    <CardTitle className="text-xl font-semibold">{profile.name}</CardTitle>
                    <CardDescription>{profile.description}</CardDescription>
                  </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
       <div className="mt-12 text-center text-sm">
          <Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors">
              ¿No tienes una cuenta? <span className="underline">Registrarse</span>
          </Link>
        </div>
    </div>
  );
}
