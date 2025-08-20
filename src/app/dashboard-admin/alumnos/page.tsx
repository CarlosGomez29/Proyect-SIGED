
"use client";

import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const initialAlumnosData = [
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
    const { toast } = useToast();
    const [alumnosData, setAlumnosData] = useState(initialAlumnosData);
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
        const formData = new FormData(e.currentTarget);
        const newAlumno = {
            id: editingAlumno ? editingAlumno.id : Date.now(),
            nombre: formData.get('nombre') as string,
            apellido: formData.get('apellido') as string,
            curso: formData.get('curso') as string,
            estado: formData.get('estado') as string,
        };

        if (editingAlumno) {
            setAlumnosData(alumnosData.map(a => a.id === newAlumno.id ? newAlumno : a));
            toast({ title: "Alumno Actualizado", description: `${newAlumno.nombre} ha sido actualizado.` });
        } else {
            setAlumnosData([...alumnosData, newAlumno]);
            toast({ title: "Alumno Registrado", description: `${newAlumno.nombre} ha sido añadido.` });
        }
        setIsModalOpen(false);
        setEditingAlumno(null);
    };

    const handleEdit = (alumno: any) => {
        setEditingAlumno(alumno);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setAlumnosData(alumnosData.filter(a => a.id !== id));
        toast({
            variant: "destructive",
            title: "Alumno Eliminado",
            description: "El registro del alumno ha sido eliminado.",
        });
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
                            <Input id="estado" name="estado" defaultValue={editingAlumno?.estado || 'Activo'} className="col-span-3" required />
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
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del alumno.
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
