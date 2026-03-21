
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileDown,
  Filter,
  Search,
  MoreHorizontal,
  GraduationCap,
  ClipboardCheck,
  Users,
  FileText,
  File,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Settings2,
  Target,
  Eye,
  Calendar,
  Lock,
  Unlock
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { collection, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const INSTITUTIONAL_LOGO_URL = "/img/logo-digev.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function GestionSeccionesPanel() {
  const { toast } = useToast();
  const db = useFirestore();
  const seccionesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "secciones"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: seccionesRaw, loading } = useCollection(seccionesQuery);
  const secciones = useMemo(() => seccionesRaw || [], [seccionesRaw]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeccion, setSelectedSeccion] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

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

  const filteredSecciones = useMemo(() => {
    return secciones.filter((s) => {
      // Regla: No mostrar Finalizadas por defecto en el panel operativo principal
      if (filterConfig.estado !== "Finalizada" && s.estado === "Finalizada") return false;

      const matchesSearch =
        s.codigoSeccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.curso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.docente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.periodo?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado = filterConfig.estado === "Todos" || s.estado === filterConfig.estado;
      const matchesPrograma = filterConfig.programa === "Todos" || s.programa === filterConfig.programa;

      return matchesSearch && matchesEstado && matchesPrograma;
    });
  }, [secciones, searchTerm, filterConfig]);

  const stats = useMemo(() => {
    const total = filteredSecciones.length;
    const abiertas = filteredSecciones.filter(s => s.estado === "Abierta").length;
    const cerradas = filteredSecciones.filter(s => s.estado === "Cerrada").length;
    const totalEstudiantes = filteredSecciones.reduce((acc, s) => acc + (s.inscritos || 0), 0);
    const ocupacionTotal = filteredSecciones.reduce((acc, s) => acc + ((s.inscritos || 0) / (s.capacidad || 40)), 0);
    const promedioOcupacion = total > 0 ? Math.round((ocupacionTotal / total) * 100) : 0;

    return { total, abiertas, cerradas, totalEstudiantes, promedioOcupacion };
  }, [filteredSecciones]);

  const totalPages = Math.ceil(filteredSecciones.length / itemsPerPage);

  const paginatedSecciones = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSecciones.slice(start, start + itemsPerPage);
  }, [filteredSecciones, currentPage, itemsPerPage]);

  const calculateOcupacion = (inscritos: number = 0, capacidad: number = 40) => {
    return Math.round((inscritos / capacidad) * 100);
  };

  const handleAction = async (id: string, action: string) => {
    if (!db) return;
    const seccionRef = doc(db, "secciones", id);

    if (action === "toggle") {
      const currentSeccion = secciones.find(s => s.id === id);
      if (!currentSeccion) return;
      const nuevoEstado = currentSeccion.estado === "Abierta" ? "Cerrada" : "Abierta";
      updateDoc(seccionRef, { estado: nuevoEstado })
        .then(() => toast({ title: nuevoEstado === "Cerrada" ? "Sección Cerrada" : "Sección Reabierta" }))
        .catch((err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: seccionRef.path, operation: 'update', requestResourceData: { estado: nuevoEstado } })));
    } else if (action === "finalizar") {
      updateDoc(seccionRef, { estado: "Finalizada" })
        .then(() => toast({ title: "Sección Finalizada" }))
        .catch((err) => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: seccionRef.path, operation: 'update', requestResourceData: { estado: 'Finalizada' } })));
    } else {
      toast({ title: "Módulo Operativo", description: `Iniciando: ${action}` });
    }
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'word') => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: true });
    const fullGenerationDate = `Fecha de generación: ${dateStr} – ${timeStr.toUpperCase()}`;
    const fileName = `Gestion_Secciones_${now.toISOString().split('T')[0]}`;
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
          [`PANEL OPERATIVO DE GESTIÓN DE SECCIONES`],
          [fullGenerationDate],
          [""]
        ];
        const worksheet = utils.aoa_to_sheet(headerRows);
        utils.sheet_add_json(worksheet, dataToExport, { origin: "A9" });
        const lastRowIndex = 9 + dataToExport.length;
        utils.sheet_add_aoa(worksheet, [[""], [`Total de Secciones Exportadas: ${totalRegistros}`]], { origin: `A${lastRowIndex + 1}` });
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Gestión Operativa");
        writeFile(workbook, `${fileName}.xlsx`);
      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF('landscape');
        const centerX = doc.internal.pageSize.getWidth() / 2;
        try { doc.addImage(INSTITUTIONAL_LOGO_URL, 'JPEG', centerX - 12.5, 10, 25, 25); } catch (e) { }
        doc.setFont("helvetica", "bold").setFontSize(14).text("REPÚBLICA DOMINICANA", centerX, 42, { align: "center" });
        doc.setFontSize(10).setFont("helvetica", "normal").text("Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N.", centerX, 48, { align: "center" });
        doc.text("SANTO DOMINGO, ESTE.", centerX, 53, { align: "center" });
        doc.setFont("helvetica", "italic").text("“TODO POR LA PATRIA”", centerX, 58, { align: "center" });
        doc.line(20, 62, doc.internal.pageSize.getWidth() - 20, 62);
        doc.setFont("helvetica", "bold").setFontSize(12).text(`PANEL OPERATIVO DE GESTIÓN DE SECCIONES`, 14, 72);
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
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: buffer, transformation: { width: 60, height: 60 }, type: "jpg" })] }),
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
                    children: Object.values(row).map(v => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(v), size: 16 })] })] }))
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

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Abierta": return <Badge className="bg-success/15 text-success border-success/20 font-bold px-3">Abierta</Badge>;
      case "Cerrada": return <Badge className="bg-destructive/15 text-destructive border-destructive/20 font-bold px-3">Cerrada</Badge>;
      case "Finalizada": return <Badge className="bg-muted text-muted-foreground border-muted-foreground/20 font-bold px-3">Finalizada</Badge>;
      default: return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <motion.div className="space-y-8 pb-10" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-headline tracking-tighter">Gestión de Secciones</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-3">
              Total Operativo: {stats.total}
            </Badge>
            <span className="text-muted-foreground text-xs font-medium">• Panel de Control Académico (Real-time)</span>
          </div>
        </div>
      </motion.div>

      <motion.section variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-l-4 border-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Abiertas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">{stats.abiertas}</div>
            <p className="text-[10px] text-muted-foreground font-medium mt-1 italic">Operación activa</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Cerradas</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">{stats.cerradas}</div>
            <p className="text-[10px] text-muted-foreground font-medium mt-1 italic">Bloqueadas</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Inscritos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">{stats.totalEstudiantes}</div>
            <p className="text-[10px] text-muted-foreground font-medium mt-1 italic">Estudiantes reales</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ocupación</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">{stats.promedioOcupacion}%</div>
            <Progress value={stats.promedioOcupacion} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
      </motion.section>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por Código de Sección, Curso, Programa, Docente o Período..."
            className="pl-12 h-12 bg-card/50 border-border/50 text-sm rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-12 px-6">
                <Filter className="mr-2 h-4 w-4" /> Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 rounded-2xl shadow-2xl bg-card" align="end">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-widest text-primary">Configuración</h4>
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase opacity-60">Visualización de Columnas</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(visibleColumns).map(([key, isVisible]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`gest-${key}`} checked={isVisible} onCheckedChange={(checked) => setVisibleColumns({ ...visibleColumns, [key]: !!checked })} />
                        <Label htmlFor={`gest-${key}`} className="text-[11px] font-medium capitalize">{key === 'codigoSeccion' ? 'Código de Sección' : key}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold opacity-60">Estado de Sección</Label>
                  <Select value={filterConfig.estado} onValueChange={(val) => setFilterConfig({ ...filterConfig, estado: val })}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Abierta">Abierta</SelectItem>
                      <SelectItem value="Cerrada">Cerrada</SelectItem>
                      <SelectItem value="Finalizada">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-12 px-6">
                <FileDown className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-2xl">
              <DropdownMenuItem onClick={() => handleExport('word')} className="cursor-pointer"><FileText className="h-4 w-4 mr-2" /> Word (.docx)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer"><File className="h-4 w-4 mr-2" /> PDF (.pdf)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer"><FileSpreadsheet className="h-4 w-4 mr-2" /> Excel (.xlsx)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                    {visibleColumns.codigoSeccion && <TableHead className="font-bold py-5 pl-8 text-[10px] uppercase tracking-widest opacity-60 text-primary">Código de Sección</TableHead>}
                    {visibleColumns.periodo && <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Período</TableHead>}
                    {visibleColumns.curso && <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Curso</TableHead>}
                    {visibleColumns.programa && <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Programa</TableHead>}
                    {visibleColumns.docente && <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Docente</TableHead>}
                    {visibleColumns.horario && <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Horario</TableHead>}
                    {visibleColumns.ocupacion && <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Ocupación</TableHead>}
                    {visibleColumns.estado && <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60 text-center">Estatus</TableHead>}
                    <TableHead className="font-bold py-5 pr-8 text-[10px] uppercase tracking-widest opacity-60 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSecciones.map((seccion) => {
                    const ocupacionPorcentaje = calculateOcupacion(seccion.inscritos, seccion.capacidad);
                    return (
                      <TableRow key={seccion.id} className="group hover:bg-muted/20 border-border/50 transition-colors">
                        {visibleColumns.codigoSeccion && <TableCell className="py-6 pl-8 font-mono text-xs font-black text-primary">{seccion.codigoSeccion}</TableCell>}
                        {visibleColumns.periodo && <TableCell className="py-6 font-semibold text-xs tracking-tight">{seccion.periodo}</TableCell>}
                        {visibleColumns.curso && <TableCell className="py-6 font-bold text-foreground text-xs leading-relaxed">{seccion.curso}</TableCell>}
                        {visibleColumns.programa && <TableCell className="py-6 text-xs text-muted-foreground font-medium">{seccion.programa}</TableCell>}
                        {visibleColumns.docente && <TableCell className="py-6 font-bold text-xs">{seccion.docente}</TableCell>}
                        {visibleColumns.horario && <TableCell className="py-6 text-[10px] text-muted-foreground">{seccion.horario}</TableCell>}
                        {visibleColumns.ocupacion && (
                          <TableCell className="py-6">
                            <div className="space-y-1.5 w-[140px]">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span>{seccion.inscritos || 0} / {seccion.capacidad || 40}</span>
                                <span className={ocupacionPorcentaje > 90 ? "text-destructive" : ""}>{ocupacionPorcentaje}%</span>
                              </div>
                              <Progress value={ocupacionPorcentaje} className="h-1.5" indicatorClassName={ocupacionPorcentaje > 90 ? "bg-destructive" : "bg-primary"} />
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.estado && <TableCell className="py-6 text-center">{getStatusBadge(seccion.estado)}</TableCell>}
                        <TableCell className="py-6 pr-8 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-2xl">
                              <DropdownMenuLabel className="text-[9px] font-bold uppercase opacity-50 px-2">Gestión Operativa</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => { setSelectedSeccion(seccion); setIsViewDialogOpen(true); }} className="cursor-pointer text-xs"><Eye className="h-4 w-4 mr-2" /> Ver Detalles Completos</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction(seccion.id, "notas")} className="cursor-pointer text-xs"><GraduationCap className="h-4 w-4 mr-2" /> Registrar Notas</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction(seccion.id, "asistencia")} className="cursor-pointer text-xs"><ClipboardCheck className="h-4 w-4 mr-2" /> Pasar Asistencia</DropdownMenuItem>
                              <DropdownMenuSeparator className="opacity-50" />
                              <DropdownMenuItem onClick={() => handleAction(seccion.id, "toggle")} className="cursor-pointer text-xs">
                                {seccion.estado === "Abierta" ? <><Lock className="h-4 w-4 mr-2 text-destructive" /> Cerrar Sección</> : <><Unlock className="h-4 w-4 mr-2 text-success" /> Reabrir Sección</>}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction(seccion.id, "finalizar")} className="cursor-pointer text-xs text-destructive">
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Finalizar Sección Académica
                              </DropdownMenuItem>
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
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Ver:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
                  <SelectTrigger className="h-8 w-20 rounded-lg text-[10px] font-bold"><SelectValue /></SelectTrigger>
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

      {/* Ver Detalles Expandido */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[1.5rem]">
          <DialogHeader><DialogTitle className="text-2xl font-black">Panel Operativo de Sección</DialogTitle></DialogHeader>
          {selectedSeccion && (
            <div className="grid grid-cols-2 gap-8 py-6">
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Información General</div>
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <div><Label className="text-[10px] opacity-60">CÓDIGO DE SECCIÓN</Label><p className="text-sm font-black text-primary">{selectedSeccion.codigoSeccion}</p></div>
                  <div><Label className="text-[10px] opacity-60">CURSO</Label><p className="text-sm font-bold">{selectedSeccion.curso}</p></div>
                  <div><Label className="text-[10px] opacity-60">DOCENTE</Label><p className="text-sm font-bold">{selectedSeccion.docente}</p></div>
                  <div><Label className="text-[10px] opacity-60">PERÍODO</Label><p className="text-sm font-bold">{selectedSeccion.periodo}</p></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Control de Tiempos y Cupos</div>
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <div className="flex gap-4">
                    <div className="flex-1"><Label className="text-[10px] opacity-60">INICIO</Label><p className="text-xs font-bold flex items-center gap-2"><Calendar className="h-3 w-3" />{selectedSeccion.fechaInicio}</p></div>
                    <div className="flex-1"><Label className="text-[10px] opacity-60">FIN</Label><p className="text-xs font-bold flex items-center gap-2"><Calendar className="h-3 w-3" />{selectedSeccion.fechaFin}</p></div>
                  </div>
                  <div><Label className="text-[10px] opacity-60">HORARIO</Label><p className="text-xs font-bold">{selectedSeccion.horario}</p></div>
                  <div><Label className="text-[10px] opacity-60">MÉTRICA DE OCUPACIÓN</Label><p className="text-sm font-black text-primary">{selectedSeccion.inscritos || 0} / {selectedSeccion.capacidad || 40} ({calculateOcupacion(selectedSeccion.inscritos, selectedSeccion.capacidad)}%)</p></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline">Cerrar Panel</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
