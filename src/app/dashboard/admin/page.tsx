
"use client";
import React, { useMemo } from "react";
import {
    Users,
    ClipboardCheck,
    BookOpen,
    GraduationCap,
    MoreHorizontal,
    BookMarked
  } from "lucide-react";
  
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { motion } from "framer-motion";
  import { Progress } from "@/components/ui/progress";

  // Firebase imports
  import { useFirestore, useCollection } from "@/firebase";
  import { collection, query, orderBy, limit } from "firebase/firestore";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
  
  export default function DashboardAdminPage() {
    const db = useFirestore();

    // Consultas reales a Firestore
    const estudiantesQuery = useMemo(() => db ? collection(db, "estudiantes") : null, [db]);
    const { data: estudiantes } = useCollection(estudiantesQuery);

    const inscripcionesQuery = useMemo(() => {
        if (!db) return null;
        return query(collection(db, "inscripciones"), orderBy("createdAt", "desc"), limit(10));
    }, [db]);
    const { data: recentInscripciones, loading: loadingInscripciones } = useCollection(inscripcionesQuery);

    const seccionesQuery = useMemo(() => db ? collection(db, "secciones") : null, [db]);
    const { data: secciones } = useCollection(seccionesQuery);

    // Métricas calculadas
    const totalEstudiantes = estudiantes?.length || 0;
    const totalSecciones = secciones?.length || 0;
    const totalInscripciones = recentInscripciones?.length || 0;

    const academicMetrics = [
      { title: "Total de Estudiantes", value: totalEstudiantes.toString(), icon: Users, color: "text-blue-500", progress: totalEstudiantes > 0 ? 100 : 0 },
      { title: "Inscripciones (Período)", value: totalInscripciones.toString(), icon: ClipboardCheck, color: "text-green-500", progress: totalInscripciones > 0 ? 100 : 0 },
      { title: "Cursos Activos", value: totalSecciones.toString(), icon: BookMarked, color: "text-purple-500", progress: totalSecciones > 0 ? 100 : 0 },
      { title: "Certificados Emitidos", value: "0", icon: GraduationCap, color: "text-amber-500", progress: 0 },
    ];

    return (
      <div className="flex-1 space-y-6">
        <motion.h1 
          className="text-2xl font-bold font-headline tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Resumen General del Sistema
        </motion.h1>
  
        {/* Academic Metrics Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
            {academicMetrics.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
              >
                 <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                            Sincronizado con Firestore
                        </p>
                        <Progress value={card.progress} className="mt-4 h-1.5" />
                    </CardContent>
                 </Card>
              </motion.div>
            ))}
        </motion.section>
  
        {/* Recent Enrollments Table */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Inscripciones Recientes</CardTitle>
                    <CardDescription>Monitoreo de nuevos registros en tiempo real</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px] hidden sm:table-cell">Nombre</TableHead>
                             <TableHead className="sm:hidden">Alumno</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="hidden md:table-cell">Curso</TableHead>
                            <TableHead className="hidden lg:table-cell text-right">Fecha</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loadingInscripciones ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground animate-pulse">
                                    Cargando datos...
                                </TableCell>
                            </TableRow>
                        ) : recentInscripciones.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic font-medium">
                                    No hay inscripciones registradas en el sistema actualmente.
                                </TableCell>
                            </TableRow>
                        ) : (
                            recentInscripciones.map((inscripcion, index) => (
                                <TableRow 
                                    key={inscripcion.id}
                                    className="hover:bg-muted/50 transition-colors"
                                    >
                                    <motion.td 
                                        className="p-4 align-middle"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border border-border/50">
                                                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                                                    {inscripcion.alumno?.charAt(0) || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{inscripcion.alumno || 'Sin nombre'}</span>
                                                <span className="text-muted-foreground text-[10px] font-medium md:hidden">{inscripcion.curso}</span>
                                            </div>
                                        </div>
                                    </motion.td>
                                    <motion.td 
                                        className="p-4 align-middle"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 + 0.02 }}
                                    >
                                        <Badge 
                                            className={
                                                inscripcion.estado === 'Aprobada' ? 'bg-success/15 text-success border-success/20' : 
                                                inscripcion.estado === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 
                                                'bg-destructive/15 text-destructive border-destructive/20'
                                            }
                                        >
                                            {inscripcion.estado}
                                        </Badge>
                                    </motion.td>
                                    <motion.td 
                                        className="hidden md:table-cell p-4 align-middle text-sm font-medium"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 + 0.04 }}
                                    >{inscripcion.curso}</motion.td>
                                    <motion.td 
                                        className="hidden lg:table-cell text-right p-4 align-middle text-xs opacity-70 font-mono"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 + 0.06 }}
                                    >{inscripcion.createdAt?.toDate ? inscripcion.createdAt.toDate().toLocaleDateString() : 'Reciente'}</motion.td>
                                    <motion.td 
                                        className="text-center p-4 align-middle"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 + 0.08 }}
                                    >
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                                <span className="sr-only">Abrir menú</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl p-2 shadow-xl border-border/50">
                                                <DropdownMenuItem className="cursor-pointer text-xs font-medium">Ver Detalles</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </motion.td>
                                </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
                <div className="p-4 border-t border-border/50">
                    <CustomPagination total={recentInscripciones.length} />
                </div>
            </Card>
        </motion.section>
      </div>
    );
  }

  function CustomPagination({ total }: { total: number }) {
      return (
        <motion.div 
            className="flex items-center justify-between text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
        >
            <div className="hidden sm:block text-[10px] font-bold uppercase tracking-widest opacity-60">
                Mostrando {total} registros recientes
            </div>
             <div className="sm:hidden text-[10px] font-bold">
                {total} registros
            </div>
            <Pagination className="w-auto mx-0">
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" className="h-8 w-8" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive className="h-8 w-8 text-xs">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" className="h-8 w-8" />
                </PaginationItem>
                </PaginationContent>
            </Pagination>
        </motion.div>
      )
  }
