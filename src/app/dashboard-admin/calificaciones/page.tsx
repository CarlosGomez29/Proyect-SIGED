
"use client";

import React, { useState } from 'react';
import { File, PlusCircle, Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { motion } from 'framer-motion';

const calificacionesData = [
  { id: 1, alumno: "Juan Pérez", curso: "Seguridad de la Carga Aérea", calificacion: 95, fecha: "2024-05-10" },
  { id: 2, alumno: "María García", curso: "Mercancías Peligrosas", calificacion: 88, fecha: "2024-05-12" },
  { id: 3, alumno: "Carlos López", curso: "AVSEC para Tripulación", calificacion: 72, fecha: "2024-05-15" },
  { id: 4, alumno: "Ana Martínez", curso: "Manejo de Crisis", calificacion: 91, fecha: "2024-05-18" },
  { id: 5, alumno: "Luis Hernández", curso: "Seguridad Aeroportuaria", calificacion: 85, fecha: "2024-05-20" },
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

export default function CalificacionesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredCalificaciones = calificacionesData.filter(c =>
        c.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.curso.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestión de Calificaciones</h1>
          <p className="text-muted-foreground">Visualiza y gestiona las calificaciones de los cursos.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Registrar Calificación
          </Button>
          <Button variant="outline">
            <File className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por alumno o curso..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar por Curso
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead className="text-center">Calificación</TableHead>
                  <TableHead className="text-right">Fecha de Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalificaciones.map((calif) => (
                  <TableRow key={calif.id}>
                    <TableCell className="font-medium">{calif.alumno}</TableCell>
                    <TableCell>{calif.curso}</TableCell>
                    <TableCell className="text-center font-semibold">{calif.calificacion}</TableCell>
                    <TableCell className="text-right">{calif.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
           <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
             <div>Mostrando {filteredCalificaciones.length} de {calificacionesData.length} registros</div>
             <Pagination>
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
             </Pagination>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

    