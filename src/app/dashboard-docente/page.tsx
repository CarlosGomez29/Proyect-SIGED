
"use client";

import React from "react";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  Clock,
  LayoutDashboard,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";

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

export default function DashboardDocentePage() {
  const { user } = useAuth();

  const metrics = [
    { title: "Mis Secciones", value: "4", icon: BookOpen, color: "text-blue-500", progress: 100 },
    { title: "Estudiantes Totales", value: "145", icon: Users, color: "text-emerald-500", progress: 95 },
    { title: "Asistencia Promedio", value: "92%", icon: ClipboardList, color: "text-purple-500", progress: 92 },
    { title: "Calificaciones Listas", value: "85%", icon: CheckCircle2, color: "text-amber-500", progress: 85 },
  ];

  const misCursos = [
    { id: "SEC-0042", nombre: "Seguridad de la Carga Aérea", horario: "Lun-Mie 08:00 - 12:00", estudiantes: 35, progreso: 65 },
    { id: "SEC-0085", nombre: "Mercancías Peligrosas", horario: "Mar-Jue 08:00 - 12:00", estudiantes: 28, progreso: 40 },
    { id: "SEC-0102", nombre: "AVSEC para Tripulación", horario: "Vie 13:00 - 17:00", estudiantes: 42, progreso: 20 },
    { id: "SEC-0155", nombre: "Manejo de Crisis", horario: "Sab 08:00 - 12:00", estudiantes: 40, progreso: 80 },
  ];

  const proximasActividades = [
    { titulo: "Examen Final - Carga Aérea", fecha: "Mañana", hora: "08:00 AM", tipo: "Evaluación" },
    { titulo: "Entrega de Notas - Mercancías", fecha: "Viernes", hora: "12:00 PM", tipo: "Administrativo" },
    { titulo: "Clase Magistral - AVSEC", fecha: "Lunes", hora: "01:00 PM", tipo: "Clase" },
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-headline tracking-tighter">Panel del Docente</h1>
          <p className="text-muted-foreground font-medium">Bienvenido de nuevo al Portal de Docencia DIGEV.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold uppercase tracking-widest text-[10px]">
             <Calendar className="mr-2 h-4 w-4" /> Mi Horario
          </Button>
          <Button className="font-bold uppercase tracking-widest text-[10px]">
             <PlusCircle className="mr-2 h-4 w-4" /> Registrar Nota
          </Button>
        </div>
      </motion.div>

      <motion.section variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <motion.div key={metric.title} variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{metric.title}</CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tighter">{metric.value}</div>
                <Progress value={metric.progress} className="h-1.5 mt-3" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-headline tracking-tight">Mis Secciones Activas</CardTitle>
              <CardDescription>Resumen de cursos y progreso académico.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest opacity-60">Código</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest opacity-60">Curso</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest opacity-60">Horario</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest opacity-60">Progreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {misCursos.map((curso) => (
                    <TableRow key={curso.id} className="hover:bg-muted/30 transition-colors border-border/50">
                      <TableCell className="font-mono text-xs font-bold text-primary">{curso.id}</TableCell>
                      <TableCell className="font-bold text-xs">{curso.nombre}</TableCell>
                      <TableCell className="text-[10px] font-medium text-muted-foreground">{curso.horario}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Progress value={curso.progreso} className="h-1 w-12" />
                           <span className="text-[10px] font-bold">{curso.progreso}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">
                           Gestionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="glass-card border-none shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-headline tracking-tight flex items-center gap-2">
                 <Clock className="h-5 w-5 text-primary" /> Próximas Tareas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               {proximasActividades.map((act, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                       <span className="text-[10px] font-black text-primary uppercase">{act.fecha.substring(0,3)}</span>
                    </div>
                    <div className="space-y-1">
                       <p className="font-bold text-xs leading-none">{act.titulo}</p>
                       <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] h-4 font-bold uppercase tracking-widest">{act.tipo}</Badge>
                          <span className="text-[10px] text-muted-foreground font-medium">{act.hora}</span>
                       </div>
                    </div>
                 </div>
               ))}
               <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 hover:bg-muted/50 font-bold uppercase tracking-widest text-[10px]">
                  Ver Todas las Actividades
               </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PlusCircle(props: any) {
    return <ClipboardList {...props} />
}
