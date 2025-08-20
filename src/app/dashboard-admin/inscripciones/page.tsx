
"use client";

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, MoreHorizontal, Clock, Filter } from "lucide-react";
import { motion } from 'framer-motion';

const initialInscripcionesData = [
  { id: 1, alumno: "Carlos López", curso: "Seguridad Aeroportuaria", fecha: "2024-05-20", estado: "Pendiente" },
  { id: 2, alumno: "Ana Martínez", curso: "Manejo de Crisis", fecha: "2024-05-19", estado: "Aprobada" },
  { id: 3, alumno: "Luis Hernández", curso: "Mercancías Peligrosas", fecha: "2024-05-18", estado: "Rechazada" },
  { id: 4, alumno: "Laura Gómez", curso: "AVSEC para Tripulación", fecha: "2024-05-17", estado: "Pendiente" },
  { id: 5, alumno: "José Díaz", curso: "Seguridad de la Carga Aérea", fecha: "2024-05-16", estado: "Aprobada" },
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

export default function InscripcionesPage() {
  const [inscripciones, setInscripciones] = useState(initialInscripcionesData);
  const [filter, setFilter] = useState("Pendiente");

  const handleUpdateStatus = (id: number, newStatus: "Aprobada" | "Rechazada") => {
    setInscripciones(inscripciones.map(i => i.id === id ? { ...i, estado: newStatus } : i));
  };

  const filteredInscripciones = inscripciones.filter(i => 
    filter === 'Todas' ? true : i.estado === filter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aprobada":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Aprobada</Badge>;
      case "Pendiente":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pendiente</Badge>;
      case "Rechazada":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">Rechazada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Gestión de Inscripciones</h1>
        <p className="text-muted-foreground">Revisa, aprueba o rechaza las solicitudes de inscripción.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Solicitudes de Inscripción</CardTitle>
              <Tabs defaultValue="Pendiente" onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="Pendiente">Pendientes</TabsTrigger>
                  <TabsTrigger value="Aprobada">Aprobadas</TabsTrigger>
                  <TabsTrigger value="Rechazada">Rechazadas</TabsTrigger>
                  <TabsTrigger value="Todas">Todas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Alumno</TableHead>
                  <TableHead>Curso Solicitado</TableHead>
                  <TableHead>Fecha de Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInscripciones.map((inscripcion) => (
                  <TableRow key={inscripcion.id}>
                    <TableCell className="font-medium">{inscripcion.alumno}</TableCell>
                    <TableCell>{inscripcion.curso}</TableCell>
                    <TableCell>{inscripcion.fecha}</TableCell>
                    <TableCell>{getStatusBadge(inscripcion.estado)}</TableCell>
                    <TableCell className="text-right">
                       {inscripcion.estado === 'Pendiente' && (
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleUpdateStatus(inscripcion.id, 'Aprobada')}>
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Aprobar
                            </Button>
                             <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleUpdateStatus(inscripcion.id, 'Rechazada')}>
                                <XCircle className="h-4 w-4 mr-2" /> Rechazar
                            </Button>
                        </div>
                       )}
                       {inscripcion.estado !== 'Pendiente' && (
                           <Button size="sm" variant="ghost">Ver Detalles</Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
