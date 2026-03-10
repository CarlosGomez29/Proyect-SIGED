
"use client";

import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  MoreHorizontal, 
  UserCircle, 
  Mail, 
  Phone, 
  ShieldCheck, 
  School, 
  Power, 
  PowerOff, 
  Edit,
  Loader2,
  UserPlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Firebase
import { useFirestore, useCollection } from '@/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const ROLES = [
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin Escuela' },
  { value: 'admision', label: 'Admisiones' },
  { value: 'profesor', label: 'Profesor' },
  { value: 'estudiante', label: 'Estudiante' },
];

export default function GestionUsuariosPage() {
  const { toast } = useToast();
  const db = useFirestore();
  
  const usersQuery = useMemo(() => 
    db ? query(collection(db, "users"), orderBy("createdAt", "desc")) : null, 
  [db]);
  const { data: users, loading } = useCollection(usersQuery);

  const escuelasQuery = useMemo(() => 
    db ? query(collection(db, "escuelas"), orderBy("nombre", "asc")) : null, 
  [db]);
  const { data: escuelas, loading: loadingEscuelas } = useCollection(escuelasQuery);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;

    const formData = new FormData(e.currentTarget);
    const role = formData.get('rol') as string;
    const escuelaId = formData.get('escuelaId') as string;

    // Validación: Si no es superadmin, debe tener escuela
    if (role !== 'superadmin' && !escuelaId) {
      toast({ 
        variant: "destructive", 
        title: "Campo requerido", 
        description: "Debe asignar una escuela para este rol." 
      });
      return;
    }

    const payload = {
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      rol: role,
      escuelaId: role === 'superadmin' ? null : escuelaId,
      estado: editingUser ? editingUser.estado : "activo",
      updatedAt: serverTimestamp(),
    };

    if (editingUser) {
      updateDoc(doc(db, "users", editingUser.id), payload)
        .then(() => {
          toast({ title: "Usuario Actualizado", description: `${payload.nombre} ha sido modificado.` });
          setIsModalOpen(false);
          setEditingUser(null);
        })
        .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ 
          path: `users/${editingUser.id}`, 
          operation: 'update', 
          requestResourceData: payload 
        })));
    } else {
      const createPayload = { ...payload, createdAt: serverTimestamp() };
      // En una implementación real, aquí se llamaría a una Cloud Function para crear el Auth User
      // o se usaría createUserWithEmailAndPassword (pero esto desloguearía al admin actual).
      // Por propósitos de prototipo, gestionamos el perfil en Firestore.
      addDoc(collection(db, "users"), createPayload)
        .then(() => {
          toast({ title: "Usuario Creado", description: `${payload.nombre} ha sido registrado.` });
          setIsModalOpen(false);
        })
        .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ 
          path: 'users', 
          operation: 'create', 
          requestResourceData: createPayload 
        })));
    }
  };

  const toggleEstado = (user: any) => {
    if (!db) return;
    const nuevoEstado = user.estado === 'activo' ? 'inactivo' : 'activo';
    updateDoc(doc(db, "users", user.id), { 
      estado: nuevoEstado, 
      updatedAt: serverTimestamp() 
    })
      .then(() => toast({ 
        title: "Estado Actualizado", 
        description: `El usuario ahora está ${nuevoEstado}.` 
      }))
      .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ 
        path: `users/${user.id}`, 
        operation: 'update' 
      })));
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setSelectedRole(user.rol);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEscuelaNombre = (id: string) => {
    if (!id) return "N/A (Global)";
    const escuela = escuelas.find(e => e.id === id);
    return escuela ? escuela.nombre : "ID: " + id;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tighter">Gestión de Usuarios</h1>
          <p className="text-muted-foreground font-medium">Administración centralizada de accesos, roles y asignaciones.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => { 
          setIsModalOpen(open); 
          if (!open) { setEditingUser(null); setSelectedRole(""); }
        }}>
          <DialogTrigger asChild>
            <Button className="font-bold uppercase tracking-widest text-[10px]">
              <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">{editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveUser} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" name="nombre" defaultValue={editingUser?.nombre || ''} placeholder="Ej. Juan" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" name="apellido" defaultValue={editingUser?.apellido || ''} placeholder="Ej. Pérez" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" name="email" type="email" defaultValue={editingUser?.email || ''} placeholder="juan@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" name="telefono" defaultValue={editingUser?.telefono || ''} placeholder="809-000-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rol">Rol del Sistema</Label>
                  <Select 
                    name="rol" 
                    defaultValue={editingUser?.rol || ''} 
                    onValueChange={setSelectedRole}
                    required
                  >
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Seleccionar rol..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escuelaId">Escuela Asignada</Label>
                  <Select 
                    name="escuelaId" 
                    defaultValue={editingUser?.escuelaId || ''} 
                    disabled={selectedRole === 'superadmin'}
                  >
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder={selectedRole === 'superadmin' ? "Acceso Global" : "Seleccionar escuela..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingEscuelas ? (
                        <div className="p-4 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>
                      ) : escuelas.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRole !== 'superadmin' && !editingUser?.escuelaId && (
                    <p className="text-[10px] text-muted-foreground mt-1 italic">Requerido para roles de escuela.</p>
                  )}
                </div>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                <Button type="submit" className="px-8">
                  {editingUser ? 'Guardar Cambios' : 'Crear Cuenta'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre, apellido o email..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse font-bold">Consultando directorio de usuarios...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Usuario</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Contacto</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Rol</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Escuela Asignada</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Estado</TableHead>
                  <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/30 border-border/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{u.nombre} {u.apellido}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{u.id.substring(0,8)}...</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {u.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {u.telefono || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold uppercase tracking-tighter text-[9px] px-2 py-0">
                        {u.rol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <School className="h-3 w-3 text-muted-foreground" />
                        {getEscuelaNombre(u.escuelaId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={u.estado === 'activo' ? 'bg-success/15 text-success border-success/20' : 'bg-destructive/15 text-destructive border-destructive/20'}>
                        {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-border/50">
                          <DropdownMenuLabel className="text-[9px] font-bold uppercase opacity-50 px-2">Control de Usuario</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEdit(u)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Editar Información
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleEstado(u)} className="cursor-pointer">
                            {u.estado === 'activo' ? <PowerOff className="h-4 w-4 mr-2 text-destructive" /> : <Power className="h-4 w-4 mr-2 text-success" />}
                            {u.estado === 'activo' ? 'Desactivar Usuario' : 'Activar Usuario'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-primary font-bold">
                            <ShieldCheck className="h-4 w-4 mr-2" /> Resetear Contraseña
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-medium italic">No se encontraron usuarios que coincidan con la búsqueda.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
