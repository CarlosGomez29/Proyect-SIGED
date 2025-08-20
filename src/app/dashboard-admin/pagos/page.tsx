
"use client";

import React, { useState } from 'react';
import { File, PlusCircle, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

const pagosData = [
  { id: 1, alumno: "Juan Pérez", curso: "Seguridad de la Carga Aérea", monto: 500, fecha: "2024-05-15", estado: "Pagado" },
  { id: 2, alumno: "María García", curso: "Mercancías Peligrosas", monto: 750, fecha: "2024-05-10", estado: "Vencido" },
  { id: 3, alumno: "Carlos López", curso: "AVSEC para Tripulación", monto: 600, fecha: "2024-05-20", estado: "Pagado" },
  { id: 4, alumno: "Ana Martínez", curso: "Manejo de Crisis", monto: 800, fecha: "2024-05-01", estado: "Pendiente" },
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

export default function PagosPage() {
  const [filter, setFilter] = useState("Pendiente");
  
  const filteredPagos = pagosData.filter(p => filter === 'Todos' ? true : p.estado === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pagado":
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>;
      case "Pendiente":
        return <Badge className="bg-amber-100 text-amber-800">Pendiente</Badge>;
      case "Vencido":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Vencido</Badge>;
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestión de Pagos</h1>
          <p className="text-muted-foreground">Registra y monitorea el estado financiero de los alumnos.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Registrar Pago
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
            <div className="flex items-center justify-between">
              <CardTitle>Registros Financieros</CardTitle>
              <Tabs defaultValue="Pendiente" onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="Pendiente">Pendientes</TabsTrigger>
                  <TabsTrigger value="Pagado">Pagados</TabsTrigger>
                  <TabsTrigger value="Vencido">Vencidos</TabsTrigger>
                  <TabsTrigger value="Todos">Todos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead className="text-right">Monto (USD)</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Fecha Límite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPagos.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell className="font-medium">{pago.alumno}</TableCell>
                    <TableCell>{pago.curso}</TableCell>
                    <TableCell className="text-right">${pago.monto.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(pago.estado)}</TableCell>
                    <TableCell className="text-right">{pago.fecha}</TableCell>
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

    