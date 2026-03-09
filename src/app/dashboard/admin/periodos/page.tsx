
"use client";

import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  MoreHorizontal, 
  CalendarDays, 
  Edit, 
  Power, 
  PowerOff, 
  History,
  Loader2,
  Trash2
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
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function GestionPeriodosPage() {
  const { toast } = useToast();
  const db = useFirestore();
  
  const periodosQuery = useMemo(() => 
    db ? query(collection(db, "academic_periods"), orderBy("createdAt", "desc")) : null, 
  [db]);
  const { data: periodos, loading } = useCollection(periodosQuery);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState<any>(null);

  const handleSavePeriodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;

    const formData = new FormData(e.currentTarget);
    const payload = {
      nombre: formData.get('nombre') as string,
      fechaInicio: formData.get('fechaInicio') as string,
      fechaFin: formData.get('fechaFin') as string,
      estado: formData.get('estado') as string,
      updatedAt: serverTimestamp(),
    };

    if (editingPeriodo) {
      updateDoc(doc(db, "academic_periods", editingPeriodo.id), payload)
        .then(() => {
          toast({ title: "Periodo Actualizado", description: `${payload.nombre} ha sido modificado exitosamente.` });
          setIsModalOpen(false);
          setEditingPeriodo(null);
        })
        .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ 
          path: `academic_periods/${editingPeriodo.id}`, 
          operation: 'update', 
          requestResourceData: payload 
        })));
    } else {
      const createPayload = { ...payload, createdAt: serverTimestamp() };
      addDoc(collection(db, "academic_periods"), createPayload)
        .then(() => {
          toast({ title: "Periodo Creado", description: `${payload.nombre} ha sido registrado en el sistema.` });
          setIsModalOpen(false);
        })
        .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ 
          path: 'academic_periods', 
          operation: 'create', 
          requestResourceData: createPayload 
        })));
    }
  };

  const toggleEstado = (periodo: any) => {
    if (!db) return;
    const nuevoEstado = periodo.estado === 'activo' ? 'inactivo' : 'activo';
    updateDoc(doc(db, "academic_periods", periodo.id), { 
      estado: nuevoEstado, 
      updatedAt: serverTimestamp() 
    })
      .then(() => toast({ 
        title: "Estado Actualizado", 
        description: `El periodo ${periodo.nombre} ahora está ${nuevoEstado}.` 
      }))
      .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ 
        path: `academic_periods/${periodo.id}`, 
        operation: 'update' 
      })));
  };

  const deletePeriodo = (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, "academic_periods", id))
      .then(() => toast({ title: "Periodo Eliminado", variant: "destructive" }))
      .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ 
        path: `academic_periods/${id}`, 
        operation: 'delete' 
      })));
  };

  const openEdit = (periodo: any) => {
    setEditingPeriodo(periodo);
    setIsModalOpen(true);
  };

  const filteredPeriodos = periodos.filter(p => 
    p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tighter">Periodos Académicos</h1>
          <p className="text-muted-foreground font-medium">Gestión centralizada de ciclos lectivos para toda la red institucional.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) setEditingPeriodo(null); }}>
          <DialogTrigger asChild>
            <Button className="font-bold uppercase tracking-widest text-[10px]">
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Periodo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">{editingPeriodo ? 'Editar Periodo' : 'Crear Nuevo Periodo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSavePeriodo} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Periodo</Label>
                <Input id="nombre" name="nombre" defaultValue={editingPeriodo?.nombre || ''} placeholder="Ej. Año Escolar 2025-2026" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input id="fechaInicio" name="fechaInicio" type="date" defaultValue={editingPeriodo?.fechaInicio || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha de Finalización</Label>
                  <Input id="fechaFin" name="fechaFin" type="date" defaultValue={editingPeriodo?.fechaFin || ''} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select name="estado" defaultValue={editingPeriodo?.estado || 'activo'}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Seleccionar estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                <Button type="submit" className="px-8">
                  {editingPeriodo ? 'Guardar Cambios' : 'Crear Periodo'}
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
              placeholder="Buscar periodo..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse font-bold">Consultando registros...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Nombre del Periodo</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Inicio</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Finalización</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Estado</TableHead>
                  <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeriodos.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30 border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold text-sm">{p.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium">{p.fechaInicio}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium">{p.fechaFin}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={p.estado === 'activo' ? 'bg-success/15 text-success border-success/20' : 'bg-destructive/15 text-destructive border-destructive/20'}>
                        {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-border/50">
                          <DropdownMenuLabel className="text-[9px] font-bold uppercase opacity-50 px-2">Control</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEdit(p)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Editar Periodo
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleEstado(p)} className="cursor-pointer">
                            {p.estado === 'activo' ? <PowerOff className="h-4 w-4 mr-2 text-destructive" /> : <Power className="h-4 w-4 mr-2 text-success" />}
                            {p.estado === 'activo' ? 'Desactivar Periodo' : 'Activar Periodo'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deletePeriodo(p.id)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Eliminar Registro
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPeriodos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-medium italic">No se encontraron periodos académicos.</TableCell>
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
