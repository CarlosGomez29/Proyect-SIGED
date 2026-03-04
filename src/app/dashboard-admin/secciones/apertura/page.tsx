
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
  FileDown,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  BookOpen,
  FileText,
  File,
  FileSpreadsheet,
  Settings2,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
import { collection, updateDoc, doc, serverTimestamp, query, orderBy, runTransaction } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const INSTITUTIONAL_LOGO_URL = "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/464333115_966007555565670_4128720996564005167_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=EMvGNmceS2MQ7kNvwEsOLIQ&_nc_oc=Adn7yCmL1L0d_q_T3RmKPjlNzNjoymkuBFubAEUATP6uhRXx1xO45dP6A-fSHuRry6k&_nc_zt=23&_nc_ht=scontent.fhex4-1.fna&_nc_gid=k4LHuS2fyZk0hqMaMppmGA&_nc_ss=8&oh=00_AfwReuaU0s2hGLkzazE0TipD7oV3F_Kh__qive_uh_tnJQ&oe=69ACD868";

const PERIODOS_MAESTROS = [
  { id: "2024-2", nombre: "2024-2", inicio: "2024-06-01", fin: "2024-08-31" },
  { id: "2024-S2", nombre: "2024-S2", inicio: "2024-07-01", fin: "2024-12-31" },
];

const CURSOS_MAESTROS = [
  "Seguridad de la Carga Aérea",
  "Mercancías Peligrosas",
  "AVSEC para Tripulación",
  "Manejo de Crisis",
  "Seguridad Aeroportuaria",
  "Inteligencia Emocional",
  "Ciberseguridad en Aviación",
  "Primeros Auxilios Aeroportuarios",
  "Protocolo y Etiqueta",
  "Gestión de Carga Peligrosa",
  "Inglés Técnico Aeronáutico",
  "Psicología del Pasajero",
];

const DOCENTES_MAESTROS = [
  "Juan Pérez",
  "María García",
  "Carlos López",
  "Ana Martínez",
  "Luis Hernández",
];

const DIAS_SEMANA = [
  { id: "lun", label: "Lunes" },
  { id: "mar", label: "Martes" },
  { id: "mie", label: "Miércoles" },
  { id: "jue", label: "Jueves" },
  { id: "vie", label: "Viernes" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function AperturaSeccionesPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const seccionesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "secciones"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: seccionesRaw, loading } = useCollection(seccionesQuery);
  const secciones = useMemo(() => seccionesRaw || [], [seccionesRaw]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSeccion, setSelectedSeccion] = useState<any>(null);
  
  const [visibleColumns, setVisibleColumns] = useState({
    codigoSeccion: true,
    periodo: true,
    curso: true,
    programa: true,
    docente: true,
    horario: true,
    ocupacion: true,
    estado: true,
  });

  const [filterConfig, setFilterConfig] = useState({
    estado: "Todos",
    programa: "Todos",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    periodoId: "",
    curso: "",
    docente: "",
    capacidad: "40",
    dias: [] as string[],
    horaInicio: "08:00",
    horaFin: "12:00",
    estado: "Abierta",
  });

  const formatTime12h = (timeStr: string) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const formattedHour = h12 < 10 ? `0${h12}` : h12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const filteredSecciones = useMemo(() => {
    return secciones.filter((s) => {
      const matchesSearch = 
        s.codigoSeccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.curso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.docente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.programa?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = filterConfig.estado === "Todos" || s.estado === filterConfig.estado;
      const matchesPrograma = filterConfig.programa === "Todos" || s.programa === filterConfig.programa;

      return matchesSearch && matchesEstado && matchesPrograma;
    });
  }, [secciones, searchTerm, filterConfig]);

  const totalPages = Math.ceil(filteredSecciones.length / itemsPerPage);
  
  const paginatedSecciones = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSecciones.slice(start, start + itemsPerPage);
  }, [filteredSecciones, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, filterConfig]);

  const calculateOcupacion = (inscritos: number = 0, capacidad: number = 40) => {
    return Math.round((inscritos / capacidad) * 100);
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'word') => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: true });
    const fullGenerationDate = `Fecha de generación: ${dateStr} – ${timeStr.toUpperCase()}`;
    
    const fileName = `Secciones_${now.toISOString().split('T')[0]}`;
    const totalRegistros = filteredSecciones.length;

    const dataToExport = filteredSecciones.map(s => {
      const row: any = {};
      if (visibleColumns.codigoSeccion) row["Código de Sección"] = s.codigoSeccion;
      if (visibleColumns.periodo) row["Período"] = s.periodo;
      if (visibleColumns.curso) row["Curso"] = s.curso;
      if (visibleColumns.programa) row["Programa"] = s.programa;
      if (visibleColumns.docente) row["Docente"] = s.docente;
      if (visibleColumns.horario) row["Horario"] = s.horario;
      if (visibleColumns.ocupacion) row["Ocupación"] = `${s.inscritos || 0} / ${s.capacidad || 40} (${calculateOcupacion(s.inscritos, s.capacidad)}%)`;
      if (visibleColumns.estado) row["Estado"] = s.estado;
      return row;
    });

    const exportHeaders = Object.keys(dataToExport[0] || {});

    toast({ title: "Generando reporte institucional", description: `Exportando ${totalRegistros} registros a ${format.toUpperCase()}...` });

    try {
      if (format === 'excel') {
        const { utils, writeFile } = await import('xlsx');
        const headerRows = [
          ["REPÚBLICA DOMINICANA"],
          ["Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N."],
          ["SANTO DOMINGO, ESTE."],
          ["“TODO POR LA PATRIA”"],
          [""],
          [`LISTADO DE SECCIONES`],
          [fullGenerationDate],
          [""]
        ];
        const worksheet = utils.aoa_to_sheet(headerRows);
        utils.sheet_add_json(worksheet, dataToExport, { origin: "A9" });
        const lastRowIndex = 9 + dataToExport.length;
        utils.sheet_add_aoa(worksheet, [[""], [`Total de Secciones Exportadas: ${totalRegistros}`]], { origin: `A${lastRowIndex + 1}` });
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Secciones");
        writeFile(workbook, `${fileName}.xlsx`);
      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF('landscape');
        const centerX = doc.internal.pageSize.getWidth() / 2;
        try { doc.addImage(INSTITUTIONAL_LOGO_URL, 'JPEG', centerX - 12.5, 10, 25, 25); } catch (e) {}
        doc.setFont("helvetica", "bold").setFontSize(14).text("REPÚBLICA DOMINICANA", centerX, 42, { align: "center" });
        doc.setFontSize(10).setFont("helvetica", "normal").text("Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N.", centerX, 48, { align: "center" });
        doc.text("SANTO DOMINGO, ESTE.", centerX, 53, { align: "center" });
        doc.setFont("helvetica", "italic").text("“TODO POR LA PATRIA”", centerX, 58, { align: "center" });
        doc.line(20, 62, doc.internal.pageSize.getWidth() - 20, 62);
        doc.setFont("helvetica", "bold").setFontSize(12).text(`LISTADO DE SECCIONES`, 14, 72);
        doc.setFont("helvetica", "normal").setFontSize(9).text(fullGenerationDate, 14, 78);
        autoTable(doc, {
          startY: 85,
          head: [exportHeaders],
          body: dataToExport.map(row => Object.values(row)),
          headStyles: { fillColor: [38, 101, 140], textColor: [255, 255, 255] },
          styles: { fontSize: 8 },
        });
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFont("helvetica", "bold").text(`Total de Secciones Exportadas: ${totalRegistros}`, 14, finalY);
        doc.save(`${fileName}.pdf`);
      } else if (format === 'word') {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, ImageRun } = await import('docx');
        const { saveAs } = await import('file-saver');
        const response = await fetch(INSTITUTIONAL_LOGO_URL);
        const buffer = await response.arrayBuffer();
        const docWord = new Document({
          sections: [{
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: buffer, transformation: { width: 60, height: 60 } })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "REPÚBLICA DOMINICANA", bold: true, size: 28 })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N.", size: 20 })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "“TODO POR LA PATRIA”", italics: true, size: 20 })], spacing: { after: 200 } }),
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: fullGenerationDate, size: 18 })], spacing: { after: 300 } }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: exportHeaders.map(h => new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })],
                      shading: { fill: "26658C" },
                    }))
                  }),
                  ...dataToExport.map(row => new TableRow({
                    children: Object.values(row).map(v => new TableCell({ children: [new Paragraph({ text: String(v), size: 16 })] }))
                  }))
                ]
              }),
              new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: `Total de Secciones Exportadas: ${totalRegistros}`, bold: true, size: 20 })] })
            ]
          }]
        });
        const blob = await Packer.toBlob(docWord);
        saveAs(blob, `${fileName}.docx`);
      }
      toast({ title: "Exportación exitosa" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error de exportación" });
    }
  };

  const handleCreateSeccion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    if (!formData.periodoId || !formData.curso || !formData.docente || formData.dias.length === 0) {
      toast({ variant: "destructive", title: "Campos incompletos" });
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "metadata", "counters");
        const counterSnap = await transaction.get(counterRef);
        
        let newCount = 1;
        if (counterSnap.exists()) {
          newCount = (counterSnap.data().seccionesCount || 0) + 1;
        }
        
        const codigoSeccion = `SEC-${newCount.toString().padStart(4, "0")}`;
        const diasStr = formData.dias.map(d => DIAS_SEMANA.find(ds => ds.id === d)?.label.substring(0, 3)).join('-');
        
        const newSeccionData = {
          codigoSeccion,
          periodo: formData.periodoId,
          curso: formData.curso,
          programa: "DIGEP Directo",
          docente: formData.docente,
          horario: `${diasStr} ${formatTime12h(formData.horaInicio)} - ${formatTime12h(formData.horaFin)}`,
          dias: formData.dias,
          horaInicio: formData.horaInicio,
          horaFin: formData.horaFin,
          estado: formData.estado,
          inscritos: 0,
          capacidad: parseInt(formData.capacidad),
          fechaInicio: "2024-06-01",
          fechaFin: "2024-08-31",
          createdAt: serverTimestamp(),
        };

        const newDocRef = doc(collection(db, "secciones"));
        transaction.set(newDocRef, newSeccionData);
        transaction.set(counterRef, { seccionesCount: newCount }, { merge: true });
      });

      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: "Sección creada exitosamente" });
    } catch (err) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'secciones',
        operation: 'create',
      }));
    }
  };

  const handleUpdateSeccion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedSeccion) return;

    const diasStr = formData.dias.map(d => DIAS_SEMANA.find(ds => ds.id === d)?.label.substring(0, 3)).join('-');
    const updateData = {
      docente: formData.docente,
      capacidad: parseInt(formData.capacidad),
      dias: formData.dias,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      horario: `${diasStr} ${formatTime12h(formData.horaInicio)} - ${formatTime12h(formData.horaFin)}`,
    };

    updateDoc(doc(db, "secciones", selectedSeccion.id), updateData)
      .then(() => {
        setIsEditDialogOpen(false);
        resetForm();
        toast({ title: "Sección actualizada exitosamente" });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: `secciones/${selectedSeccion.id}`,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const resetForm = () => {
    setFormData({ periodoId: "", curso: "", docente: "", capacidad: "40", dias: [], horaInicio: "08:00", horaFin: "12:00", estado: "Abierta" });
    setSelectedSeccion(null);
  };

  const openEditSection = (seccion: any) => {
    setSelectedSeccion(seccion);
    setFormData({
      periodoId: seccion.periodo || "",
      curso: seccion.curso || "",
      docente: seccion.docente || "",
      capacidad: seccion.capacidad?.toString() || "40",
      dias: seccion.dias || [],
      horaInicio: seccion.horaInicio || "08:00",
      horaFin: seccion.horaFin || "12:00",
      estado: seccion.estado || "Abierta",
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Abierta": return <Badge className="bg-success/15 text-success border-success/20 font-bold px-3">Abierta</Badge>;
      case "Cerrada": return <Badge className="bg-destructive/15 text-destructive border-destructive/20 font-bold px-3">Cerrada</Badge>;
      case "Finalizada": return <Badge className="bg-muted text-muted-foreground border-muted-foreground/20 font-bold px-3">Finalizada</Badge>;
      default: return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-black font-headline tracking-tighter">Apertura de Secciones</h1>
          </div>
          <p className="text-muted-foreground font-medium text-sm">Configuración y Estructura Académica (Real-time Firestore)</p>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-9">
                <Filter className="mr-2 h-4 w-4" /> Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 rounded-2xl shadow-2xl border-border/50 bg-card/95 backdrop-blur-xl" align="end">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-widest text-primary">Configuración de Vista</h4>
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase opacity-60">Visibilidad de Columnas</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(visibleColumns).map(([key, isVisible]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`col-${key}`} checked={isVisible} onCheckedChange={(checked) => setVisibleColumns({...visibleColumns, [key]: !!checked})} />
                        <Label htmlFor={`col-${key}`} className="text-[11px] font-medium capitalize">{key === 'codigoSeccion' ? 'Código de Sección' : key}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase opacity-60">Filtros de Datos</p>
                  <div className="space-y-1.5">
                    <Label className="text-[10px]">Estado</Label>
                    <Select value={filterConfig.estado} onValueChange={(val) => setFilterConfig({...filterConfig, estado: val})}>
                      <SelectTrigger className="h-8 text-xs rounded-lg"><SelectValue placeholder="Todos" /></SelectTrigger>
                      <SelectContent><SelectItem value="Todos">Todos</SelectItem><SelectItem value="Abierta">Abierta</SelectItem><SelectItem value="Cerrada">Cerrada</SelectItem><SelectItem value="Finalizada">Finalizada</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-9">
                <FileDown className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 p-2 shadow-xl">
              <DropdownMenuItem onClick={() => handleExport('word')} className="rounded-lg flex items-center gap-2 py-2 cursor-pointer"><FileText className="h-4 w-4 opacity-70" /><span className="font-medium text-sm">Word (.docx)</span></DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="rounded-lg flex items-center gap-2 py-2 cursor-pointer"><File className="h-4 w-4 opacity-70" /><span className="font-medium text-sm">PDF (.pdf)</span></DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')} className="rounded-lg flex items-center gap-2 py-2 cursor-pointer"><FileSpreadsheet className="h-4 w-4 opacity-70" /><span className="font-medium text-sm">Excel (.xlsx)</span></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetForm} className="font-bold shadow-lg shadow-primary/20 uppercase tracking-wider text-[10px] h-9">
                <PlusCircle className="mr-2 h-4 w-4" /> Nueva Sección
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-[1.5rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">Apertura de Sección</DialogTitle>
                <DialogDescription>Define la estructura de la nueva oferta académica.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSeccion} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label className="text-xs font-bold uppercase opacity-60">Período Académico</Label><Select onValueChange={(val) => setFormData({ ...formData, periodoId: val })}><SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Seleccionar período..." /></SelectTrigger><SelectContent>{PERIODOS_MAESTROS.map((p) => (<SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>))}</SelectContent></Select></div>
                  <div className="space-y-2"><Label className="text-xs font-bold uppercase opacity-60">Curso</Label><Select onValueChange={(val) => setFormData({ ...formData, curso: val })}><SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Seleccionar curso..." /></SelectTrigger><SelectContent>{CURSOS_MAESTROS.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select></div>
                  <div className="space-y-2 md:col-span-2"><Label className="text-xs font-bold uppercase opacity-60">Docente Asignado</Label><Select onValueChange={(val) => setFormData({ ...formData, docente: val })}><SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Buscar docente..." /></SelectTrigger><SelectContent>{DOCENTES_MAESTROS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select></div>
                  <div className="space-y-2"><Label className="text-xs font-bold uppercase opacity-60">Capacidad Máxima</Label><Input type="number" value={formData.capacidad} onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })} /></div>
                  <div className="space-y-3"><Label className="text-xs font-bold uppercase opacity-60">Días de Clase</Label><div className="flex flex-wrap gap-2">{DIAS_SEMANA.map((dia) => (<div key={dia.id} className="flex items-center space-x-1"><Checkbox id={dia.id} checked={formData.dias.includes(dia.id)} onCheckedChange={(checked) => { const newDias = checked ? [...formData.dias, dia.id] : formData.dias.filter(d => d !== dia.id); setFormData({ ...formData, dias: newDias }); }} /><Label htmlFor={dia.id} className="text-[10px]">{dia.label}</Label></div>))}</div></div>
                  <div className="space-y-2 md:col-span-2"><Label className="text-xs font-bold uppercase opacity-60">Horario</Label><div className="flex gap-4"><Input type="time" value={formData.horaInicio} onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })} /><Input type="time" value={formData.horaFin} onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })} /></div></div>
                </div>
                <DialogFooter className="pt-4"><DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose><Button type="submit">Abrir Sección</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Buscar por Código, Curso, Docente o Programa..." className="pl-12 h-14 bg-card/50 border-border/50 rounded-2xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/50 overflow-hidden shadow-xl bg-card/60 backdrop-blur-sm rounded-[1.5rem]">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-muted-foreground font-bold animate-pulse">Cargando secciones desde Firestore...</div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    {visibleColumns.codigoSeccion && <TableHead className="font-bold py-5 pl-8 text-xs uppercase tracking-widest opacity-60 text-primary">Código de Sección</TableHead>}
                    {visibleColumns.periodo && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Período</TableHead>}
                    {visibleColumns.curso && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Curso</TableHead>}
                    {visibleColumns.programa && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Programa</TableHead>}
                    {visibleColumns.docente && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Docente</TableHead>}
                    {visibleColumns.horario && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Horario</TableHead>}
                    {visibleColumns.ocupacion && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Ocupación</TableHead>}
                    {visibleColumns.estado && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60 text-center">Estatus</TableHead>}
                    <TableHead className="font-bold py-5 pr-8 text-xs uppercase tracking-widest opacity-60 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSecciones.map((seccion) => {
                    const ocupacionPorcentaje = calculateOcupacion(seccion.inscritos, seccion.capacidad);
                    return (
                      <TableRow key={seccion.id} className="hover:bg-muted/20 border-border/50 transition-colors">
                        {visibleColumns.codigoSeccion && <TableCell className="py-6 pl-8 font-mono text-xs font-black text-primary">{seccion.codigoSeccion}</TableCell>}
                        {visibleColumns.periodo && <TableCell className="py-6 font-semibold text-xs tracking-tight">{seccion.periodo}</TableCell>}
                        {visibleColumns.curso && <TableCell className="py-6 font-bold text-foreground text-xs leading-relaxed">{seccion.curso}</TableCell>}
                        {visibleColumns.programa && <TableCell className="py-6 text-xs text-muted-foreground font-medium">{seccion.programa}</TableCell>}
                        {visibleColumns.docente && <TableCell className="py-6 font-bold text-xs">{seccion.docente}</TableCell>}
                        {visibleColumns.horario && <TableCell className="py-6 text-[10px] text-muted-foreground leading-relaxed">{seccion.horario}</TableCell>}
                        {visibleColumns.ocupacion && (
                          <TableCell className="py-6">
                            <div className="space-y-1 w-[120px]">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span>{seccion.inscritos || 0} / {seccion.capacidad || 40}</span>
                                <span>{ocupacionPorcentaje}%</span>
                              </div>
                              <Progress value={ocupacionPorcentaje} className="h-1" indicatorClassName={ocupacionPorcentaje > 90 ? "bg-destructive" : "bg-primary"} />
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.estado && <TableCell className="py-6 text-center">{getStatusBadge(seccion.estado)}</TableCell>}
                        <TableCell className="py-6 pr-8 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-border/50 shadow-xl">
                              {seccion.estado !== "Finalizada" && (
                                <DropdownMenuItem onClick={() => openEditSection(seccion)} className="cursor-pointer"><Edit className="h-4 w-4 mr-2" /> Editar estructura</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Mostrando {paginatedSecciones.length} de {filteredSecciones.length}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (<PaginationItem key={page} className="hidden sm:block"><PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); setCurrentPage(page); }} className="text-xs h-8 w-8">{page}</PaginationLink></PaginationItem>))}
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} /></PaginationItem>
                </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </motion.div>

      {/* Editar Estructura */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[1.5rem]">
          <DialogHeader><DialogTitle className="text-2xl font-black">Editar Estructura Académica</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdateSeccion} className="space-y-8 py-6">
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><Label className="text-xs font-bold uppercase opacity-60">Docente Asignado</Label><Select value={formData.docente} onValueChange={(val) => setFormData({ ...formData, docente: val })}><SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger><SelectContent>{DOCENTES_MAESTROS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="text-xs font-bold uppercase opacity-60">Capacidad Máxima</Label><Input type="number" value={formData.capacidad} onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })} /></div>
                <div className="space-y-4 md:col-span-2"><Label className="text-xs font-bold uppercase opacity-60">Horario (Días y Horas)</Label><div className="flex flex-wrap gap-4">{DIAS_SEMANA.map((dia) => (<div key={dia.id} className="flex items-center space-x-2"><Checkbox id={`edit-${dia.id}`} checked={formData.dias.includes(dia.id)} onCheckedChange={(checked) => { const newDias = checked ? [...formData.dias, dia.id] : formData.dias.filter(d => d !== dia.id); setFormData({ ...formData, dias: newDias }); }} /><Label htmlFor={`edit-${dia.id}`} className="text-xs">{dia.label}</Label></div>))}</div><div className="flex gap-4 mt-4"><Input type="time" value={formData.horaInicio} onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })} /><Input type="time" value={formData.horaFin} onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })} /></div></div>
             </div>
             <DialogFooter><DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose><Button type="submit">Guardar Cambios</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
