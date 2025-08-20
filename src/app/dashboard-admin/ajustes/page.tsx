
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Search, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';


const initialUsers = [
    { id: 'user1', nombre: 'Admin User', email: 'admin@esac.com', rol: 'Administrador', estado: 'Activo', ultimoAcceso: '2024-05-28' },
    { id: 'user2', nombre: 'Juan Pérez', email: 'juan.perez@esac.com', rol: 'Instructor', estado: 'Activo', ultimoAcceso: '2024-05-27' },
    { id: 'user3', nombre: 'Maria Garcia', email: 'maria.garcia@esac.com', rol: 'Instructor', estado: 'Inactivo', ultimoAcceso: '2024-04-15' },
    { id: 'user4', nombre: 'Carlos López', email: 'carlos.lopez@esac.com', rol: 'Admision', estado: 'Activo', ultimoAcceso: '2024-05-28' },
    { id: 'user5', nombre: 'Ana Fernandez', email: 'ana.fernandez@esac.com', rol: 'Admision', estado: 'Activo', ultimoAcceso: '2024-05-26' },
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

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string[]>(['Administrador', 'Instructor', 'Admision', 'Alumno']);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter.includes(user.rol);
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

     const handleRoleFilterChange = (role: string) => {
        setRoleFilter(prev => 
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userData = {
            id: editingUser ? editingUser.id : `user${Date.now()}`,
            nombre: formData.get('nombre') as string,
            email: formData.get('email') as string,
            rol: formData.get('rol') as string,
            estado: editingUser ? editingUser.estado : 'Activo',
            ultimoAcceso: editingUser ? editingUser.ultimoAcceso : new Date().toISOString().split('T')[0],
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
            <CardHeader>
              <div>
                <CardTitle>Usuarios y Roles</CardTitle>
                <CardDescription>Administra el acceso y los permisos de los usuarios.</CardDescription>
              </div>
               <div className="flex items-center gap-4 mt-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por nombre o email..." 
                            className="pl-9"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                          Rol <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrar por rol</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {['Administrador', 'Instructor', 'Admision', 'Alumno'].map(role => (
                             <DropdownMenuCheckboxItem key={role} checked={roleFilter.includes(role)} onCheckedChange={() => handleRoleFilterChange(role)}>
                                {role}
                            </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                     <Dialog open={isUserModalOpen} onOpenChange={(open) => {
                        setIsUserModalOpen(open);
                        if (!open) setEditingUser(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Crear Usuario
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
                </div>
            </CardHeader>
            <CardContent>
               <TooltipProvider>
                   <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Último Acceso</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div>{user.nombre}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell>{user.rol}</TableCell>
                                <TableCell>
                                    <Badge variant={user.estado === 'Activo' ? 'default' : 'secondary'}
                                     className={user.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {user.estado}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.ultimoAcceso}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild><div className="flex items-center"><Edit className="mr-2 h-4 w-4" />Editar</div></TooltipTrigger>
                                                    <TooltipContent><p>Editar detalles del usuario</p></TooltipContent>
                                                </Tooltip>
                                            </DropdownMenuItem>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                                         <Tooltip>
                                                            <TooltipTrigger asChild><div className="flex items-center"><Trash2 className="mr-2 h-4 w-4" />Eliminar</div></TooltipTrigger>
                                                            <TooltipContent><p>Eliminar este usuario</p></TooltipContent>
                                                        </Tooltip>
                                                    </DropdownMenuItem>
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
                </TooltipProvider>
            </CardContent>
            <CardFooter>
                 <div className="text-xs text-muted-foreground">
                    Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios.
                </div>
            </CardFooter>
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
                       <TooltipProvider>
                        <Table>
                            <TableBody>
                                {instructors.map(instructor => (
                                    <TableRow key={instructor.id}>
                                        <TableCell>{instructor.nombre}</TableCell>
                                        <TableCell className="text-right">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => handleEditInstructor(instructor)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Editar nombre del instructor</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                       </TooltipProvider>
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
