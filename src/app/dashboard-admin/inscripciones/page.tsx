
"use client";

import React, { useState, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Firebase imports
import { useFirestore, useCollection } from '@/firebase';
import { doc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
  const { toast } = useToast();
  const db = useFirestore();
  
  const inscripcionesQuery = useMemo(() => db ? collection(db, "inscripciones") : null, [db]);
  const { data: inscripciones, loading } = useCollection(inscripcionesQuery);

  const [filter, setFilter] = useState("Pendiente");

  const handleUpdateStatus = (id: string, newStatus: "Aprobada" | "Rechazada") => {
    if (!db) return;
    const inscripcionRef = doc(db, "inscripciones", id);
    const updateData = { estado: newStatus, updatedAt: serverTimestamp() };

    updateDoc(inscripcionRef, updateData)
      .then(() => toast({ title: `Inscripción ${newStatus}`, description: "El estatus se ha actualizado en tiempo real." }))
      .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: inscripcionRef.path, operation: 'update', requestResourceData: updateData })));
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
        <p className="text-muted-foreground">Revisa solicitudes reales desde la base de datos de Firestore.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Solicitudes Activas</CardTitle>
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
            {loading ? (
                <div className="p-12 text-center text-muted-foreground">Cargando solicitudes...</div>
            ) : (
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
                        <TableCell className="font-medium">{inscripcion.alumno || "Sin nombre"}</TableCell>
                        <TableCell>{inscripcion.curso || "Sin curso"}</TableCell>
                        <TableCell>{inscripcion.createdAt?.toDate ? inscripcion.createdAt.toDate().toLocaleDateString() : "Sin fecha"}</TableCell>
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
                    {filteredInscripciones.length === 0 && (
                         <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground font-bold">No hay registros con este estatus.</TableCell></TableRow>
                    )}
                </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
