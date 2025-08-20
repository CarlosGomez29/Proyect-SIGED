
"use client";

import React, { useState } from 'react';
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

const initialCalificacionesData = [
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
    const { toast } = useToast();
    const [calificacionesData, setCalificacionesData] = useState(initialCalificacionesData);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleSaveCalificacion = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCalificacion = {
            id: Date.now(),
            alumno: formData.get('alumno') as string,
            curso: formData.get('curso') as string,
            calificacion: parseInt(formData.get('calificacion') as string, 10),
            fecha: new Date().toISOString().split('T')[0],
        };
        setCalificacionesData([...calificacionesData, newCalificacion]);
        toast({ title: "Calificación Registrada", description: `Se ha añadido la calificación para ${newCalificacion.alumno}.` });
        setIsModalOpen(false);
    };

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
                            <Input id="alumno" name="alumno" placeholder="Nombre del alumno" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="curso" className="text-right">Curso</Label>
                            <Input id="curso" name="curso" placeholder="Nombre del curso" className="col-span-3" required />
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
                    <TableCell className={`text-center font-semibold ${calif.calificacion < 80 ? 'text-red-600' : 'text-green-600'}`}>{calif.calificacion}</TableCell>
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

    
