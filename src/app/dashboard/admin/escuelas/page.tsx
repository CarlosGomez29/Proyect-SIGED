
"use client";

import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Power, 
  PowerOff, 
  Info,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

// Firebase
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function GestionEscuelasPage() {
  const { toast } = useToast();
  const { startImpersonation } = useAuth();
  const db = useFirestore();
  
  const escuelasQuery = useMemo(() => db ? query(collection(db, "escuelas"), orderBy("nombre", "asc")) : null, [db]);
  const { data: escuelas, loading } = useCollection(escuelasQuery);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateEscuela = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;

    const formData = new FormData(e.currentTarget);
    const payload = {
      nombre: formData.get('nombre') as string,
      provincia: formData.get('provincia') as string,
      sector: formData.get('sector') as string,
      estado: "activo",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    addDoc(collection(db, "escuelas"), payload)
      .then(() => {
        toast({ title: "Escuela Creada", description: `${payload.nombre} ha sido registrada.` });
        setIsModalOpen(false);
      })
      .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'escuelas', operation: 'create', requestResourceData: payload })));
  };

  const toggleEstado = (escuela: any) => {
    if (!db) return;
    const nuevoEstado = escuela.estado === 'activo' ? 'inactivo' : 'activo';
    updateDoc(doc(db, "escuelas", escuela.id), { estado: nuevoEstado, updatedAt: serverTimestamp() })
      .then(() => toast({ title: "Estado Actualizado", description: `La escuela ahora está ${nuevoEstado}.` }))
      .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `escuelas/${escuela.id}`, operation: 'update' })));
  };

  const filteredEscuelas = escuelas.filter(e => 
    e.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.provincia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tighter">Gestión de Escuelas</h1>
          <p className="text-muted-foreground font-medium">Administración global de recintos y centros educativos.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold uppercase tracking-widest text-[10px]">
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Escuela
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nueva Escuela</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEscuela} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Escuela</Label>
                <Input id="nombre" name="nombre" placeholder="Ej. Santo Domingo Este" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input id="provincia" name="provincia" placeholder="Ej. Santo Domingo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Input id="sector" name="sector" placeholder="Ej. San Isidro" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                <Button type="submit">Guardar Registro</Button>
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
              placeholder="Buscar escuela o provincia..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse font-bold">Consultando base de datos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Escuela</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Ubicación</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Estado</TableHead>
                  <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEscuelas.map((e) => (
                  <TableRow key={e.id} className="hover:bg-muted/30 border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{e.nombre}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">ID: {e.id.substring(0,8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {e.provincia}
                        </div>
                        <span className="text-[10px] text-muted-foreground pl-4.5">{e.sector || 'Sin sector especificado'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={e.estado === 'activo' ? 'bg-success/15 text-success border-success/20' : 'bg-destructive/15 text-destructive border-destructive/20'}>
                        {e.estado === 'activo' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-border/50">
                          <DropdownMenuItem onClick={() => startImpersonation({ id: e.id, nombre: e.nombre })} className="cursor-pointer font-bold text-primary">
                            <ShieldCheck className="h-4 w-4 mr-2" /> Acceder a la Escuela
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Info className="h-4 w-4 mr-2" /> Ver Información
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleEstado(e)} className="cursor-pointer">
                            {e.estado === 'activo' ? <PowerOff className="h-4 w-4 mr-2 text-destructive" /> : <Power className="h-4 w-4 mr-2 text-success" />}
                            {e.estado === 'activo' ? 'Desactivar' : 'Activar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEscuelas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground font-medium italic">No se encontraron escuelas registradas.</TableCell>
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
