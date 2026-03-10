
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  UserCog,
  UserPlus,
  BookUser,
  GraduationCap,
  ArrowLeft,
  Database,
  Loader2,
  CheckCircle2
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import images from "@/app/lib/placeholder-images";
import { useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

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
    role: "docente",
    name: "Docente",
    description: "Gestión de cursos y estudiantes",
    icon: BookUser,
    href: "/login/docente",
  },
  {
    role: "alumno",
    name: "Estudiante",
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
  const db = useFirestore();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeAdmin = async () => {
    if (!db) return;
    setIsInitializing(true);
    try {
      const adminId = "superadmin_root"; // ID fijo para el root
      const adminRef = doc(db, "users", adminId);
      
      // Hash SHA-256 de "123456"
      const passwordHash = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

      await setDoc(adminRef, {
        username: "superadmin",
        passwordHash: passwordHash,
        nombre: "Super",
        apellido: "Admin",
        rol: "superadmin",
        estado: "activo",
        escuelaId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({
        title: "Sistema Inicializado",
        description: "Usuario 'superadmin' creado. Contraseña: 123456",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el usuario base."
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
      <Image
        src={images.login_background.url}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0 filter blur-sm brightness-50"
        priority
        data-ai-hint={images.login_background.hint}
      />

      <div className="absolute top-4 left-4 z-20">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Button asChild variant="ghost" className="bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Inicio
                </Link>
            </Button>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Icons.logo className="h-20 w-20 text-primary mx-auto" />
          <h1 className="text-4xl font-bold font-headline mt-4 text-white drop-shadow-lg">SIGED - DIGEV</h1>
          <p className="text-neutral-200 mt-2 text-md font-medium max-w-2xl drop-shadow-md">
            Dirección General de las Escuelas Vocacionales de las Fuerzas Armadas y de la Policía Nacional
          </p>
          <p className="text-neutral-300 mt-2 text-lg max-w-2xl drop-shadow-md">
            Sistema Integral de Gestion de Estudiantes y Docentes
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
              whileTap={{ scale: 0.98 }}
            >
              <Link href={profile.href} passHref>
                <Card className="cursor-pointer h-full transition-all duration-300 bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 hover:border-white/40 hover:shadow-primary/20 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <profile.icon className="w-8 h-8 text-primary" />
                    <div className="flex flex-col">
                      <CardTitle className="text-xl font-semibold text-white">{profile.name}</CardTitle>
                      <CardDescription className="text-neutral-300">{profile.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleInitializeAdmin}
            disabled={isInitializing}
            className="bg-black/20 border-white/10 text-white/40 hover:text-white hover:bg-primary/20 transition-all text-[10px] font-bold uppercase tracking-widest h-8"
          >
            {isInitializing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Database className="h-3 w-3 mr-2" />}
            Inicializar Acceso SuperAdmin
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
