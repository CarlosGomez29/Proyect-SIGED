
"use client";

import Link from "next/link";
import Image from "next/image";
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
    name: "Docente",
    description: "Gestión de cursos y estudiantes",
    icon: BookUser,
    href: "/login/instructor",
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
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
      <Image
        src="https://scontent.fsdq5-1.fna.fbcdn.net/v/t1.6435-9/83095305_1205978922944167_2162496796377481216_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=Whlmi5PpokMQ7kNvwEabxFu&_nc_oc=Admbe5N-viKhBWzlwWA984DXzYRhbua_WHmvAWBtTALZJ2g2VMkh6wmr7mcywl8jjJU&_nc_zt=23&_nc_ht=scontent.fsdq5-1.fna&_nc_gid=pjqiQM0rqci9QWjOUD59vw&oh=00_AfiNaGyW2wNI3MJnJniCqh2nThkVIAF_kxOjtIfJ16yZZg&oe=693415C4"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0 filter blur-sm brightness-50"
      />
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
                <Card className="cursor-pointer h-full transition-all duration-300 bg-black/30 backdrop-blur-sm border-white/20 text-white hover:bg-black/50 hover:shadow-primary/20 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <profile.icon className="w-8 h-8 text-primary" />
                    <div className="flex flex-col">
                      <CardTitle className="text-xl font-semibold">{profile.name}</CardTitle>
                      <CardDescription className="text-neutral-300">{profile.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
