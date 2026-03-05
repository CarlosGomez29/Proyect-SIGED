
"use client";

import React, { useState, useMemo } from 'react';
import { File, PlusCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Firebase imports
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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

export default function CalificacionesPage() {
    const { toast } = useToast();
    const db = useFirestore();
    
    // Consultamos inscripciones para gestionar sus notas
    const inscripcionesQuery = useMemo(() => db ? collection(db, "inscripciones") : null, [db]);
    const { data: calificacionesData, loading } = useCollection(inscripcionesQuery);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleSaveCalificacion = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!db) return;

        const formData = new FormData(e.currentTarget);
        const payload = {
            alumno: formData.get('alumno') as string,
            curso: formData.get('curso') as string,
            calificacion: parseInt(formData.get('calificacion') as string, 10),
            estado: "Aprobada",
            createdAt: serverTimestamp(),
        };

        const collectionRef = collection(db, "inscripciones");
        addDoc(collectionRef, payload)
          .then(() => toast({ title: "Calificación Registrada", description: `Se ha añadido la nota para ${payload.alumno} en Firestore.` }))
          .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: collectionRef.path, operation: 'create', requestResourceData: payload })));
        
        setIsModalOpen(false);
    };

    const filteredCalificaciones = calificacionesData.filter(c =>
        (c.alumno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.curso?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        c.calificacion !== undefined
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
          <p className="text-muted-foreground">Listado institucional persistente en la nube.</p>
        </div>
        <div className="flex items-center gap-2">
           <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Registrar Calificación
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Nueva Calificación</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveCalificacion} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alumno" className="text-right">Alumno</Label>
                            <Input id="alumno" name="alumno" placeholder="Nombre completo" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="curso" className="text-right">Curso</Label>
                            <Input id="curso" name="curso" placeholder="Nombre del programa" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="calificacion" className="text-right">Calificación</Label>
                            <Input id="calificacion" name="calificacion" type="number" min="0" max="100" placeholder="0-100" className="col-span-3" required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                            <Button type="submit">Guardar Calificación</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
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
            {loading ? (
                <div className="p-12 text-center text-muted-foreground">Consultando registros...</div>
            ) : (
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
                        <TableCell className="font-medium">{calif.alumno || "Sin nombre"}</TableCell>
                        <TableCell>{calif.curso || "Sin curso"}</TableCell>
                        <TableCell className={`text-center font-semibold ${calif.calificacion < 80 ? 'text-red-600' : 'text-green-600'}`}>{calif.calificacion}</TableCell>
                        <TableCell className="text-right">{calif.createdAt?.toDate ? calif.createdAt.toDate().toLocaleDateString() : "Reciente"}</TableCell>
                    </TableRow>
                    ))}
                    {filteredCalificaciones.length === 0 && (
                         <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground font-bold italic">No hay calificaciones registradas aún.</TableCell></TableRow>
                    )}
                </TableBody>
                </Table>
            )}
          </CardContent>
           <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
             <div>Registros encontrados: {filteredCalificaciones.length}</div>
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
