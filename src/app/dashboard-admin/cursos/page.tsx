
"use client";

import React, { useState } from 'react';
import { File, PlusCircle, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';


const initialCursosData = [
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
    const { toast } = useToast();
    const [cursosData, setCursosData] = useState(initialCursosData);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCurso, setEditingCurso] = useState<any>(null);

    const handleSaveCurso = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCurso = {
            id: editingCurso ? editingCurso.id : Date.now(),
            nombre: formData.get('nombre') as string,
            instructor: formData.get('instructor') as string,
            inicio: formData.get('inicio') as string,
            fin: formData.get('fin') as string,
        };

        if (editingCurso) {
            setCursosData(cursosData.map(c => c.id === newCurso.id ? newCurso : c));
            toast({ title: "Curso Actualizado", description: `El curso ${newCurso.nombre} ha sido actualizado.` });
        } else {
            setCursosData([...cursosData, newCurso]);
            toast({ title: "Curso Creado", description: `El curso ${newCurso.nombre} ha sido creado.` });
        }
        setIsModalOpen(false);
        setEditingCurso(null);
    };

    const handleEdit = (curso: any) => {
        setEditingCurso(curso);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setCursosData(cursosData.filter(c => c.id !== id));
        toast({
            variant: "destructive",
            title: "Curso Eliminado",
            description: "El curso ha sido eliminado permanentemente.",
        });
    };

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
            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) setEditingCurso(null);
            }}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Crear Nuevo Curso
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCurso ? 'Editar Curso' : 'Crear Nuevo Curso'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveCurso} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">Nombre</Label>
                            <Input id="nombre" name="nombre" defaultValue={editingCurso?.nombre || ''} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="instructor" className="text-right">Instructor</Label>
                            <Input id="instructor" name="instructor" defaultValue={editingCurso?.instructor || ''} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="inicio" className="text-right">Fecha Inicio</Label>
                            <Input id="inicio" name="inicio" type="date" defaultValue={editingCurso?.inicio || ''} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fin" className="text-right">Fecha Fin</Label>
                            <Input id="fin" name="fin" type="date" defaultValue={editingCurso?.fin || ''} className="col-span-3" required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                            <Button type="submit">Guardar Curso</Button>
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
                          <DropdownMenuItem onClick={() => handleEdit(curso)}>Editar</DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Eliminar</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el curso.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(curso.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

    
