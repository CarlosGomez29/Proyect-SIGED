
"use client";

import React, { useState, useMemo } from 'react';
import {
  File,
  PlusCircle,
  Search,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Firebase imports
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
    const { toast } = useToast();
    const db = useFirestore();
    
    // Conexión real a Firestore
    const alumnosQuery = useMemo(() => db ? collection(db, "estudiantes") : null, [db]);
    const { data: alumnosData, loading } = useCollection(alumnosQuery);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string[]>(["Activo", "Inactivo", "Suspendido"]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAlumno, setEditingAlumno] = useState<any>(null);

    const handleFilterChange = (status: string) => {
        setStatusFilter(prev => 
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };
    
    const handleSaveAlumno = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!db) return;

        const formData = new FormData(e.currentTarget);
        const alumnoPayload = {
            nombre: formData.get('nombre') as string,
            apellido: formData.get('apellido') as string,
            curso: formData.get('curso') as string,
            estado: formData.get('estado') as string,
            updatedAt: serverTimestamp(),
        };

        if (editingAlumno) {
            const alumnoRef = doc(db, "estudiantes", editingAlumno.id);
            updateDoc(alumnoRef, alumnoPayload)
              .then(() => toast({ title: "Alumno Actualizado", description: `${alumnoPayload.nombre} ha sido actualizado.` }))
              .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: alumnoRef.path, operation: 'update', requestResourceData: alumnoPayload })));
        } else {
            const collectionRef = collection(db, "estudiantes");
            addDoc(collectionRef, { ...alumnoPayload, createdAt: serverTimestamp() })
              .then(() => toast({ title: "Alumno Registrado", description: `${alumnoPayload.nombre} ha sido añadido.` }))
              .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: collectionRef.path, operation: 'create', requestResourceData: alumnoPayload })));
        }
        setIsModalOpen(false);
        setEditingAlumno(null);
    };

    const handleEdit = (alumno: any) => {
        setEditingAlumno(alumno);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (!db) return;
        const alumnoRef = doc(db, "estudiantes", id);
        deleteDoc(alumnoRef)
          .then(() => toast({ variant: "destructive", title: "Alumno Eliminado", description: "El registro ha sido eliminado de Firestore." }))
          .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: alumnoRef.path, operation: 'delete' })));
    };

    const filteredAlumnos = alumnosData.filter(alumno => 
        (alumno.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || alumno.apellido?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        statusFilter.includes(alumno.estado || "Activo")
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
          <p className="text-muted-foreground">Busca, filtra y gestiona los perfiles reales en Firestore.</p>
        </div>
        <div className="flex items-center gap-2">
            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) setEditingAlumno(null);
            }}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Registrar Nuevo Alumno
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAlumno ? 'Editar Alumno' : 'Registrar Nuevo Alumno'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveAlumno} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">Nombre</Label>
                            <Input id="nombre" name="nombre" defaultValue={editingAlumno?.nombre || ''} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="apellido" className="text-right">Apellido</Label>
                            <Input id="apellido" name="apellido" defaultValue={editingAlumno?.apellido || ''} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="curso" className="text-right">Curso</Label>
                            <Input id="curso" name="curso" defaultValue={editingAlumno?.curso || ''} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="estado" className="text-right">Estado</Label>
                            <Select name="estado" defaultValue={editingAlumno?.estado || 'Activo'}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Activo">Activo</SelectItem>
                                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                            <Button type="submit">Guardar</Button>
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
            {loading ? (
                <div className="p-12 text-center text-muted-foreground">Consultando base de datos...</div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead className="hidden md:table-cell">Curso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAlumnos.map((alumno) => (
                    <TableRow key={alumno.id}>
                        <TableCell className="font-medium">{`${alumno.nombre} ${alumno.apellido}`}</TableCell>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast({ title: `Perfil de ${alumno.nombre}`})}>Ver Perfil</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(alumno)}>Editar</DropdownMenuItem>
                            <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Eliminar</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del alumno de Firestore.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(alumno.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
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
            )}
          </CardContent>
          <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
             <div>Registros encontrados: {filteredAlumnos.length}</div>
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
