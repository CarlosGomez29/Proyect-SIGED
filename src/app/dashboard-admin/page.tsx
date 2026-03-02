
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  ClipboardCheck, 
  PlusCircle, 
  UserPlus, 
  FileStack,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import images from "@/app/lib/placeholder-images.json";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function DashboardAdminPage() {
  const metrics = [
    { title: "Estudiantes Activos", value: "1,254", icon: Users, color: "text-blue-500", trend: "+2.5%" },
    { title: "Secciones Abiertas", value: "82", icon: BookOpen, color: "text-emerald-500", trend: "+4" },
    { title: "Docentes Activos", value: "45", icon: ShieldCheck, color: "text-purple-500", trend: "Estable" },
    { title: "Inscripciones Período", value: "350", icon: ClipboardCheck, color: "text-amber-500", trend: "+12%" },
  ];

  const quickActions = [
    { title: "Nueva Inscripción", href: "/dashboard-admin/inscripciones", icon: ClipboardCheck, description: "Procesar solicitud web o manual" },
    { title: "Crear Estudiante", href: "/dashboard-admin/alumnos", icon: UserPlus, description: "Registrar expediente completo" },
    { title: "Aperturar Sección", href: "/dashboard-admin/secciones/apertura", icon: PlusCircle, description: "Configurar nueva oferta académica" },
    { title: "Reportes Avanzados", href: "/dashboard-admin/reportes", icon: FileStack, description: "Análisis y estadísticas del período" },
  ];

  return (
    <motion.div 
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Hero Institucional */}
      <motion.section variants={itemVariants} className="relative h-80 w-full rounded-2xl overflow-hidden shadow-2xl">
        <Image 
          src={images.hero_institutional.url} 
          alt={images.hero_institutional.alt}
          fill
          className="object-cover"
          priority
          data-ai-hint={images.hero_institutional.hint}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12">
          <Badge className="w-fit mb-4 bg-primary/80 backdrop-blur-md border-none px-4 py-1">Período Académico 2024-2</Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-white mb-2 drop-shadow-lg">
            Sistema de Gestión Académica
          </h1>
          <p className="text-xl text-neutral-200 font-medium max-w-2xl drop-shadow-md">
            Dirección General de las Escuelas Vocacionales de las Fuerzas Armadas y de la Policía Nacional
          </p>
        </div>
      </motion.section>

      {/* 2. Métricas Principales */}
      <motion.section variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <motion.div key={metric.title} variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
                <p className="text-xs text-green-600 font-medium mt-1">
                  {metric.trend} <span className="text-muted-foreground font-normal">vs. mes anterior</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* 3. Accesos Rápidos */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-headline tracking-tight">Procesos Clave</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="group">
              <Card className="h-full border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Ir ahora <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 4. Sección Institucional Secundaria */}
      <motion.section variants={itemVariants}>
        <Card className="overflow-hidden border-none bg-muted/30">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <Image 
                src={images.workshop_secondary.url} 
                alt={images.workshop_secondary.alt}
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
                data-ai-hint={images.workshop_secondary.hint}
              />
            </div>
            <div className="p-8 flex flex-col justify-center space-y-4">
              <h2 className="text-2xl font-bold font-headline text-primary">Nuestra Visión</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Una Organización que como parte del Sistema Nacional de Formación y Promoción Técnico Profesional de Trabajadores, sea reconocida por la calidad de sus programas dirigidos al desarrollo Humano de los dominicanos y dominicanas, de preparar mano de obra calificada para satisfacer las necesidades productivas nacionales y por el fomento de una cultura de emprendedurismo de los miembros de las Fuerzas Armadas, de la Policía Nacional y de la sociedad en general que cursan sus programas.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-4 border-background bg-muted flex items-center justify-center text-[10px] font-bold overflow-hidden">
                      <Image src={`https://picsum.photos/seed/stu${i}/40/40`} alt="User" width={40} height={40} />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  +100,000 egresados han transformado su futuro con nosotros.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
}
