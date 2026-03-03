
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileDown,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Settings2,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
  FileText,
  File,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const INSTITUTIONAL_LOGO_URL = "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/464333115_966007555565670_4128720996564005167_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=EMvGNmceS2MQ7kNvwEsOLIQ&_nc_oc=Adn7yCmL1L0d_q_T3RmKPjlNzNjoymkuBFubAEUATP6uhRXx1xO45dP6A-fSHuRry6k&_nc_zt=23&_nc_ht=scontent.fhex4-1.fna&_nc_gid=k4LHuS2fyZk0hqMaMppmGA&_nc_ss=8&oh=00_AfwReuaU0s2hGLkzazE0TipD7oV3F_Kh__qive_uh_tnJQ&oe=69ACD868";

const initialSecciones = [
  { id: "SEC-001", periodo: "2024-2", curso: "Seguridad de la Carga Aérea", programa: "DIGEP Directo", docente: "Juan Pérez", inscritos: 32, capacidad: 40, estado: "Abierta" },
  { id: "SEC-002", periodo: "2024-2", curso: "Mercancías Peligrosas", programa: "DIGEP-INFOTEP", docente: "María García", inscritos: 15, capacidad: 20, estado: "Abierta" },
  { id: "SEC-003", periodo: "2024-2", curso: "AVSEC para Tripulación", programa: "Dominicana Digna", docente: "Carlos López", inscritos: 28, capacidad: 30, estado: "Abierta" },
  { id: "SEC-004", periodo: "2024-2", curso: "Manejo de Crisis", programa: "DIGEP Directo", docente: "Ana Martínez", inscritos: 25, capacidad: 25, estado: "Cerrada" },
  { id: "SEC-005", periodo: "2024-2", curso: "Seguridad Aeroportuaria", programa: "DIGEP-INFOTEP", docente: "Luis Hernández", inscritos: 40, capacidad: 40, estado: "Cerrada" },
  { id: "SEC-006", periodo: "2024-2", curso: "Inteligencia Emocional", programa: "Dominicana Digna", docente: "Juan Pérez", inscritos: 12, capacidad: 50, estado: "Abierta" },
  { id: "SEC-007", periodo: "2024-2", curso: "Ciberseguridad en Aviación", programa: "DIGEP Directo", docente: "María García", inscritos: 20, capacidad: 40, estado: "Abierta" },
  { id: "SEC-008", periodo: "2024-2", curso: "Primeros Auxilios Aeroportuarios", programa: "DIGEP-INFOTEP", docente: "Carlos López", inscritos: 8, capacidad: 30, estado: "Abierta" },
  { id: "SEC-009", periodo: "2024-2", curso: "Protocolo y Etiqueta", programa: "Dominicana Digna", docente: "Ana Martínez", inscritos: 25, capacidad: 25, estado: "Cerrada" },
  { id: "SEC-010", periodo: "2024-2", curso: "Gestión de Carga Peligrosa", programa: "DIGEP Directo", docente: "Luis Hernández", inscritos: 18, capacidad: 40, estado: "Abierta" },
  { id: "SEC-011", periodo: "2024-2", curso: "Inglés Técnico Aeronáutico", programa: "DIGEP-INFOTEP", docente: "Juan Pérez", inscritos: 22, capacidad: 30, estado: "Abierta" },
  { id: "SEC-012", periodo: "2024-2", curso: "Psicología del Pasajero", programa: "Dominicana Digna", docente: "María García", inscritos: 14, capacidad: 40, estado: "Abierta" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function GestionSeccionesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [secciones, setSecciones] = useState(initialSecciones);
  
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    periodo: true,
    curso: true,
    programa: true,
    docente: true,
    ocupacion: true,
    estado: true,
  });

  const [filterConfig, setFilterConfig] = useState({
    estado: "Todos",
    programa: "Todos",
    periodo: "Todos",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const calculateOcupacion = (inscritos: number, capacidad: number) => {
    return Math.round((inscritos / capacidad) * 100);
  };

  const filteredSecciones = useMemo(() => {
    return secciones.filter((s) => {
      const matchesSearch = 
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.docente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.periodo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = filterConfig.estado === "Todos" || s.estado === filterConfig.estado;
      const matchesPrograma = filterConfig.programa === "Todos" || s.programa === filterConfig.programa;
      const matchesPeriodo = filterConfig.periodo === "Todos" || s.periodo === filterConfig.periodo;

      return matchesSearch && matchesEstado && matchesPrograma && matchesPeriodo;
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

  const handleAction = (id: string, action: string) => {
    if (action === "cerrar") {
      setSecciones(prev => prev.map(s => s.id === id ? { ...s, estado: "Cerrada" } : s));
      toast({ title: "Sección Cerrada", description: "Ya no se permiten más inscripciones en esta sección." });
    } else if (action === "finalizar") {
      setSecciones(prev => prev.filter(s => s.id !== id));
      toast({ title: "Sección Finalizada", description: "La sección ha sido completada y removida de la gestión activa." });
    } else {
      toast({ title: "Acción en desarrollo", description: `Iniciando: ${action}` });
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
      if (visibleColumns.id) row["ID"] = s.id;
      if (visibleColumns.periodo) row["Período"] = s.periodo;
      if (visibleColumns.curso) row["Curso"] = s.curso;
      if (visibleColumns.programa) row["Programa"] = s.programa;
      if (visibleColumns.docente) row["Docente"] = s.docente;
      if (visibleColumns.ocupacion) row["Ocupación"] = `${s.inscritos} / ${s.capacidad} (${calculateOcupacion(s.inscritos, s.capacidad)}%)`;
      if (visibleColumns.estado) row["Estado"] = s.estado;
      return row;
    });

    const exportHeaders = Object.keys(dataToExport[0] || {});

    toast({ title: "Generando reporte", description: `Exportando datos a ${format.toUpperCase()}...` });

    try {
      if (format === 'excel') {
        const { utils, writeFile } = await import('xlsx');
        const headerRows = [
          ["REPÚBLICA DOMINICANA"],
          ["Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N."],
          ["SANTO DOMINGO, ESTE."],
          ["“TODO POR LA PATRIA”"],
          [""],
          [`REPORTE DE GESTIÓN DE SECCIONES`],
          [fullGenerationDate],
          [""]
        ];
        const worksheet = utils.aoa_to_sheet(headerRows);
        utils.sheet_add_json(worksheet, dataToExport, { origin: "A9" });
        const lastRowIndex = 9 + dataToExport.length;
        utils.sheet_add_aoa(worksheet, [[""], [`Total de Secciones Exportadas: ${totalRegistros}`]], { origin: `A${lastRowIndex + 1}` });
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Gestión");
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
        doc.setFont("helvetica", "bold").setFontSize(12).text(`REPORTE DE GESTIÓN DE SECCIONES`, 14, 72);
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
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Dirección General de las Escuelas Vocacionales FF.AA. y P.N.", size: 20 })] }),
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

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Abierta": return <Badge className="bg-success/15 text-success border-success/20 font-bold px-3">Abierta</Badge>;
      case "Cerrada": return <Badge className="bg-destructive/15 text-destructive border-destructive/20 font-bold px-3">Cerrada</Badge>;
      default: return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-black font-headline tracking-tighter">Gestión de Secciones</h1>
          </div>
          <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
            Control de asistencia, calificaciones y cierre de secciones académicas.
          </p>
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
                  <h4 className="font-black text-xs uppercase tracking-widest text-primary">Filtros Avanzados</h4>
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase opacity-60">Columnas Visibles</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(visibleColumns).map(([key, isVisible]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`col-${key}`} 
                          checked={isVisible} 
                          onCheckedChange={(checked) => setVisibleColumns({...visibleColumns, [key]: !!checked})} 
                        />
                        <Label htmlFor={`col-${key}`} className="text-[11px] font-medium capitalize">{key}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase opacity-60">Filtros de Datos</p>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">Estatus</Label>
                      <Select value={filterConfig.estado} onValueChange={(val) => setFilterConfig({...filterConfig, estado: val})}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          <SelectItem value="Abierta">Abierta</SelectItem>
                          <SelectItem value="Cerrada">Cerrada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">Programa</Label>
                      <Select value={filterConfig.programa} onValueChange={(val) => setFilterConfig({...filterConfig, programa: val})}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          <SelectItem value="DIGEP Directo">DIGEP Directo</SelectItem>
                          <SelectItem value="DIGEP-INFOTEP">DIGEP-INFOTEP</SelectItem>
                          <SelectItem value="Dominicana Digna">Dominicana Digna</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold uppercase text-destructive" onClick={() => setFilterConfig({ estado: "Todos", programa: "Todos", periodo: "Todos" })}>Restablecer</Button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-9">
                <FileDown className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
              <DropdownMenuItem onClick={() => handleExport('word')} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" /> Word
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
                <File className="h-4 w-4 mr-2" /> PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input placeholder="Buscar por ID, Curso, Docente o Período..." className="pl-12 h-14 bg-card/50 border-border/50 focus:bg-card transition-all text-lg rounded-2xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/50 overflow-hidden shadow-xl bg-card/60 backdrop-blur-sm rounded-[1.5rem]">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  {visibleColumns.id && <TableHead className="font-bold py-5 pl-8 text-xs uppercase tracking-widest opacity-60">ID Sección</TableHead>}
                  {visibleColumns.periodo && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Período</TableHead>}
                  {visibleColumns.curso && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Curso</TableHead>}
                  {visibleColumns.programa && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Programa</TableHead>}
                  {visibleColumns.docente && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Docente</TableHead>}
                  {visibleColumns.ocupacion && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Ocupación</TableHead>}
                  {visibleColumns.estado && <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60 text-center">Estatus</TableHead>}
                  <TableHead className="font-bold py-5 pr-8 text-xs uppercase tracking-widest opacity-60 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSecciones.map((seccion) => {
                  const ocupacionPorcentaje = calculateOcupacion(seccion.inscritos, seccion.capacidad);
                  return (
                    <TableRow key={seccion.id} className="group hover:bg-muted/20 border-border/50 transition-colors">
                      {visibleColumns.id && <TableCell className="py-6 pl-8 font-mono text-xs font-bold text-primary">{seccion.id}</TableCell>}
                      {visibleColumns.periodo && <TableCell className="py-6 font-semibold text-sm">{seccion.periodo}</TableCell>}
                      {visibleColumns.curso && <TableCell className="py-6 font-bold text-foreground tracking-tight">{seccion.curso}</TableCell>}
                      {visibleColumns.programa && <TableCell className="py-6 text-sm text-muted-foreground">{seccion.programa}</TableCell>}
                      {visibleColumns.docente && (
                        <TableCell className="py-6">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                              <span className="text-[10px] font-bold text-primary">{seccion.docente.charAt(0)}</span>
                            </div>
                            <span className="font-semibold text-sm">{seccion.docente}</span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.ocupacion && (
                        <TableCell className="py-6">
                          <div className="space-y-2 w-[160px]">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className={ocupacionPorcentaje > 90 ? "text-destructive" : "text-muted-foreground"}>{seccion.inscritos} / {seccion.capacidad}</span>
                              <span className="text-foreground">{ocupacionPorcentaje}%</span>
                            </div>
                            <Progress value={ocupacionPorcentaje} className="h-1.5" indicatorClassName={ocupacionPorcentaje > 90 ? "bg-destructive" : "bg-primary"} />
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.estado && <TableCell className="py-6 text-center">{getStatusBadge(seccion.estado)}</TableCell>}
                      <TableCell className="py-6 pr-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                            <DropdownMenuLabel>Operaciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleAction(seccion.id, "notas")} className="cursor-pointer"><GraduationCap className="h-4 w-4 mr-2" /> Registrar Notas</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(seccion.id, "estudiantes")} className="cursor-pointer"><Users className="h-4 w-4 mr-2" /> Ver Estudiantes</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(seccion.id, "asistencia")} className="cursor-pointer"><ClipboardCheck className="h-4 w-4 mr-2" /> Pasar Asistencia</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction(seccion.id, "cerrar")} className="cursor-pointer text-amber-600"><XCircle className="h-4 w-4 mr-2" /> Cerrar Sección</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(seccion.id, "finalizar")} className="cursor-pointer text-destructive"><CheckCircle2 className="h-4 w-4 mr-2" /> Finalizar Sección</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <AnimatePresence>
              {filteredSecciones.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center"><p className="text-muted-foreground italic">No se encontraron secciones activas.</p></motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground">Mostrando <span className="text-foreground font-bold">{paginatedSecciones.length}</span> de <span className="text-foreground font-bold">{filteredSecciones.length}</span> registros</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Ver:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
                  <SelectTrigger className="h-8 w-20 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="50">50</SelectItem><SelectItem value="100">100</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <Pagination className="w-auto mx-0">
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} /></PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page} className="hidden sm:block">
                        <PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}>{page}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} /></PaginationItem>
                </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
    