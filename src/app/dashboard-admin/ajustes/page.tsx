
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const initialUsers = [
    { id: 'user1', nombre: 'Admin User', email: 'admin@esac.com', rol: 'Administrador' },
    { id: 'user2', nombre: 'Juan Pérez', email: 'juan.perez@esac.com', rol: 'Instructor' },
    { id: 'user3', nombre: 'Maria Garcia', email: 'maria.garcia@esac.com', rol: 'Instructor' },
    { id: 'user4', nombre: 'Carlos López', email: 'carlos.lopez@esac.com', rol: 'Admision' },
];

const initialInstructors = [
    { id: 'inst1', nombre: 'Juan Pérez' },
    { id: 'inst2', nombre: 'María García' },
    { id: 'inst3', nombre: 'Carlos López' },
    { id: 'inst4', nombre: 'Ana Martínez' },
    { id: 'inst5', nombre: 'Luis Hernández' },
];


export default function AjustesPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState(initialUsers);
    const [instructors, setInstructors] = useState(initialInstructors);
    
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState<any>(null);
    
    const [notifications, setNotifications] = useState({
        pendingEnrollment: true,
        courseReminders: false,
    });

    const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userData = {
            id: editingUser ? editingUser.id : `user${Date.now()}`,
            nombre: formData.get('nombre') as string,
            email: formData.get('email') as string,
            rol: formData.get('rol') as string,
        };

        if (editingUser) {
            setUsers(users.map(u => u.id === userData.id ? userData : u));
            toast({ title: "Usuario Actualizado", description: `Los datos de ${userData.nombre} han sido actualizados.` });
        } else {
            setUsers([...users, userData]);
            toast({ title: "Usuario Creado", description: `${userData.nombre} ha sido añadido al sistema.` });
        }
        setIsUserModalOpen(false);
        setEditingUser(null);
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
        toast({ variant: 'destructive', title: "Usuario Eliminado", description: "El usuario ha sido eliminado del sistema." });
    };

     const handleSaveInstructor = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const instructorData = {
            id: editingInstructor ? editingInstructor.id : `inst${Date.now()}`,
            nombre: formData.get('nombre') as string,
        };

        if (editingInstructor) {
            setInstructors(instructors.map(i => i.id === instructorData.id ? instructorData : i));
            toast({ title: "Instructor Actualizado" });
        }
        setIsInstructorModalOpen(false);
        setEditingInstructor(null);
    };

     const handleEditInstructor = (instructor: any) => {
        setEditingInstructor(instructor);
        setIsInstructorModalOpen(true);
    };


  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Ajustes del Sistema</h1>
        <p className="text-muted-foreground">Configura y gestiona los parámetros globales de la aplicación.</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="master-data">Datos Maestros</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usuarios y Roles</CardTitle>
                <CardDescription>Administra el acceso y los permisos de los usuarios.</CardDescription>
              </div>
               <Dialog open={isUserModalOpen} onOpenChange={(open) => {
                    setIsUserModalOpen(open);
                    if (!open) setEditingUser(null);
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Crear Nuevo Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveUser} className="grid gap-4 py-4">
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nombre" className="text-right">Nombre</Label>
                                <Input id="nombre" name="nombre" defaultValue={editingUser?.nombre} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" name="email" type="email" defaultValue={editingUser?.email} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rol" className="text-right">Rol</Label>
                                <Select name="rol" defaultValue={editingUser?.rol}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Administrador">Administrador</SelectItem>
                                        <SelectItem value="Instructor">Instructor</SelectItem>
                                        <SelectItem value="Admision">Admision</SelectItem>
                                        <SelectItem value="Alumno">Alumno</SelectItem>
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
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.nombre}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.rol}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditUser(user)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
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
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                    <CardDescription>Define qué notificaciones automáticas se envían.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="enrollment-notif">Inscripción Pendiente</Label>
                            <p className="text-sm text-muted-foreground">Enviar una notificación cuando una nueva inscripción requiere aprobación.</p>
                        </div>
                        <Switch id="enrollment-notif" checked={notifications.pendingEnrollment} onCheckedChange={(checked) => setNotifications({...notifications, pendingEnrollment: checked})}/>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="course-reminder-notif">Recordatorios de Cursos</Label>
                            <p className="text-sm text-muted-foreground">Enviar recordatorios a los alumnos sobre cursos que están por comenzar.</p>
                        </div>
                        <Switch id="course-reminder-notif" checked={notifications.courseReminders} onCheckedChange={(checked) => setNotifications({...notifications, courseReminders: checked})} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="master-data" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Datos Maestros</CardTitle>
                    <CardDescription>Gestiona listas globales como instructores y categorías de cursos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="font-medium mb-2">Lista de Instructores</h3>
                    <div className="rounded-md border">
                        <Table>
                            <TableBody>
                                {instructors.map(instructor => (
                                    <TableRow key={instructor.id}>
                                        <TableCell>{instructor.nombre}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleEditInstructor(instructor)}>
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                     <Dialog open={isInstructorModalOpen} onOpenChange={(open) => {
                        setIsInstructorModalOpen(open);
                        if (!open) setEditingInstructor(null);
                    }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Instructor</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSaveInstructor} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nombre-instructor" className="text-right">Nombre</Label>
                                    <Input id="nombre-instructor" name="nombre" defaultValue={editingInstructor?.nombre} className="col-span-3" required />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                                    <Button type="submit">Guardar Cambios</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

    