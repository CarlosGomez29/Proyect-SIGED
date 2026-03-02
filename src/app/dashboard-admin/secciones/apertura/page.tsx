"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  FileDown,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  XCircle,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const initialSecciones = [
  {
    id: "SEC-001",
    curso: "Seguridad de la Carga Aérea",
    programa: "DIGEP Directo",
    docente: "Juan Pérez",
    horario: "Lun-Vie 08:00 - 12:00",
    estado: "Abierta",
    inscritos: 32,
    capacidad: 40,
  },
  {
    id: "SEC-002",
    curso: "Mercancías Peligrosas",
    programa: "DIGEP-INFOTEP",
    docente: "María García",
    horario: "Sáb 09:00 - 17:00",
    estado: "En proceso",
    inscritos: 15,
    capacidad: 20,
  },
  {
    id: "SEC-003",
    curso: "AVSEC para Tripulación",
    programa: "DIGEP Directo",
    docente: "Carlos López",
    horario: "Lun-Mié 18:00 - 21:00",
    estado: "Abierta",
    inscritos: 38,
    capacidad: 40,
  },
  {
    id: "SEC-004",
    curso: "Manejo de Crisis",
    programa: "Dominicana Digna",
    docente: "Ana Martínez",
    horario: "Mar-Jue 14:00 - 17:00",
    estado: "Cerrada",
    inscritos: 40,
    capacidad: 40,
  },
  {
    id: "SEC-005",
    curso: "Seguridad Aeroportuaria",
    programa: "DIGEP Directo",
    docente: "Luis Hernández",
    horario: "Lun-Vie 13:00 - 17:00",
    estado: "Abierta",
    inscritos: 22,
    capacidad: 40,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function AperturaSeccionesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSecciones = initialSecciones.filter(
    (s) =>
      s.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.docente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Abierta":
        return (
          <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/20 font-bold px-3">
            Abierta
          </Badge>
        );
      case "En proceso":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 font-bold px-3">
            En proceso
          </Badge>
        );
      case "Cerrada":
        return (
          <Badge className="bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20 font-bold px-3">
            Cerrada
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const calculateOcupacion = (inscritos: number, capacidad: number) => {
    return Math.round((inscritos / capacidad) * 100);
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Encabezado del módulo */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-black font-headline tracking-tighter">
              Apertura de Secciones
            </h1>
          </div>
          <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            Período Académico Activo: <span className="text-foreground font-bold">2024-2</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex font-bold uppercase tracking-wider text-[10px] h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-9">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="font-bold shadow-lg shadow-primary/20 uppercase tracking-wider text-[10px] h-9">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Sección
          </Button>
        </div>
      </motion.div>

      {/* 2. Barra de búsqueda */}
      <motion.div variants={itemVariants} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Buscar por curso, docente o programa..."
          className="pl-12 h-14 bg-card/50 border-border/50 focus:bg-card transition-all text-lg rounded-2xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* 3. Listado principal */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 overflow-hidden shadow-xl shadow-black/5 bg-card/60 backdrop-blur-sm rounded-[1.5rem]">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-bold py-5 pl-8 text-xs uppercase tracking-widest opacity-60">Curso</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Programa</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Docente</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Horario</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60 text-center">Estado</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60 w-[200px]">Ocupación</TableHead>
                  <TableHead className="font-bold py-5 pr-8 text-xs uppercase tracking-widest opacity-60 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSecciones.map((seccion) => {
                  const ocupacionPorcentaje = calculateOcupacion(seccion.inscritos, seccion.capacidad);
                  return (
                    <TableRow key={seccion.id} className="group hover:bg-muted/20 border-border/50 transition-colors">
                      <TableCell className="py-6 pl-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground tracking-tight">{seccion.curso}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{seccion.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 font-medium text-sm text-muted-foreground">
                        {seccion.programa}
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                            <span className="text-[10px] font-bold text-primary">{seccion.docente.charAt(0)}</span>
                          </div>
                          <span className="font-semibold text-sm">{seccion.docente}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 text-xs font-medium text-muted-foreground leading-relaxed">
                        {seccion.horario}
                      </TableCell>
                      <TableCell className="py-6 text-center">
                        {getStatusBadge(seccion.estado)}
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className={ocupacionPorcentaje > 90 ? "text-destructive" : "text-muted-foreground uppercase"}>
                              {seccion.inscritos} de {seccion.capacidad}
                            </span>
                            <span className="text-foreground">{ocupacionPorcentaje}%</span>
                          </div>
                          <Progress 
                            value={ocupacionPorcentaje} 
                            className={`h-1.5 ${ocupacionPorcentaje > 90 ? "bg-destructive/10" : "bg-muted"}`} 
                            indicatorClassName={ocupacionPorcentaje > 90 ? "bg-destructive" : "bg-primary"}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-6 pr-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 p-2 shadow-xl">
                            <DropdownMenuItem className="rounded-lg flex items-center gap-2 py-2 cursor-pointer">
                              <Eye className="h-4 w-4 opacity-70" />
                              <span className="font-medium text-sm">Ver detalles</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg flex items-center gap-2 py-2 cursor-pointer">
                              <Edit className="h-4 w-4 opacity-70" />
                              <span className="font-medium text-sm">Editar sección</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="opacity-50" />
                            <DropdownMenuItem className="rounded-lg flex items-center gap-2 py-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <XCircle className="h-4 w-4" />
                              <span className="font-bold text-sm">Cerrar sección</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredSecciones.length === 0 && (
              <div className="py-20 text-center space-y-3">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                <p className="text-muted-foreground font-medium">No se encontraron secciones para "{searchTerm}"</p>
                <Button variant="link" onClick={() => setSearchTerm("")} className="text-primary font-bold">
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
