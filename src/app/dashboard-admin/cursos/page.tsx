
"use client";

import React, { useState } from 'react';
import { File, PlusCircle, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { motion } from 'framer-motion';

const cursosData = [
  { id: 1, nombre: "Seguridad de la Carga Aérea", instructor: "Juan Pérez", inicio: "2024-06-01", fin: "2024-06-30" },
  { id: 2, nombre: "Mercancías Peligrosas", instructor: "María García", inicio: "2024-06-15", fin: "2024-07-15" },
  { id: 3, nombre: "AVSEC para Tripulación", instructor: "Carlos López", inicio: "2024-07-01", fin: "2024-07-31" },
  { id: 4, nombre: "Manejo de Crisis", instructor: "Ana Martínez", inicio: "2024-07-10", fin: "2024-08-10" },
  { id: 5, nombre: "Seguridad Aeroportuaria", instructor: "Luis Hernández", inicio: "2024-08-01", fin: "2024-08-31" },
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

export default function CursosPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCursos = cursosData.filter(curso => 
        curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.instructor.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestión de Cursos</h1>
          <p className="text-muted-foreground">Crea, edita y gestiona todos los cursos de la escuela.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear Nuevo Curso
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
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre de curso o instructor..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Curso</TableHead>
                  <TableHead>Instructor Asignado</TableHead>
                  <TableHead>Fecha de Inicio</TableHead>
                  <TableHead>Fecha de Finalización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCursos.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell className="font-medium">{curso.nombre}</TableCell>
                    <TableCell>{curso.instructor}</TableCell>
                    <TableCell>{curso.inicio}</TableCell>
                    <TableCell>{curso.fin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
           <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
             <div>Mostrando {filteredCursos.length} de {cursosData.length} cursos</div>
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

    