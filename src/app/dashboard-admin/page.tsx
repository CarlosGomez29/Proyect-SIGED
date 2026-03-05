
"use client";

import React, { useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import images from "@/app/lib/placeholder-images";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

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
  const db = useFirestore();
  
  // Queries para métricas reales
  const estudiantesQuery = useMemo(() => db ? collection(db, "estudiantes") : null, [db]);
  const docentesQuery = useMemo(() => db ? collection(db, "docentes") : null, [db]);
  const inscripcionesQuery = useMemo(() => db ? collection(db, "inscripciones") : null, [db]);
  const seccionesAbiertasQuery = useMemo(() => db ? query(collection(db, "secciones"), where("estado", "==", "Abierta")) : null, [db]);

  const { data: estudiantes } = useCollection(estudiantesQuery);
  const { data: docentes } = useCollection(docentesQuery);
  const { data: inscripciones } = useCollection(inscripcionesQuery);
  const { data: seccionesAbiertas } = useCollection(seccionesAbiertasQuery);

  const activeRecinto = "Escuela Vocacional Santo Domingo Este";
  const academicPeriod = "Gestión Institucional Real-time";

  const metrics = [
    { title: "Estudiantes Activos", value: estudiantes?.length.toString() || "0", icon: Users, color: "text-blue-500" },
    { title: "Secciones Abiertas", value: seccionesAbiertas?.length.toString() || "0", icon: BookOpen, color: "text-emerald-500" },
    { title: "Docentes Registrados", value: docentes?.length.toString() || "0", icon: ShieldCheck, color: "text-purple-500" },
    { title: "Inscripciones Totales", value: inscripciones?.length.toString() || "0", icon: ClipboardCheck, color: "text-amber-500" },
  ];

  const quickActions = [
    { title: "Nueva Inscripción", href: "/dashboard-admin/inscripciones", icon: ClipboardCheck, description: "Procesar solicitud web o manual" },
    { title: "Crear Estudiante", href: "/dashboard-admin/alumnos", icon: UserPlus, description: "Registrar expediente completo" },
    { title: "Aperturar Sección", href: "/dashboard-admin/secciones/apertura", icon: PlusCircle, description: "Configurar nueva oferta académica" },
    { title: "Reportes Avanzados", href: "/dashboard-admin/reportes", icon: FileStack, description: "Análisis y estadísticas del período" },
  ];

  return (
    <motion.div 
      className="space-y-10 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={itemVariants} className="relative h-[400px] w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
        <Image 
          src={images.workshop_secondary.url} 
          alt={images.workshop_secondary.alt}
          fill
          className="object-cover transition-transform duration-[2s] hover:scale-105"
          priority
          data-ai-hint={images.workshop_secondary.hint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Badge className="w-fit mb-4 bg-white/10 backdrop-blur-md border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
              {academicPeriod}
            </Badge>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black font-headline text-white mb-3 tracking-tighter">
              {activeRecinto}
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl leading-relaxed">
              Dirección General de las Escuelas Vocacionales FF.AA. y P.N.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <motion.div key={metric.title} variants={itemVariants} whileHover={{ y: -5 }}>
            <Card className="glass-card hover:bg-card/90 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{metric.title}</CardTitle>
                <div className={`p-2 rounded-xl bg-primary/5 ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter">{metric.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-muted-foreground font-medium italic">registros en tiempo real</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black font-headline tracking-tighter">Procesos Clave</h2>
          <Button variant="ghost" size="sm" className="text-primary font-bold">Ver todos</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="group">
              <Card className="h-full glass-card hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="mb-6 rounded-2xl bg-primary/5 w-14 h-14 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                    <action.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 tracking-tight">{action.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {action.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                    Comenzar <ArrowRight className="ml-2 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
