
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
  FileDown,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  File,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Firebase imports
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, where, getDocs } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const INSTITUTIONAL_LOGO_URL = "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/464333115_966007555565670_4128720996564005167_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=EMvGNmceS2MQ7kNvwEsOLIQ&_nc_oc=Adn7yCmL1L0d_q_T3RmKPjlNzNjoymkuBFubAEUATP6uhRXx1xO45dP6A-fSHuRry6k&_nc_zt=23&_nc_ht=scontent.fhex4-1.fna&_nc_gid=k4LHuS2fyZk0hqMaMppmGA&_nc_ss=8&oh=00_AfwReuaU0s2hGLkzazE0TipD7oV3F_Kh__qive_uh_tnJQ&oe=69ACD868";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function DocentesPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const docentesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "docentes"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: docentesRaw, loading } = useCollection(docentesQuery);
  const docentes = useMemo(() => docentesRaw || [], [docentesRaw]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    correo: "",
    especialidad: "",
    estado: "Activo",
  });

  const filteredDocentes = useMemo(() => {
    return docentes.filter((d) => {
      const matchesSearch = 
        d.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.cedula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.especialidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.correo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = statusFilter === "Todos" || d.estado === statusFilter;

      return matchesSearch && matchesEstado;
    });
  }, [docentes, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);
  
  const paginatedDocentes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDocentes.slice(start, start + itemsPerPage);
  }, [filteredDocentes, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, statusFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const payload = {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const collectionRef = collection(db, "docentes");
    addDoc(collectionRef, payload)
      .then(() => {
        setIsCreateDialogOpen(false);
        resetForm();
        toast({ title: "Docente Registrado" });
      })
      .catch((err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: collectionRef.path, operation: 'create', requestResourceData: payload })));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedDocente) return;

    const payload = {
      ...formData,
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, "docentes", selectedDocente.id);
    updateDoc(docRef, payload)
      .then(() => {
        setIsEditDialogOpen(false);
        resetForm();
        toast({ title: "Docente Actualizado" });
      })
      .catch((err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update', requestResourceData: payload })));
  };

  const toggleStatus = async (docente: any) => {
    if (!db) return;
    const nuevoEstado = docente.estado === "Activo" ? "Inactivo" : "Activo";
    
    if (nuevoEstado === "Inactivo") {
        const sectionsQuery = query(
            collection(db, "secciones"), 
            where("docenteId", "==", docente.id)
        );
        const snapshot = await getDocs(sectionsQuery);
        const activeSections = snapshot.docs.filter(s => s.data().estado !== "Finalizada");
        
        if (activeSections.length > 0) {
            toast({
                variant: "destructive",
                title: "Bloqueo de Desactivación",
                description: "No es posible desactivar este docente porque está asignado a una o más secciones. Debe removerlo o finalizar esas secciones antes de cambiar su estado."
            });
            return;
        }
    }

    const docRef = doc(db, "docentes", docente.id);
    updateDoc(docRef, { estado: nuevoEstado, updatedAt: serverTimestamp() })
      .then(() => toast({ title: `Estado cambiado a ${nuevoEstado}` }))
      .catch((err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update', requestResourceData: { estado: nuevoEstado } })));
  };

  const resetForm = () => {
    setFormData({ nombre: "", apellido: "", cedula: "", telefono: "", correo: "", especialidad: "", estado: "Activo" });
    setSelectedDocente(null);
  };

  const openEdit = (docente: any) => {
    setSelectedDocente(docente);
    setFormData({
      nombre: docente.nombre || "",
      apellido: docente.apellido || "",
      cedula: docente.cedula || "",
      telefono: docente.telefono || "",
      correo: docente.correo || "",
      especialidad: docente.especialidad || "",
      estado: docente.estado || "Activo",
    });
    setIsEditDialogOpen(true);
  };

  const openView = (docente: any) => {
    setSelectedDocente(docente);
    setIsViewDialogOpen(true);
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'word') => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const fullDate = `Fecha: ${dateStr}`;
    const fileName = `Listado_Docentes_${now.toISOString().split('T')[0]}`;

    const dataToExport = filteredDocentes.map((d, index) => ({
      "No.": index + 1,
      "Nombre": d.nombre,
      "Apellido": d.apellido,
      "Cédula": d.cedula,
      "Teléfono": d.telefono,
      "Correo": d.correo,
      "Especialidad": d.especialidad,
      "Estado": d.estado,
    }));

    const exportHeaders = ["No.", "Nombre", "Apellido", "Cédula", "Teléfono", "Correo", "Especialidad", "Estado"];

    toast({ title: "Generando reporte", description: `Exportando a ${format.toUpperCase()}...` });

    try {
      if (format === 'excel') {
        const { utils, writeFile } = await import('xlsx');
        const worksheet = utils.json_to_sheet(dataToExport);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Docentes");
        writeFile(workbook, `${fileName}.xlsx`);
      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF('landscape');
        doc.setFontSize(14).text("DIGEV - LISTADO OFICIAL DE DOCENTES", 14, 20);
        doc.setFontSize(10).text(fullDate, 14, 26);
        autoTable(doc, {
          startY: 32,
          head: [exportHeaders],
          body: dataToExport.map(row => Object.values(row)),
          headStyles: { fillColor: [38, 101, 140] },
        });
        doc.save(`${fileName}.pdf`);
      } else if (format === 'word') {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun } = await import('docx');
        const { saveAs } = await import('file-saver');
        const docWord = new Document({
          sections: [{
            children: [
              new Paragraph({ children: [new TextRun({ text: "DIGEV - LISTADO OFICIAL DE DOCENTES", bold: true, size: 28 })] }),
              new Paragraph({ children: [new TextRun({ text: fullDate, size: 20 })], spacing: { after: 200 } }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: exportHeaders.map(h => new TableCell({ children: [new Paragraph({ text: h, bold: true })] }))
                  }),
                  ...dataToExport.map(row => new TableRow({
                    children: Object.values(row).map(v => new TableCell({ children: [new Paragraph({ text: String(v) })] }))
                  }))
                ]
              })
            ]
          }]
        });
        const blob = await Packer.toBlob(docWord);
        saveAs(blob, `${fileName}.docx`);
      }
      toast({ title: "Exportación completada" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error al exportar" });
    }
  };

  return (
    <motion.div className="space-y-8 pb-10" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-black font-headline tracking-tighter">Gestión de Docentes</h1>
          </div>
          <p className="text-muted-foreground font-medium text-sm">Registro institucional de instructores y especialistas.</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-9">
                <FileDown className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 p-2 shadow-xl">
              <DropdownMenuItem onClick={() => handleExport('word')} className="cursor-pointer">Word (.docx)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">PDF (.pdf)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">Excel (.xlsx)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetForm} className="font-bold shadow-lg shadow-primary/20 uppercase tracking-wider text-[10px] h-9">
                <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Docente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-[1.5rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Registrar Docente</DialogTitle>
                <DialogDescription>Añada un nuevo instructor al sistema.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Nombre</Label><Input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Apellido</Label><Input required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Cédula</Label><Input required value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Teléfono</Label><Input required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
                  <div className="space-y-2 col-span-2"><Label>Correo Electrónico</Label><Input type="email" required value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} /></div>
                  <div className="space-y-2 col-span-2"><Label>Especialidad / Profesión</Label><Input required value={formData.especialidad} onChange={e => setFormData({...formData, especialidad: e.target.value})} /></div>
                </div>
                <DialogFooter className="pt-4"><DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose><Button type="submit">Guardar</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre, apellido, cédula, especialidad..." 
            className="pl-12 h-12 bg-card/50 border-border/50 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos los estados</SelectItem>
            <SelectItem value="Activo">Activos</SelectItem>
            <SelectItem value="Inactivo">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/50 overflow-hidden shadow-xl bg-card/60 backdrop-blur-sm rounded-[1.5rem]">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-muted-foreground font-bold animate-pulse">Consultando Firestore...</div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold py-5 pl-8 text-[10px] uppercase tracking-widest opacity-60">No.</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Nombre</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Apellido</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Cédula</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Teléfono</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Correo</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Especialidad</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60 text-center">Estado</TableHead>
                    <TableHead className="font-bold py-5 pr-8 text-[10px] uppercase tracking-widest opacity-60 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDocentes.map((d, index) => (
                    <TableRow key={d.id} className="hover:bg-muted/20 border-border/50 transition-colors">
                      <TableCell className="py-6 pl-8 font-bold text-xs text-muted-foreground">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell className="py-6 font-bold text-xs">{d.nombre}</TableCell>
                      <TableCell className="py-6 font-bold text-xs">{d.apellido}</TableCell>
                      <TableCell className="py-6 font-mono text-xs opacity-80">{d.cedula}</TableCell>
                      <TableCell className="py-6 text-xs">{d.telefono}</TableCell>
                      <TableCell className="py-6 text-xs opacity-70">{d.correo}</TableCell>
                      <TableCell className="py-6 font-medium text-xs tracking-tight">{d.especialidad}</TableCell>
                      <TableCell className="py-6 text-center">
                        <Badge className={`font-bold px-3 ${d.estado === 'Activo' ? 'bg-success/15 text-success border-success/20' : 'bg-destructive/15 text-destructive border-destructive/20'}`}>
                          {d.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6 pr-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl p-2 shadow-2xl">
                             <DropdownMenuLabel className="text-[9px] font-bold uppercase opacity-50 px-2">Acciones</DropdownMenuLabel>
                             <DropdownMenuItem onClick={() => openView(d)} className="cursor-pointer text-xs"><Eye className="h-4 w-4 mr-2" /> Ver Detalles</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => openEdit(d)} className="cursor-pointer text-xs"><Edit className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={() => toggleStatus(d)} className="cursor-pointer text-xs">
                                {d.estado === 'Activo' ? <><XCircle className="h-4 w-4 mr-2 text-destructive" /> Desactivar</> : <><CheckCircle2 className="h-4 w-4 mr-2 text-success" /> Activar</>}
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
          <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Mostrando {paginatedDocentes.length} de {filteredDocentes.length}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Ver:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
                  <SelectTrigger className="h-7 w-16 rounded-lg text-[10px] font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="50">50</SelectItem><SelectItem value="100">100</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <Pagination className="w-auto mx-0">
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} /></PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page} className="hidden sm:block">
                        <PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); setCurrentPage(page); }} className="text-xs h-8 w-8">{page}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} /></PaginationItem>
                </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </motion.div>

      {/* Ver Detalles */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[1.5rem]">
          <DialogHeader><DialogTitle className="text-2xl font-black">Expediente de Docente</DialogTitle></DialogHeader>
          {selectedDocente && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-border/50">
                 <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold">{selectedDocente.nombre} {selectedDocente.apellido}</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{selectedDocente.especialidad}</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1"><Label className="text-[10px] opacity-60">CÉDULA</Label><p className="font-bold">{selectedDocente.cedula}</p></div>
                <div className="space-y-1"><Label className="text-[10px] opacity-60">TELÉFONO</Label><p className="font-bold">{selectedDocente.telefono}</p></div>
                <div className="space-y-1 col-span-2"><Label className="text-[10px] opacity-60">CORREO ELECTRÓNICO</Label><p className="font-bold">{selectedDocente.correo}</p></div>
                <div className="space-y-1"><Label className="text-[10px] opacity-60">ESTADO</Label><p className="font-bold uppercase">{selectedDocente.estado}</p></div>
                <div className="space-y-1"><Label className="text-[10px] opacity-60">FECHA REGISTRO</Label><p className="font-bold">{selectedDocente.createdAt?.toDate ? selectedDocente.createdAt.toDate().toLocaleDateString() : "Reciente"}</p></div>
              </div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline">Cerrar</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[1.5rem]">
          <DialogHeader><DialogTitle className="text-2xl font-black">Editar Docente</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nombre</Label><Input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
              <div className="space-y-2"><Label>Apellido</Label><Input required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} /></div>
              <div className="space-y-2"><Label>Cédula</Label><Input required value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} /></div>
              <div className="space-y-2"><Label>Teléfono</Label><Input required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
              <div className="space-y-2 col-span-2"><Label>Correo Electrónico</Label><Input type="email" required value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} /></div>
              <div className="space-y-2 col-span-2"><Label>Especialidad / Profesión</Label><Input required value={formData.especialidad} onChange={e => setFormData({...formData, especialidad: e.target.value})} /></div>
            </div>
            <DialogFooter className="pt-4"><DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose><Button type="submit">Actualizar Datos</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
