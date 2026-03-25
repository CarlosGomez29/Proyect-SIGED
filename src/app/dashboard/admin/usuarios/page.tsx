
"use client";

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  UserCircle, 
  Phone, 
  School, 
  Power, 
  PowerOff, 
  Edit,
  Loader2,
  UserPlus,
  KeyRound
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
  query, 
  orderBy,
  where
} from 'firebase/firestore';

const ROLES = [
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin Escuela' },
  { value: 'admision', label: 'Admisiones' },
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
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToReset, setUserToReset] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedEscuelaId, setSelectedEscuelaId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || isSaving) return;

    const formData = new FormData(e.currentTarget);
    
    // Manejo robusto de campos que pueden venir nulos si están deshabilitados
    const usernameInput = formData.get('username') as string | null;
    const username = (usernameInput || editingUser?.username || "").trim().toLowerCase();
    
    // Capturamos el rol y la escuela desde el estado o el formData
    const role = (formData.get('rol') as string) || selectedRole;
    const escuelaId = (formData.get('escuelaId') as string) || selectedEscuelaId;
    const password = formData.get('password') as string | null;

    if (!username) {
      toast({ variant: "destructive", title: "Error", description: "Nombre de usuario requerido." });
      return;
    }

    if (!role) {
      toast({ variant: "destructive", title: "Error", description: "Debe seleccionar un rol." });
      return;
    }

    if (role !== 'superadmin' && !escuelaId) {
      toast({ variant: "destructive", title: "Error", description: "Asigne una escuela para este rol." });
      return;
    }

    setIsSaving(true);

    try {
      const payload: any = {
        username: username,
        nombre: formData.get('nombre') as string,
        apellido: formData.get('apellido') as string,
        telefono: formData.get('telefono') as string,
        rol: role,
        escuelaId: role === 'superadmin' ? null : escuelaId,
      };

      if (editingUser) {
        payload.id = editingUser.id;
      } else {
        payload.password = password;
      }

      const response = await fetch('/api/admin/users/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al guardar');

      toast({ 
        title: editingUser ? "Usuario Actualizado" : "Usuario Creado", 
        description: editingUser ? "Los cambios han sido guardados." : `Acceso habilitado para @${username}.` 
      });

      setIsModalOpen(false);
      setEditingUser(null);
      setSelectedRole("");
      setSelectedEscuelaId("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userToReset) return;

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;

    try {
      const response = await fetch('/api/admin/users/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToReset.id, newPassword })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast({ title: "Contraseña Actualizada", description: `Nueva clave asignada para @${userToReset.username}.` });
      setIsResetModalOpen(false);
      setUserToReset(null);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "No se pudo actualizar la contraseña." });
    }
  };
  const toggleEstado = async (user: any) => {
    const nuevoEstado = user.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      const response = await fetch('/api/admin/users/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, estado: nuevoEstado })
      });
      if (!response.ok) throw new Error('Error al actualizar estado');
      toast({ title: "Estado Actualizado", description: `Usuario @${user.username} ahora está ${nuevoEstado}.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cambiar el estado del usuario." });
    }
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setSelectedRole(user.rol);
    setSelectedEscuelaId(user.escuelaId || "");
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEscuelaNombre = (id: string) => {
    if (!id) return "Global / SIGED";
    const escuela = escuelas.find(e => e.id === id);
    return escuela ? escuela.nombre : "ID: " + id;
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tighter">Directorio de Usuarios</h1>
          <p className="text-muted-foreground font-medium">Control de acceso y seguridad administrativa basado en Firestore.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => { 
          setIsModalOpen(open); 
          if (!open) { 
            setEditingUser(null); 
            setSelectedRole(""); 
            setSelectedEscuelaId("");
          }
        }}>
          <DialogTrigger asChild>
            <Button className="font-bold uppercase tracking-widest text-[10px]">
              <UserPlus className="mr-2 h-4 w-4" /> Crear Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">{editingUser ? 'Editar Perfil' : 'Registrar Credenciales'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveUser} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de Usuario (Login)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">@</span>
                    <Input 
                      name="username" 
                      className="pl-8" 
                      defaultValue={editingUser?.username || ''} 
                      placeholder="juan.perez" 
                      required 
                      disabled={!!editingUser} 
                    />
                  </div>
                </div>
                {!editingUser && (
                  <div className="space-y-2">
                    <Label>Contraseña Inicial</Label>
                    <Input name="password" type="password" placeholder="Mínimo 6 caracteres" required />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nombre</Label><Input name="nombre" defaultValue={editingUser?.nombre || ''} required /></div>
                <div className="space-y-2"><Label>Apellido</Label><Input name="apellido" defaultValue={editingUser?.apellido || ''} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rol del Sistema</Label>
                  <Select name="rol" value={selectedRole} onValueChange={setSelectedRole} required>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Seleccionar rol..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Escuela Asignada</Label>
                  <Select 
                    name="escuelaId" 
                    value={selectedEscuelaId} 
                    onValueChange={setSelectedEscuelaId} 
                    disabled={selectedRole === 'superadmin'}
                  >
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder={selectedRole === 'superadmin' ? "Acceso Institucional" : "Seleccionar recinto..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingEscuelas ? (<div className="p-4 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>) : 
                        escuelas.map((e) => (<SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Teléfono de Contacto</Label><Input name="telefono" defaultValue={editingUser?.telefono || ''} placeholder="809-000-0000" /></div>
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                <Button type="submit" disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar Usuario'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por usuario o nombre..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse font-bold">Cargando base de datos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">ID / Login</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Nombre Completo</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Rol</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Recinto</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-center">Estado</TableHead>
                  <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/30 border-border/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10"><UserCircle className="h-5 w-5 text-primary" /></div>
                        <span className="font-mono text-xs font-black text-primary">@{u.username}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="font-bold text-sm">{u.nombre} {u.apellido}</span></TableCell>
                    <TableCell><Badge variant="outline" className="font-bold uppercase text-[9px]">{u.rol}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-semibold"><School className="h-3 w-3 text-muted-foreground" />{getEscuelaNombre(u.escuelaId)}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={u.estado === 'activo' ? 'bg-success/15 text-success border-success/20' : 'bg-destructive/15 text-destructive border-destructive/20'}>
                        {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl">
                          <DropdownMenuLabel className="text-[9px] font-bold uppercase opacity-50 px-2">Control Maestro</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEdit(u)} className="cursor-pointer"><Edit className="h-4 w-4 mr-2" /> Editar Información</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleEstado(u)} className="cursor-pointer">
                            {u.estado === 'activo' ? <PowerOff className="h-4 w-4 mr-2 text-destructive" /> : <Power className="h-4 w-4 mr-2 text-success" />}
                            {u.estado === 'activo' ? 'Desactivar Acceso' : 'Habilitar Acceso'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setUserToReset(u); setIsResetModalOpen(true); }} className="cursor-pointer text-primary font-bold">
                            <KeyRound className="h-4 w-4 mr-2" /> Forzar Nueva Clave
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Forzar Cambio de Contraseña */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader><DialogTitle className="text-2xl font-black">Nueva Contraseña</DialogTitle></DialogHeader>
          <form onSubmit={handleManualResetPassword} className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Está asignando una nueva clave de acceso para <strong>@{userToReset?.username}</strong>. No se enviarán correos; informe al usuario directamente.</p>
            <div className="space-y-2">
              <Label>Nueva Clave de Acceso</Label>
              <Input name="newPassword" type="password" required placeholder="Ingrese la nueva clave" />
            </div>
            <DialogFooter><DialogClose asChild><Button variant="ghost">Cerrar</Button></DialogClose><Button type="submit">Actualizar Clave</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
