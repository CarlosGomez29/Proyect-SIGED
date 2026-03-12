
"use client";

import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  BookOpen, 
  Layers, 
  Edit, 
  ChevronRight, 
  ArrowLeft, 
  FileDown, 
  FileText, 
  File, 
  FileSpreadsheet,
  Loader2,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  Hash,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

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
  deleteDoc,
  where,
  getDocs
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function ConfiguracionAcademicaPage() {
  const { toast } = useToast();
  const db = useFirestore();

  // --- Queries ---
  const modulosQuery = useMemo(() => db ? query(collection(db, "modulos"), orderBy("nombre", "asc")) : null, [db]);
  const { data: modulos, loading: loadingModulos } = useCollection(modulosQuery);

  const accionesQuery = useMemo(() => db ? query(collection(db, "acciones_formativas"), orderBy("createdAt", "desc")) : null, [db]);
  const { data: acciones, loading: loadingAcciones } = useCollection(accionesQuery);

  const programasQuery = useMemo(() => db ? query(collection(db, "programas"), where("estado", "==", "activo")) : null, [db]);
  const { data: programas } = useCollection(programasQuery);

  // --- Estado Local ---
  const [activeTab, setActiveTab] = useState("acciones");
  const [viewingAction, setViewingAction] = useState<any>(null); // Acción cuya malla se está gestionando
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals
  const [isAccionModalOpen, setIsAccionModalOpen] = useState(false);
  const [editingAccion, setEditingAccion] = useState<any>(null);
  
  const [isModuloModalOpen, setIsModuloModalOpen] = useState(false);
  const [editingModulo, setEditingModulo] = useState<any>(null);

  const [isMallaModalOpen, setIsMallaModalOpen] = useState(false);
  const [isSubModuloModalOpen, setIsSubModuloModalOpen] = useState(false);
  const [editingSubModulo, setEditingSubModulo] = useState<any>(null);

  // --- Sub-Módulos Query (Malla Curricular) ---
  const subModulosQuery = useMemo(() => {
    if (!db || !viewingAction) return null;
    return query(collection(db, `acciones_formativas/${viewingAction.id}/modulos`), orderBy("orden", "asc"));
  }, [db, viewingAction]);
  const { data: subModulos, loading: loadingSubModulos } = useCollection(subModulosQuery);

  // --- Sincronización de Totales ---
  const syncAccionTotals = async (accionId: string) => {
    if (!db) return;
    try {
      const subColRef = collection(db, `acciones_formativas/${accionId}/modulos`);
      const snapshot = await getDocs(subColRef);
      
      let totalModulos = snapshot.size;
      let totalHoras = 0;
      
      snapshot.forEach(doc => {
        const data = doc.data();
        totalHoras += (data.totalHoras || 0);
      });

      await updateDoc(doc(db, "acciones_formativas", accionId), {
        totalModulos,
        totalHoras,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error sincronizando totales:", e);
    }
  };

  // --- Handlers Módulos (Catálogo) ---
  const handleSaveModulo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    const formData = new FormData(e.currentTarget);
    const payload = {
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      estado: formData.get('estado') as string,
      updatedAt: serverTimestamp(),
    };

    if (editingModulo) {
      updateDoc(doc(db, "modulos", editingModulo.id), payload)
        .then(() => { toast({ title: "Módulo Actualizado" }); setIsModuloModalOpen(false); setEditingModulo(null); })
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `modulos/${editingModulo.id}`, operation: 'update', requestResourceData: payload })));
    } else {
      addDoc(collection(db, "modulos"), { ...payload, createdAt: serverTimestamp() })
        .then(() => { toast({ title: "Módulo Creado" }); setIsModuloModalOpen(false); })
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'modulos', operation: 'create', requestResourceData: payload })));
    }
  };

  // --- Handlers Acciones Formativas ---
  const handleSaveAccion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    const formData = new FormData(e.currentTarget);
    const payload = {
      codigo: formData.get('codigo') as string,
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      programaId: formData.get('programaId') as string,
      estado: formData.get('estado') as string,
      updatedAt: serverTimestamp(),
    };

    if (editingAccion) {
      updateDoc(doc(db, "acciones_formativas", editingAccion.id), payload)
        .then(() => { toast({ title: "Acción Formativa Actualizada" }); setIsAccionModalOpen(false); setEditingAccion(null); })
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `acciones_formativas/${editingAccion.id}`, operation: 'update', requestResourceData: payload })));
    } else {
      addDoc(collection(db, "acciones_formativas"), { 
        ...payload, 
        totalModulos: 0,
        totalHoras: 0,
        createdAt: serverTimestamp() 
      })
        .then(() => { toast({ title: "Acción Formativa Creada" }); setIsAccionModalOpen(false); })
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'acciones_formativas', operation: 'create', requestResourceData: payload })));
    }
  };

  // --- Handlers Malla Curricular (Sub-Módulos) ---
  const handleSaveSubModulo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !viewingAction) return;
    const formData = new FormData(e.currentTarget);
    const moduloId = formData.get('moduloId') as string;

    // VALIDACIÓN: Evitar módulos duplicados en la misma acción formativa
    const isDuplicate = subModulos.some(sm => 
      sm.moduloId === moduloId && (!editingSubModulo || sm.id !== editingSubModulo.id)
    );

    if (isDuplicate) {
      toast({ 
        variant: "destructive", 
        title: "Módulo Duplicado", 
        description: "Este módulo ya está agregado a esta acción formativa." 
      });
      return;
    }

    const moduloOriginal = modulos.find(m => m.id === moduloId);
    
    const hTeoricas = parseInt(formData.get('horasTeoricas') as string) || 0;
    const hPracticas = parseInt(formData.get('horasPracticas') as string) || 0;

    const payload = {
      moduloId,
      nombreModulo: moduloOriginal?.nombre || 'Desconocido',
      horasTeoricas: hTeoricas,
      horasPracticas: hPracticas,
      totalHoras: hTeoricas + hPracticas,
      orden: parseInt(formData.get('orden') as string) || 0,
      updatedAt: serverTimestamp(),
    };

    const subColPath = `acciones_formativas/${viewingAction.id}/modulos`;

    if (editingSubModulo) {
      updateDoc(doc(db, subColPath, editingSubModulo.id), payload)
        .then(async () => { 
          await syncAccionTotals(viewingAction.id);
          toast({ title: "Módulo en malla actualizado" }); 
          setIsSubModuloModalOpen(false); 
          setEditingSubModulo(null); 
        })
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `${subColPath}/${editingSubModulo.id}`, operation: 'update', requestResourceData: payload })));
    } else {
      addDoc(collection(db, subColPath), payload)
        .then(async () => { 
          await syncAccionTotals(viewingAction.id);
          toast({ title: "Módulo añadido a la malla" }); 
          setIsSubModuloModalOpen(false); 
        })
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: subColPath, operation: 'create', requestResourceData: payload })));
    }
  };

  const deleteSubModulo = async (id: string) => {
    if (!db || !viewingAction) return;
    try {
      await deleteDoc(doc(db, `acciones_formativas/${viewingAction.id}/modulos`, id));
      await syncAccionTotals(viewingAction.id);
      toast({ title: "Módulo removido de la malla", variant: "destructive" });
    } catch (e) {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  // --- Helpers ---
  const getProgramaNombre = (id: string) => programas.find(p => p.id === id)?.nombre || "N/A";

  // --- Export Logic ---
  const handleExport = async (format: 'excel' | 'pdf' | 'word', type: 'acciones' | 'malla') => {
    toast({ title: "Generando Reporte", description: "Preparando archivo..." });
    
    const now = new Date().toLocaleDateString();
    const data = type === 'acciones' ? acciones : subModulos;
    const fileName = type === 'acciones' ? `Acciones_Formativas_${now}` : `Malla_${viewingAction?.nombre}_${now}`;

    try {
      if (format === 'excel') {
        const { utils, writeFile } = await import('xlsx');
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Reporte");
        writeFile(wb, `${fileName}.xlsx`);
      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const docPDF = new jsPDF();
        docPDF.text(type === 'acciones' ? "Listado de Acciones Formativas" : `Malla Curricular: ${viewingAction?.nombre}`, 14, 15);
        autoTable(docPDF, {
          startY: 20,
          head: [type === 'acciones' ? ['Código', 'Nombre', 'Programa', 'Estado'] : ['Módulo', 'T', 'P', 'Total', 'Orden']],
          body: data.map((item: any) => type === 'acciones' 
            ? [item.codigo, item.nombre, getProgramaNombre(item.programaId), item.estado]
            : [item.nombreModulo, item.horasTeoricas, item.horasPracticas, item.totalHoras, item.orden]
          ),
        });
        docPDF.save(`${fileName}.pdf`);
      }
      toast({ title: "Exportación Exitosa" });
    } catch (e) {
      toast({ title: "Error en exportación", variant: "destructive" });
    }
  };

  const handleOpenMalla = (accion: any) => {
    setViewingAction(accion);
    setIsMallaModalOpen(true);
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tighter">Configuración Académica</h1>
          <p className="text-muted-foreground font-medium">Gestión institucional de programas, acciones formativas y mallas curriculares.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="acciones" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-8">Acciones Formativas</TabsTrigger>
          <TabsTrigger value="modulos" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-8">Maestro de Módulos</TabsTrigger>
        </TabsList>

        <TabsContent value="acciones" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input placeholder="Buscar por código o nombre..." className="pl-10 h-11 rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleExport('pdf', 'acciones')} className="font-bold text-[10px] uppercase tracking-widest"><FileText className="mr-2 h-4 w-4" /> PDF</Button>
              <Button variant="outline" onClick={() => handleExport('excel', 'acciones')} className="font-bold text-[10px] uppercase tracking-widest"><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
              <Dialog open={isAccionModalOpen} onOpenChange={(open) => { setIsAccionModalOpen(open); if (!open) setEditingAccion(null); }}>
                <DialogTrigger asChild>
                  <Button className="font-bold uppercase tracking-widest text-[10px]"><PlusCircle className="mr-2 h-4 w-4" /> Nueva Acción</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black">{editingAccion ? 'Editar Acción Formativa' : 'Registrar Acción Formativa'}</DialogTitle>
                    <DialogDescription>Define un programa académico completo para ser ofertado en recintos.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSaveAccion} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Código del Curso *</Label><Input name="codigo" defaultValue={editingAccion?.codigo || ''} placeholder="Ej. AF-001" required /></div>
                      <div className="space-y-2">
                        <Label>Programa Institucional *</Label>
                        <Select name="programaId" defaultValue={editingAccion?.programaId || ''} required>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                          <SelectContent>
                            {programas.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2"><Label>Nombre de la Acción Formativa *</Label><Input name="nombre" defaultValue={editingAccion?.nombre || ''} placeholder="Ej. Inglés Técnico" required /></div>
                    <div className="space-y-2"><Label>Descripción</Label><Textarea name="descripcion" defaultValue={editingAccion?.descripcion || ''} placeholder="Breve resumen del alcance del curso..." /></div>
                    <div className="space-y-2">
                      <Label>Estado de Oferta</Label>
                      <Select name="estado" defaultValue={editingAccion?.estado || 'activo'}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="activo">Activo (Disponible)</SelectItem><SelectItem value="inactivo">Inactivo</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <DialogFooter className="pt-4">
                      <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                      <Button type="submit">{editingAccion ? 'Guardar Cambios' : 'Crear Acción'}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="border-border/50 shadow-xl overflow-hidden rounded-[1.5rem]">
            <CardContent className="p-0">
              {loadingAcciones ? (
                <div className="p-12 text-center text-muted-foreground animate-pulse font-bold">Consultando base de datos...</div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold py-5 pl-8 text-[10px] uppercase tracking-widest opacity-60">NO</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Código</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Acción Formativa</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Programa</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60 text-center">Cant. Módulos</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60 text-center">Total Horas</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60 text-center">Estado</TableHead>
                      <TableHead className="text-right font-bold py-5 pr-8 text-[10px] uppercase tracking-widest opacity-60">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acciones.filter(a => a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || a.codigo.toLowerCase().includes(searchTerm.toLowerCase())).map((a, index) => (
                      <TableRow key={a.id} className="hover:bg-muted/20 border-border/50 transition-colors">
                        <TableCell className="py-6 pl-8 font-bold text-xs text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="py-6 font-mono text-xs font-black text-primary">{a.codigo}</TableCell>
                        <TableCell className="py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{a.nombre}</span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{a.descripcion || 'Sin descripción'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <Badge variant="outline" className="font-bold text-[10px] px-3">{getProgramaNombre(a.programaId)}</Badge>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <Button variant="link" onClick={() => handleOpenMalla(a)} className="h-auto p-0 font-black text-primary underline decoration-primary/30">
                            {a.totalModulos || 0} módulos
                          </Button>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                            <Clock className="h-3 w-3 opacity-50" />
                            {a.totalHoras || 0} hrs
                          </div>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <Badge className={a.estado === 'activo' ? 'bg-success/15 text-success border-success/20' : 'bg-destructive/15 text-destructive border-destructive/20'}>
                            {a.estado === 'activo' ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6 pr-8 text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingAccion(a); setIsAccionModalOpen(true); }} className="rounded-full h-8 w-8"><Edit className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modulos" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input placeholder="Buscar materia..." className="pl-10 h-11 rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Dialog open={isModuloModalOpen} onOpenChange={(open) => { setIsModuloModalOpen(open); if (!open) setEditingModulo(null); }}>
              <DialogTrigger asChild>
                <Button className="font-bold uppercase tracking-widest text-[10px]"><PlusCircle className="mr-2 h-4 w-4" /> Nuevo Módulo</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black">{editingModulo ? 'Editar Módulo' : 'Nuevo Módulo Académico'}</DialogTitle>
                  <DialogDescription>Define una materia reutilizable en el catálogo.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveModulo} className="space-y-4 py-4">
                  <div className="space-y-2"><Label>Nombre del Módulo *</Label><Input name="nombre" defaultValue={editingModulo?.nombre || ''} placeholder="Ej. Fundamentos de Redes" required /></div>
                  <div className="space-y-2"><Label>Descripción</Label><Textarea name="descripcion" defaultValue={editingModulo?.descripcion || ''} placeholder="¿Qué se enseña en este módulo?" /></div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select name="estado" defaultValue={editingModulo?.estado || 'activo'}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="activo">Activo</SelectItem><SelectItem value="inactivo">Inactivo</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <DialogFooter className="pt-4">
                    <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                    <Button type="submit">Guardar Registro</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-border/50 shadow-xl overflow-hidden rounded-[1.5rem]">
            <CardContent className="p-0">
              {loadingModulos ? (
                <div className="p-12 text-center text-muted-foreground animate-pulse font-bold">Consultando registros...</div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold py-5 pl-8 text-[10px] uppercase tracking-widest opacity-60">NO</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Módulo / Materia</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Descripción</TableHead>
                      <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60 text-center">Estado</TableHead>
                      <TableHead className="text-right font-bold py-5 pr-8 text-[10px] uppercase tracking-widest opacity-60">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modulos.filter(m => m.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((m, index) => (
                      <TableRow key={m.id} className="hover:bg-muted/20 border-border/50">
                        <TableCell className="py-6 pl-8 font-bold text-xs text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="py-6"><span className="font-bold text-sm">{m.nombre}</span></TableCell>
                        <TableCell className="py-6 text-xs text-muted-foreground italic truncate max-w-[300px]">{m.descripcion || 'Sin descripción'}</TableCell>
                        <TableCell className="py-6 text-center">
                          <Badge className={m.estado === 'activo' ? 'bg-success/15 text-success border-success/20' : 'bg-destructive/15 text-destructive border-destructive/20'}>
                            {m.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6 pr-8 text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingModulo(m); setIsModuloModalOpen(true); }} className="rounded-full h-8 w-8"><Edit className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isMallaModalOpen} onOpenChange={(open) => { setIsMallaModalOpen(open); if (!open) setViewingAction(null); }}>
        <DialogContent className="sm:max-w-[900px] rounded-[1.5rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-muted/30 border-b">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black font-headline tracking-tighter">Malla Curricular</DialogTitle>
                <DialogDescription className="font-medium">
                  Gestionando módulos para: <span className="text-primary font-bold">{viewingAction?.nombre}</span>
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('excel', 'malla')} className="font-bold uppercase tracking-widest text-[10px] h-8"><FileSpreadsheet className="mr-2 h-3.5 w-3.5" /> Excel</Button>
                <Button onClick={() => setIsSubModuloModalOpen(true)} className="font-bold uppercase tracking-widest text-[10px] h-8"><PlusCircle className="mr-2 h-3.5 w-3.5" /> Agregar Módulo</Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-0 max-h-[60vh] overflow-y-auto">
            {loadingSubModulos ? (
              <div className="p-12 text-center animate-pulse"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="font-bold py-4 pl-8 text-[10px] uppercase tracking-widest opacity-60">NO</TableHead>
                    <TableHead className="font-bold py-4 text-[10px] uppercase tracking-widest opacity-60">Módulo / Materia</TableHead>
                    <TableHead className="font-bold py-4 text-[10px] uppercase tracking-widest opacity-60">H. Teóricas</TableHead>
                    <TableHead className="font-bold py-4 text-[10px] uppercase tracking-widest opacity-60">H. Prácticas</TableHead>
                    <TableHead className="font-bold py-4 text-[10px] uppercase tracking-widest opacity-60">Total Horas</TableHead>
                    <TableHead className="font-bold py-4 text-[10px] uppercase tracking-widest opacity-60 text-center">Orden</TableHead>
                    <TableHead className="text-right font-bold py-4 pr-8 text-[10px] uppercase tracking-widest opacity-60">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subModulos.map((sm, index) => (
                    <TableRow key={sm.id} className="hover:bg-muted/20 border-border/50">
                      <TableCell className="py-4 pl-8 font-bold text-xs text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="py-4"><span className="font-bold text-sm">{sm.nombreModulo}</span></TableCell>
                      <TableCell className="py-4"><Badge variant="outline" className="font-mono text-[10px]">{sm.horasTeoricas} hrs</Badge></TableCell>
                      <TableCell className="py-4"><Badge variant="outline" className="font-mono text-[10px]">{sm.horasPracticas} hrs</Badge></TableCell>
                      <TableCell className="py-4"><Badge className="bg-primary/10 text-primary border-primary/20 font-bold">{sm.totalHoras} hrs</Badge></TableCell>
                      <TableCell className="py-4 text-center"><Badge variant="secondary" className="rounded-md h-6 w-6 p-0 flex items-center justify-center mx-auto">{sm.orden}</Badge></TableCell>
                      <TableCell className="py-4 pr-8 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingSubModulo(sm); setIsSubModuloModalOpen(true); }} className="rounded-full h-8 w-8"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteSubModulo(sm.id)} className="rounded-full h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {subModulos.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground italic font-medium">Esta acción formativa no tiene módulos asignados.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter className="p-6 bg-muted/30 border-t">
            <DialogClose asChild><Button variant="outline" className="font-bold uppercase tracking-widest text-[10px] px-8">Cerrar Gestión</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubModuloModalOpen} onOpenChange={(open) => { setIsSubModuloModalOpen(open); if (!open) setEditingSubModulo(null); }}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{editingSubModulo ? 'Editar Módulo en Malla' : 'Añadir Módulo a Programa'}</DialogTitle>
            <DialogDescription>Selecciona un módulo del catálogo maestro y asigna su carga horaria.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveSubModulo} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Seleccionar Módulo *</Label>
              <Select name="moduloId" defaultValue={editingSubModulo?.moduloId || ''} required>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Buscar materia..." /></SelectTrigger>
                <SelectContent>
                  {modulos.filter(m => m.estado === 'activo').map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Horas Teóricas</Label><Input name="horasTeoricas" type="number" defaultValue={editingSubModulo?.horasTeoricas || 0} min="0" /></div>
              <div className="space-y-2"><Label>Horas Prácticas</Label><Input name="horasPracticas" type="number" defaultValue={editingSubModulo?.horasPracticas || 0} min="0" /></div>
            </div>
            <div className="space-y-2"><Label>Orden Secuencial</Label><Input name="orden" type="number" defaultValue={editingSubModulo?.orden || subModulos.length + 1} required /></div>
            <DialogFooter className="pt-4">
              <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
              <Button type="submit">{editingSubModulo ? 'Actualizar Módulo' : 'Añadir a Malla'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
}
