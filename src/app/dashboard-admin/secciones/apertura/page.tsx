
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
  FileDown,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  BookOpen,
  Clock,
  Users,
  FileText,
  File,
  FileSpreadsheet,
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// URL del Logo Institucional
const INSTITUTIONAL_LOGO_URL = "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/464333115_966007555565670_4128720996564005167_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=EMvGNmceS2MQ7kNvwEsOLIQ&_nc_oc=Adn7yCmL1L0d_q_T3RmKPjlNzNjoymkuBFubAEUATP6uhRXx1xO45dP6A-fSHuRry6k&_nc_zt=23&_nc_ht=scontent.fhex4-1.fna&_nc_gid=k4LHuS2fyZk0hqMaMppmGA&_nc_ss=8&oh=00_AfwReuaU0s2hGLkzazE0TipD7oV3F_Kh__qive_uh_tnJQ&oe=69ACD868";

// Datos maestros (Simulados)
const PERIODOS_MAESTROS = [
  { id: "2024-2", nombre: "Período 2024-2 (Trimestral)", inicio: "2024-06-01", fin: "2024-08-31" },
  { id: "2024-S2", nombre: "Período 2024-S2 (Semestral)", inicio: "2024-07-01", fin: "2024-12-31" },
  { id: "2024-A", nombre: "Período 2024 (Anual)", inicio: "2024-01-10", fin: "2024-12-15" },
];

const CURSOS_MAESTROS = [
  "Seguridad de la Carga Aérea",
  "Mercancías Peligrosas",
  "AVSEC para Tripulación",
  "Manejo de Crisis",
  "Seguridad Aeroportuaria",
  "Inteligencia Emocional",
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

const initialSecciones = [
  {
    id: "SEC-001",
    curso: "Seguridad de la Carga Aérea",
    programa: "DIGEP Directo",
    docente: "Juan Pérez",
    horario: "Lun-Vie 08:00 AM - 12:00 PM",
    dias: ["lun", "mar", "mie", "jue", "vie"],
    horaInicio: "08:00",
    horaFin: "12:00",
    estado: "Abierta",
    inscritos: 32,
    capacidad: 40,
    periodoId: "2024-2",
  },
  {
    id: "SEC-002",
    curso: "Mercancías Peligrosas",
    programa: "DIGEP-INFOTEP",
    docente: "María García",
    horario: "Sáb 09:00 AM - 05:00 PM",
    dias: ["sab"],
    horaInicio: "09:00",
    horaFin: "17:00",
    estado: "En proceso",
    inscritos: 15,
    capacidad: 20,
    periodoId: "2024-2",
  },
  {
    id: "SEC-003",
    curso: "AVSEC para Tripulación",
    programa: "Dominicana Digna",
    docente: "Carlos López",
    horario: "Mar-Jue 02:00 PM - 06:00 PM",
    dias: ["mar", "jue"],
    horaInicio: "14:00",
    horaFin: "18:00",
    estado: "Abierta",
    inscritos: 28,
    capacidad: 30,
    periodoId: "2024-2",
  },
  {
    id: "SEC-004",
    curso: "Manejo de Crisis",
    programa: "DIGEP Directo",
    docente: "Ana Martínez",
    horario: "Lun-Mie-Vie 08:00 AM - 10:00 AM",
    dias: ["lun", "mie", "vie"],
    horaInicio: "08:00",
    horaFin: "10:00",
    estado: "En proceso",
    inscritos: 10,
    capacidad: 25,
    periodoId: "2024-2",
  },
  {
    id: "SEC-005",
    curso: "Seguridad Aeroportuaria",
    programa: "DIGEP-INFOTEP",
    docente: "Luis Hernández",
    horario: "Sáb 08:00 AM - 04:00 PM",
    dias: ["sab"],
    horaInicio: "08:00",
    horaFin: "16:00",
    estado: "Cerrada",
    inscritos: 40,
    capacidad: 40,
    periodoId: "2024-2",
  },
  {
    id: "SEC-006",
    curso: "Inteligencia Emocional",
    programa: "Dominicana Digna",
    docente: "Juan Pérez",
    horario: "Vie 02:00 PM - 05:00 PM",
    dias: ["vie"],
    horaInicio: "14:00",
    horaFin: "17:00",
    estado: "Abierta",
    inscritos: 12,
    capacidad: 50,
    periodoId: "2024-2",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function AperturaSeccionesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [secciones, setSecciones] = useState(initialSecciones);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSeccion, setSelectedSeccion] = useState<any>(null);
  
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

  const selectedPeriodo = useMemo(() => 
    PERIODOS_MAESTROS.find(p => p.id === (isEditDialogOpen ? selectedSeccion?.periodoId : formData.periodoId)),
    [formData.periodoId, selectedSeccion, isEditDialogOpen]
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

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
    return secciones.filter(
        (s) =>
          s.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.docente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.programa.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [secciones, searchTerm]);

  const totalPages = Math.ceil(filteredSecciones.length / itemsPerPage);
  
  const paginatedSecciones = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSecciones.slice(start, start + itemsPerPage);
  }, [filteredSecciones, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const calculateOcupacion = (inscritos: number, capacidad: number) => {
    return Math.round((inscritos / capacidad) * 100);
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'word') => {
    const periodo = "2024-2";
    const date = new Date().toISOString().split('T')[0];
    const fileName = `Secciones_${periodo}_${date}`;
    const totalRegistros = filteredSecciones.length;

    const dataToExport = filteredSecciones.map(s => ({
      Curso: s.curso,
      Programa: s.programa,
      Docente: s.docente,
      Horario: s.horario,
      Estado: s.estado,
      Capacidad: s.capacidad,
      Inscritos: s.inscritos,
      Ocupación: `${calculateOcupacion(s.inscritos, s.capacidad)}%`
    }));

    toast({
      title: "Generando reporte institucional",
      description: `Preparando exportación a ${format.toUpperCase()} con hoja timbrada...`,
    });

    try {
      if (format === 'excel') {
        const { utils, writeFile } = await import('xlsx');
        
        // Crear hoja de Excel con encabezados institucionales
        const headerRows = [
          ["REPÚBLICA DOMINICANA"],
          ["Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N."],
          ["SANTO DOMINGO, ESTE."],
          ["“TODO POR LA PATRIA”"],
          [""],
          [`LISTADO DE SECCIONES – PERÍODO ${periodo}`],
          [`Fecha de generación: ${new Date().toLocaleString()}`],
          [""]
        ];

        const worksheet = utils.aoa_to_sheet(headerRows);
        utils.sheet_add_json(worksheet, dataToExport, { origin: "A9" });
        
        // Agregar fila de totales al final
        const lastRowIndex = 9 + dataToExport.length;
        utils.sheet_add_aoa(worksheet, [[""], [`Total de Secciones Exportadas: ${totalRegistros}`]], { origin: `A${lastRowIndex + 1}` });

        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Secciones");
        writeFile(workbook, `${fileName}.xlsx`);

      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF('landscape');
        
        // --- ENCABEZADO TIMBRADO PDF ---
        const logoWidth = 25;
        const logoHeight = 25;
        const centerX = doc.internal.pageSize.getWidth() / 2;
        
        try {
            // Logo Centrado
            doc.addImage(INSTITUTIONAL_LOGO_URL, 'JPEG', centerX - logoWidth/2, 10, logoWidth, logoHeight);
        } catch (e) {
            console.warn("Logo could not be loaded for PDF");
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("REPÚBLICA DOMINICANA", centerX, 42, { align: "center" });
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N.", centerX, 48, { align: "center" });
        doc.text("SANTO DOMINGO, ESTE.", centerX, 53, { align: "center" });
        
        doc.setFont("helvetica", "italic");
        doc.text("“TODO POR LA PATRIA”", centerX, 58, { align: "center" });

        // Línea divisoria
        doc.setDrawColor(200);
        doc.line(20, 62, doc.internal.pageSize.getWidth() - 20, 62);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`LISTADO DE SECCIONES – PERÍODO ${periodo}`, 14, 72);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 77);
        
        autoTable(doc, {
          startY: 82,
          head: [['Curso', 'Programa', 'Docente', 'Horario', 'Estado', 'Cap.', 'Ins.', 'Ocup.']],
          body: dataToExport.map(row => Object.values(row)),
          headStyles: { fillColor: [38, 101, 140], textColor: [255, 255, 255], fontStyle: 'bold' },
          styles: { fontSize: 8 },
        });

        // Totales al final
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(`Total de Secciones Exportadas: ${totalRegistros}`, 14, finalY);
        
        doc.save(`${fileName}.pdf`);

      } else if (format === 'word') {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, BorderStyle, ImageRun } = await import('docx');
        const { saveAs } = await import('file-saver');

        // Cargar imagen para Word
        const response = await fetch(INSTITUTIONAL_LOGO_URL);
        const buffer = await response.arrayBuffer();

        const doc = new Document({
          sections: [{
            children: [
              // Logo centrado
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: buffer,
                    transformation: { width: 80, height: 80 },
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "REPÚBLICA DOMINICANA", bold: true, size: 28 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Dirección General de las Escuelas Vocacionales de las FF. AA. y la P.N.", size: 20 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "SANTO DOMINGO, ESTE.", size: 20 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "“TODO POR LA PATRIA”", italics: true, size: 20 }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [ new TextRun({ text: "", border: { top: { style: BorderStyle.SINGLE, size: 1, color: "000000" } } }) ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `LISTADO DE SECCIONES – PERÍODO ${periodo}`,
                    bold: true,
                    size: 24,
                    color: "26658C"
                  }),
                ],
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Generado el: ${new Date().toLocaleString()}`,
                    size: 16,
                    italics: true,
                  }),
                ],
                spacing: { after: 400 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      'Curso', 'Programa', 'Docente', 'Horario', 'Estado', 'Cap.', 'Ins.', 'Ocup.'
                    ].map(h => new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })],
                      shading: { fill: "26658C" },
                      verticalAlign: "center",
                    }))
                  }),
                  ...dataToExport.map(row => new TableRow({
                    children: Object.values(row).map(v => new TableCell({
                      children: [new Paragraph({ text: String(v), size: 16 })],
                      verticalAlign: "center",
                    }))
                  }))
                ]
              }),
              new Paragraph({
                spacing: { before: 400 },
                children: [
                    new TextRun({ text: `Total de Secciones Exportadas: ${totalRegistros}`, bold: true, size: 20 })
                ]
              })
            ]
          }]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${fileName}.docx`);
      }
      
      toast({
        title: "Exportación exitosa",
        description: `El archivo ${fileName} con membrete institucional ha sido descargado.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error de exportación",
        description: "Hubo un problema al generar el reporte institucional.",
      });
    }
  };

  const handleCreateSeccion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.periodoId || !formData.curso || !formData.docente || formData.dias.length === 0) {
      toast({ variant: "destructive", title: "Campos incompletos", description: "Por favor, completa todos los campos obligatorios." });
      return;
    }
    const newId = `SEC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const diasStr = formData.dias.map(d => DIAS_SEMANA.find(ds => ds.id === d)?.label.substring(0, 3)).join('-');
    const timeStart12 = formatTime12h(formData.horaInicio);
    const timeEnd12 = formatTime12h(formData.horaFin);
    const newSeccion = {
      id: newId, curso: formData.curso, programa: "DIGEP Directo", docente: formData.docente, horario: `${diasStr} ${timeStart12} - ${timeEnd12}`, dias: formData.dias, horaInicio: formData.horaInicio, horaFin: formData.horaFin, estado: formData.estado, inscritos: 0, capacidad: parseInt(formData.capacidad), periodoId: formData.periodoId,
    };
    setSecciones([newSeccion, ...secciones]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({ title: "Sección creada", description: `La sección ${newId} ha sido creada exitosamente.` });
  };

  const handleUpdateSeccion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeccion) return;
    const diasStr = formData.dias.map(d => DIAS_SEMANA.find(ds => ds.id === d)?.label.substring(0, 3)).join('-');
    const timeStart12 = formatTime12h(formData.horaInicio);
    const timeEnd12 = formatTime12h(formData.horaFin);
    const updatedSecciones = secciones.map(s => {
      if (s.id === selectedSeccion.id) {
        return {
          ...s, docente: formData.docente, capacidad: parseInt(formData.capacidad), dias: formData.dias, horaInicio: formData.horaInicio, horaFin: formData.horaFin, horario: `${diasStr} ${timeStart12} - ${timeEnd12}`,
        };
      }
      return s;
    });
    setSecciones(updatedSecciones);
    setIsEditDialogOpen(false);
    resetForm();
    toast({ title: "Sección actualizada", description: `Los cambios en la sección ${selectedSeccion.id} han sido guardados.` });
  };

  const resetForm = () => {
    setFormData({ periodoId: "", curso: "", docente: "", capacidad: "40", dias: [], horaInicio: "08:00", horaFin: "12:00", estado: "Abierta" });
    setSelectedSeccion(null);
  };

  const openViewDetails = (seccion: any) => {
    setSelectedSeccion(seccion);
    setIsViewDialogOpen(true);
  };

  const openEditSection = (seccion: any) => {
    setSelectedSeccion(seccion);
    setFormData({
      periodoId: seccion.periodoId, curso: seccion.curso, docente: seccion.docente, capacidad: seccion.capacidad.toString(), dias: seccion.dias || [], horaInicio: seccion.horaInicio || "08:00", horaFin: seccion.horaFin || "12:00", estado: seccion.estado,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Abierta": return <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/20 font-bold px-3">Abierta</Badge>;
      case "En proceso": return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 font-bold px-3">En proceso</Badge>;
      case "Cerrada": return <Badge className="bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20 font-bold px-3">Cerrada</Badge>;
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
          <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            Período Académico Activo: <span className="text-foreground font-bold">2024-2</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex font-bold uppercase tracking-wider text-[10px] h-9">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-9">
                <FileDown className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 p-2 shadow-xl">
              <DropdownMenuItem onClick={() => handleExport('word')} className="rounded-lg flex items-center gap-2 py-2 cursor-pointer">
                <FileText className="h-4 w-4 opacity-70" />
                <span className="font-medium text-sm">Exportar a Word</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="rounded-lg flex items-center gap-2 py-2 cursor-pointer">
                <File className="h-4 w-4 opacity-70" />
                <span className="font-medium text-sm">Exportar a PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')} className="rounded-lg flex items-center gap-2 py-2 cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 opacity-70" />
                <span className="font-medium text-sm">Exportar a Excel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetForm} className="font-bold shadow-lg shadow-primary/20 uppercase tracking-wider text-[10px] h-9">
                <PlusCircle className="mr-2 h-4 w-4" /> Nueva Sección
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-border/50 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">Nueva Sección Académica</DialogTitle>
                <DialogDescription className="font-medium text-muted-foreground">Configura los detalles de la nueva oferta académica.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSeccion} className="space-y-8 py-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]"><div className="h-4 w-1 bg-primary rounded-full" />Bloque 1: Información Académica</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label className="text-xs font-bold uppercase opacity-60">Período Académico</Label><Select onValueChange={(val) => setFormData({ ...formData, periodoId: val })}><SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Seleccionar período..." /></SelectTrigger><SelectContent>{PERIODOS_MAESTROS.map((p) => (<SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>))}</SelectContent></Select></div>
                    <div className="space-y-2"><Label className="text-xs font-bold uppercase opacity-60">Curso</Label><Select onValueChange={(val) => setFormData({ ...formData, curso: val })}><SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Seleccionar curso..." /></SelectTrigger><SelectContent>{CURSOS_MAESTROS.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select></div>
                    <div className="space-y-2 md:col-span-2"><Label className="text-xs font-bold uppercase opacity-60">Docente Asignado</Label><Select onValueChange={(val) => setFormData({ ...formData, docente: val })}><SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Buscar docente..." /></SelectTrigger><SelectContent>{DOCENTES_MAESTROS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select></div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]"><div className="h-4 w-1 bg-primary rounded-full" />Bloque 2: Configuración</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2"><Label className="text-xs font-bold uppercase opacity-60">Capacidad Máxima</Label><Input type="number" value={formData.capacidad} onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })} /></div>
                    <div className="space-y-3"><Label className="text-xs font-bold uppercase opacity-60">Días de Clase</Label><div className="flex flex-wrap gap-3">{DIAS_SEMANA.map((dia) => (<div key={dia.id} className="flex items-center space-x-2"><Checkbox id={dia.id} checked={formData.dias.includes(dia.id)} onCheckedChange={(checked) => { const newDias = checked ? [...formData.dias, dia.id] : formData.dias.filter(d => d !== dia.id); setFormData({ ...formData, dias: newDias }); }} /><Label htmlFor={dia.id} className="text-xs">{dia.label}</Label></div>))}</div></div>
                    <div className="space-y-3 md:col-span-2"><Label className="text-xs font-bold uppercase opacity-60">Horario de Clase</Label><div className="flex gap-4"><Input type="time" value={formData.horaInicio} onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })} /><Input type="time" value={formData.horaFin} onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })} /></div></div>
                  </div>
                </div>
                <DialogFooter className="gap-3 pt-8 border-t border-border/30">
                  <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                  <Button type="submit">Crear Sección</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input placeholder="Buscar por curso, docente o programa..." className="pl-12 h-14 bg-card/50 border-border/50 focus:bg-card transition-all text-lg rounded-2xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/50 overflow-hidden shadow-xl shadow-black/5 bg-card/60 backdrop-blur-sm rounded-[1.5rem]">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-bold py-5 pl-8 text-xs uppercase tracking-widest opacity-60">Curso</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Programa</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Docente</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60">Horario</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60 text-center">Estado</TableHead>
                  <TableHead className="font-bold py-5 text-xs uppercase tracking-widest opacity-60 w-[200px]">Ocupación</TableHead>
                  <TableHead className="font-bold py-5 pr-8 text-xs uppercase tracking-widest opacity-60 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSecciones.map((seccion) => {
                  const ocupacionPorcentaje = calculateOcupacion(seccion.inscritos, seccion.capacidad);
                  return (
                    <TableRow key={seccion.id} className="group hover:bg-muted/20 border-border/50 transition-colors">
                      <TableCell className="py-6 pl-8"><div className="flex flex-col"><span className="font-bold text-foreground tracking-tight">{seccion.curso}</span><span className="text-[10px] font-mono text-muted-foreground">{seccion.id}</span></div></TableCell>
                      <TableCell className="py-6 font-medium text-sm text-muted-foreground">{seccion.programa}</TableCell>
                      <TableCell className="py-6"><div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10"><span className="text-[10px] font-bold text-primary">{seccion.docente.charAt(0)}</span></div><span className="font-semibold text-sm">{seccion.docente}</span></div></TableCell>
                      <TableCell className="py-6 text-xs font-medium text-muted-foreground leading-relaxed">{seccion.horario}</TableCell>
                      <TableCell className="py-6 text-center">{getStatusBadge(seccion.estado)}</TableCell>
                      <TableCell className="py-6"><div className="space-y-2"><div className="flex items-center justify-between text-[10px] font-bold"><span className={ocupacionPorcentaje > 90 ? "text-destructive" : "text-muted-foreground uppercase"}>{seccion.inscritos} de {seccion.capacidad}</span><span className="text-foreground">{ocupacionPorcentaje}%</span></div><Progress value={ocupacionPorcentaje} className={`h-1.5 ${ocupacionPorcentaje > 90 ? "bg-destructive/10" : "bg-muted"}`} indicatorClassName={ocupacionPorcentaje > 90 ? "bg-destructive" : "bg-primary"} /></div></TableCell>
                      <TableCell className="py-6 pr-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewDetails(seccion)}><Eye className="h-4 w-4 mr-2" /> Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditSection(seccion)}><Edit className="h-4 w-4 mr-2" /> Editar sección</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground font-medium">Mostrando <span className="text-foreground font-bold">{paginatedSecciones.length}</span> de <span className="text-foreground font-bold">{filteredSecciones.length}</span> registros</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Registros por página:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
                  <SelectTrigger className="h-8 w-20 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="50">50</SelectItem><SelectItem value="100">100</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <Pagination className="w-auto mx-0">
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} /></PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (<PaginationItem key={page}><PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}>{page}</PaginationLink></PaginationItem>))}
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} /></PaginationItem>
                </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </motion.div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[1.5rem] border-border/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Detalles de la Sección</DialogTitle>
          </DialogHeader>
          {selectedSeccion && (
            <div className="space-y-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]"><div className="h-4 w-1 bg-primary rounded-full" />Información Académica</div>
                  <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/50">
                    <div><Label className="text-[10px] font-bold uppercase opacity-50">Período</Label><p className="text-sm font-semibold">{PERIODOS_MAESTROS.find(p => p.id === selectedSeccion.periodoId)?.nombre}</p></div>
                    <div><Label className="text-[10px] font-bold uppercase opacity-50">Curso</Label><p className="text-sm font-semibold">{selectedSeccion.curso}</p></div>
                    <div><Label className="text-[10px] font-bold uppercase opacity-50">Programa</Label><p className="text-sm font-semibold">{selectedSeccion.programa}</p></div>
                    <div><Label className="text-[10px] font-bold uppercase opacity-50">Docente</Label><p className="text-sm font-semibold">{selectedSeccion.docente}</p></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]"><div className="h-4 w-1 bg-primary rounded-full" />Configuración</div>
                  <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/50">
                    <div><Label className="text-[10px] font-bold uppercase opacity-50">Ocupación</Label><div className="flex justify-between text-xs font-bold mb-1"><span>{selectedSeccion.inscritos}/{selectedSeccion.capacidad}</span><span>{calculateOcupacion(selectedSeccion.inscritos, selectedSeccion.capacidad)}%</span></div><Progress value={calculateOcupacion(selectedSeccion.inscritos, selectedSeccion.capacidad)} className="h-1.5" /></div>
                    <div><Label className="text-[10px] font-bold uppercase opacity-50">Horario</Label><p className="text-sm font-semibold">{selectedSeccion.horario}</p></div>
                    <div><Label className="text-[10px] font-bold uppercase opacity-50">Estado</Label><div className="mt-1">{getStatusBadge(selectedSeccion.estado)}</div></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline">Cerrar</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-[1.5rem]">
          <DialogHeader><DialogTitle className="text-2xl font-black">Editar Sección</DialogTitle></DialogHeader>
          {selectedSeccion && (
            <form onSubmit={handleUpdateSeccion} className="space-y-8 py-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] opacity-60">Información General (Solo Lectura)</div>
                <div className="grid grid-cols-2 gap-4 opacity-70">
                   <div className="space-y-1"><Label className="text-[10px]">Período</Label><div className="p-3 bg-muted rounded-xl text-sm">{PERIODOS_MAESTROS.find(p => p.id === selectedSeccion.periodoId)?.nombre}</div></div>
                   <div className="space-y-1"><Label className="text-[10px]">Curso</Label><div className="p-3 bg-muted rounded-xl text-sm">{selectedSeccion.curso}</div></div>
                </div>
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase">Docente Asignado</Label>
                  <Select value={formData.docente} onValueChange={(val) => setFormData({ ...formData, docente: val })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DOCENTES_MAESTROS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select>
                  <Label className="text-xs font-bold uppercase">Capacidad Máxima</Label>
                  <Input type="number" value={formData.capacidad} onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })} />
                </div>
              </div>
              <DialogFooter><DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose><Button type="submit">Guardar Cambios</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
