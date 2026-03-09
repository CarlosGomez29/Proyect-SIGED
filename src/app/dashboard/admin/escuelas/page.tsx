
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
  ExternalLink,
  Edit,
  Phone,
  Hash,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
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

  const provinciasQuery = useMemo(() => db ? query(collection(db, "provincias"), orderBy("nombre", "asc")) : null, [db]);
  const { data: provincias, loading: loadingProvincias } = useCollection(provinciasQuery);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEscuela, setEditingEscuela] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEscuela, setSelectedEscuela] = useState<any>(null);

  const handleSaveEscuela = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;

    const formData = new FormData(e.currentTarget);
    const payload = {
      nombre: formData.get('nombre') as string,
      provincia: formData.get('provincia') as string,
      ubicacion: formData.get('ubicacion') as string,
      telefono: formData.get('telefono') as string,
      extension: formData.get('extension') as string,
      estado: editingEscuela ? editingEscuela.estado : "activo",
      updatedAt: serverTimestamp(),
    };

    if (editingEscuela) {
      updateDoc(doc(db, "escuelas", editingEscuela.id), payload)
        .then(() => {
          toast({ title: "Escuela Actualizada", description: `${payload.nombre} ha sido modificada.` });
          setIsModalOpen(false);
          setEditingEscuela(null);
        })
        .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `escuelas/${editingEscuela.id}`, operation: 'update', requestResourceData: payload })));
    } else {
      const createPayload = { ...payload, createdAt: serverTimestamp() };
      addDoc(collection(db, "escuelas"), createPayload)
        .then(() => {
          toast({ title: "Escuela Creada", description: `${payload.nombre} ha sido registrada.` });
          setIsModalOpen(false);
        })
        .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'escuelas', operation: 'create', requestResourceData: createPayload })));
    }
  };

  const toggleEstado = (escuela: any) => {
    if (!db) return;
    const nuevoEstado = escuela.estado === 'activo' ? 'inactivo' : 'activo';
    updateDoc(doc(db, "escuelas", escuela.id), { estado: nuevoEstado, updatedAt: serverTimestamp() })
      .then(() => toast({ title: "Estado Actualizado", description: `La escuela ahora está ${nuevoEstado}.` }))
      .catch(async (err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `escuelas/${escuela.id}`, operation: 'update' })));
  };

  const openEdit = (escuela: any) => {
    setEditingEscuela(escuela);
    setIsModalOpen(true);
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
        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) setEditingEscuela(null); }}>
          <DialogTrigger asChild>
            <Button className="font-bold uppercase tracking-widest text-[10px]">
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Escuela
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingEscuela ? 'Editar Escuela' : 'Registrar Nueva Escuela'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEscuela} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Escuela</Label>
                <Input id="nombre" name="nombre" defaultValue={editingEscuela?.nombre || ''} placeholder="Ej. Santo Domingo Este" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <Select name="provincia" defaultValue={editingEscuela?.provincia || ''} required>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Seleccionar provincia..." />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingProvincias ? (
                        <div className="p-4 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>
                      ) : provincias.map((p) => (
                        <SelectItem key={p.id} value={p.nombre}>{p.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extension">Extensión</Label>
                  <Input id="extension" name="extension" defaultValue={editingEscuela?.extension || ''} placeholder="Ej. 201" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" name="telefono" defaultValue={editingEscuela?.telefono || ''} placeholder="Ej. 809-555-5555" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación (Google Maps Link)</Label>
                  <Input id="ubicacion" name="ubicacion" defaultValue={editingEscuela?.ubicacion || ''} placeholder="https://maps.app.goo.gl/..." />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                <Button type="submit">{editingEscuela ? 'Actualizar Registro' : 'Guardar Registro'}</Button>
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
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Nombre de la escuela</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Provincia</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Ubicación</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Teléfono</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Extensión</TableHead>
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
                        <span className="font-bold text-sm">{e.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {e.provincia}
                      </div>
                    </TableCell>
                    <TableCell>
                      {e.ubicacion ? (
                        <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary">
                          <a href={e.ubicacion} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" /> Ver Mapa
                          </a>
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">Sin enlace</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {e.telefono || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        {e.extension || 'N/A'}
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
                          <DropdownMenuLabel className="text-[9px] font-bold uppercase opacity-50 px-2">Control Maestro</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => startImpersonation({ id: e.id, nombre: e.nombre })} className="cursor-pointer font-bold text-primary">
                            <ShieldCheck className="h-4 w-4 mr-2" /> Acceder a la Escuela
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelectedEscuela(e); setIsViewDialogOpen(true); }} className="cursor-pointer">
                            <Info className="h-4 w-4 mr-2" /> Ver Información
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(e)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Editar Escuela
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleEstado(e)} className="cursor-pointer">
                            {e.estado === 'activo' ? <PowerOff className="h-4 w-4 mr-2 text-destructive" /> : <Power className="h-4 w-4 mr-2 text-success" />}
                            {e.estado === 'activo' ? 'Desactivar Escuela' : 'Activar Escuela'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEscuelas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-medium italic">No se encontraron escuelas registradas.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Ver Detalles */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Información Institucional</DialogTitle>
          </DialogHeader>
          {selectedEscuela && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-xl leading-none">{selectedEscuela.nombre}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{selectedEscuela.provincia}</p>
                </div>
              </div>
              
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-bold text-muted-foreground">Estado</span>
                  <Badge className={selectedEscuela.estado === 'activo' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}>
                    {selectedEscuela.estado === 'activo' ? 'Operativo' : 'Fuera de Servicio'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-bold text-muted-foreground">Teléfono</span>
                  <span className="font-medium">{selectedEscuela.telefono || 'No registrado'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-bold text-muted-foreground">Extensión</span>
                  <span className="font-mono">{selectedEscuela.extension || 'N/A'}</span>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-muted-foreground">Ubicación Geográfica</span>
                  {selectedEscuela.ubicacion ? (
                    <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                      <a href={selectedEscuela.ubicacion} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" /> Abrir en Google Maps
                      </a>
                    </Button>
                  ) : (
                    <p className="italic text-muted-foreground text-xs">Sin coordenadas registradas.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cerrar Ventana</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
