
"use client";

import React, { useState } from 'react';
import {
  File,
  PlusCircle,
  Search,
  ChevronDown,
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from 'framer-motion';

const alumnosData = [
  { id: 1, nombre: "Juan", apellido: "Pérez", curso: "Seguridad de la Carga Aérea", estado: "Activo" },
  { id: 2, nombre: "María", apellido: "García", curso: "Mercancías Peligrosas", estado: "Activo" },
  { id: 3, nombre: "Carlos", apellido: "López", curso: "AVSEC para Tripulación", estado: "Inactivo" },
  { id: 4, nombre: "Ana", apellido: "Martínez", curso: "Manejo de Crisis", estado: "Activo" },
  { id: 5, nombre: "Luis", apellido: "Hernández", curso: "Seguridad Aeroportuaria", estado: "Suspendido" },
  { id: 6, nombre: "Laura", apellido: "Gómez", curso: "Seguridad de la Carga Aérea", estado: "Activo" },
  { id: 7, nombre: "José", apellido: "Díaz", curso: "Mercancías Peligrosas", estado: "Activo" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


export default function AlumnosPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string[]>(["Activo", "Inactivo", "Suspendido"]);

    const handleFilterChange = (status: string) => {
        setStatusFilter(prev => 
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const filteredAlumnos = alumnosData.filter(alumno => 
        (alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase())) &&
        statusFilter.includes(alumno.estado)
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
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestión de Alumnos</h1>
          <p className="text-muted-foreground">Busca, filtra y gestiona los perfiles de los alumnos.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Registrar Nuevo Alumno
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
                        placeholder="Buscar por nombre o apellido..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Estado <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={statusFilter.includes("Activo")} onCheckedChange={() => handleFilterChange("Activo")}>
                      Activo
                    </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem checked={statusFilter.includes("Inactivo")} onCheckedChange={() => handleFilterChange("Inactivo")}>
                      Inactivo
                    </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem checked={statusFilter.includes("Suspendido")} onCheckedChange={() => handleFilterChange("Suspendido")}>
                      Suspendido
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead className="hidden md:table-cell">Curso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlumnos.map((alumno) => (
                  <TableRow key={alumno.id}>
                    <TableCell className="font-medium">{alumno.nombre}</TableCell>
                    <TableCell>{alumno.apellido}</TableCell>
                    <TableCell className="hidden md:table-cell">{alumno.curso}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={alumno.estado === 'Activo' ? 'default' : 'secondary'}
                        className={
                            alumno.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                            alumno.estado === 'Inactivo' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                        }
                      >
                        {alumno.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm">Ver Perfil</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
             <div>Mostrando {filteredAlumnos.length} de {alumnosData.length} alumnos</div>
             <Pagination>
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
             </Pagination>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

    