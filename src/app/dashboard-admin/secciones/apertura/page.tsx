
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
  XCircle,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

// Datos maestros (Simulados para la arquitectura)
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
    horario: "Lun-Vie 08:00 - 12:00",
    estado: "Abierta",
    inscritos: 32,
    capacidad: 40,
  },
  {
    id: "SEC-002",
    curso: "Mercancías Peligrosas",
    programa: "DIGEP-INFOTEP",
    docente: "María García",
    horario: "Sáb 09:00 - 17:00",
    estado: "En proceso",
    inscritos: 15,
    capacidad: 20,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estados del formulario
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
    PERIODOS_MAESTROS.find(p => p.id === formData.periodoId),
    [formData.periodoId]
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const filteredSecciones = secciones.filter(
    (s) =>
      s.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.docente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSeccion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.periodoId || !formData.curso || !formData.docente || formData.dias.length === 0) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos obligatorios.",
      });
      return;
    }

    const newId = `SEC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const diasStr = formData.dias.map(d => DIAS_SEMANA.find(ds => ds.id === d)?.label.substring(0, 3)).join('-');
    
    const newSeccion = {
      id: newId,
      curso: formData.curso,
      programa: "DIGEP Directo",
      docente: formData.docente,
      horario: `${diasStr} ${formData.horaInicio} - ${formData.horaFin}`,
      estado: formData.estado,
      inscritos: 0,
      capacidad: parseInt(formData.capacidad),
    };

    setSecciones([newSeccion, ...secciones]);
    setIsDialogOpen(false);
    setFormData({
      periodoId: "",
      curso: "",
      docente: "",
      capacidad: "40",
      dias: [],
      horaInicio: "08:00",
      horaFin: "12:00",
      estado: "Abierta",
    });

    toast({
      title: "Sección creada",
      description: `La sección ${newId} ha sido creada exitosamente.`,
    });
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Abierta":
        return <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/20 font-bold px-3">Abierta</Badge>;
      case "En proceso":
        return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 font-bold px-3">En proceso</Badge>;
      case "Cerrada":
        return <Badge className="bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20 font-bold px-3">Cerrada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const calculateOcupacion = (inscritos: number, capacidad: number) => {
    return Math.round((inscritos / capacidad) * 100);
  };

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* 1. Encabezado del módulo */}
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
          <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-9">
            <FileDown className="mr-2 h-4 w-4" /> Exportar
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="font-bold shadow-lg shadow-primary/20 uppercase tracking-wider text-[10px] h-9">
                <PlusCircle className="mr-2 h-4 w-4" /> Nueva Sección
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-border/50 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight text-foreground">Nueva Sección Académica</DialogTitle>
                <DialogDescription className="font-medium text-muted-foreground">
                  Configura los detalles de la nueva oferta académica para el período seleccionado.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateSeccion} className="space-y-8 py-6">
                {/* BLOQUE 1 — Información Académica */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    Bloque 1: Información Académica
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="periodo" className="text-xs font-bold uppercase opacity-60">Período Académico</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, periodoId: val })}>
                        <SelectTrigger className="rounded-xl border-border/50 h-11 bg-background/50">
                          <SelectValue placeholder="Seleccionar período..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {PERIODOS_MAESTROS.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="curso" className="text-xs font-bold uppercase opacity-60">Curso</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, curso: val })}>
                        <SelectTrigger className="rounded-xl border-border/50 h-11 bg-background/50">
                          <SelectValue placeholder="Seleccionar curso..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {CURSOS_MAESTROS.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="docente" className="text-xs font-bold uppercase opacity-60">Docente Asignado</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, docente: val })}>
                        <SelectTrigger className="rounded-xl border-border/50 h-11 bg-background/50">
                          <SelectValue placeholder="Buscar docente..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {DOCENTES_MAESTROS.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* BLOQUE 2 — Configuración de la Sección */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    Bloque 2: Configuración de la Sección
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="capacidad" className="text-xs font-bold uppercase opacity-60">Capacidad Máxima</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="capacidad" 
                          type="number" 
                          min="1" 
                          className="pl-10 h-11 rounded-xl bg-background/50" 
                          value={formData.capacidad}
                          onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase opacity-60">Días de Clase</Label>
                      <div className="flex flex-wrap gap-3">
                        {DIAS_SEMANA.map((dia) => (
                          <div key={dia.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={dia.id} 
                              checked={formData.dias.includes(dia.id)}
                              onCheckedChange={(checked) => {
                                const newDias = checked 
                                  ? [...formData.dias, dia.id]
                                  : formData.dias.filter(d => d !== dia.id);
                                setFormData({ ...formData, dias: newDias });
                              }}
                            />
                            <label htmlFor={dia.id} className="text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors">{dia.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Horario - Ahora ocupa el ancho completo para evitar solapamientos */}
                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-xs font-bold uppercase opacity-60">Horario de Clase (Rango 08:00 - 18:00)</Label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
                        <div className="flex-1 space-y-1.5">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Entrada</span>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="time" 
                              min="08:00" 
                              max="18:00" 
                              className="pl-10 h-11 rounded-xl bg-background" 
                              value={formData.horaInicio}
                              onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center justify-center pt-6">
                          <span className="text-muted-foreground opacity-50 font-bold">→</span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Salida</span>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="time" 
                              min="08:00" 
                              max="18:00" 
                              className="pl-10 h-11 rounded-xl bg-background" 
                              value={formData.horaFin}
                              onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fechas - Ocupa el ancho completo con formato DD/MM/YYYY */}
                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-xs font-bold uppercase opacity-60">Vigencia del Período (Fechas Automáticas)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">Inicio de Docencia</span>
                          <div className="h-11 flex items-center px-4 rounded-xl bg-background font-mono text-sm border border-border/30 text-foreground">
                            {formatDate(selectedPeriodo?.inicio || "") || "---"}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">Fin de Docencia</span>
                          <div className="h-11 flex items-center px-4 rounded-xl bg-background font-mono text-sm border border-border/30 text-foreground">
                            {formatDate(selectedPeriodo?.fin || "") || "---"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BLOQUE 3 — Estado */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    Bloque 3: Estado Inicial
                  </div>
                  <Select value={formData.estado} onValueChange={(val) => setFormData({ ...formData, estado: val })}>
                    <SelectTrigger className="rounded-xl border-border/50 h-11 bg-background/50">
                      <SelectValue placeholder="Estado de la sección..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Abierta">Abierta (Disponible para inscripciones)</SelectItem>
                      <SelectItem value="En proceso">En proceso (Requiere validación)</SelectItem>
                      <SelectItem value="Cerrada">Cerrada (No disponible)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="gap-3 pt-8 border-t border-border/30">
                  <DialogClose asChild>
                    <Button variant="ghost" className="rounded-xl font-bold uppercase text-[10px] tracking-widest h-11 px-6">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" className="rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 h-11 px-10">Crear Sección Académica</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* 2. Barra de búsqueda */}
      <motion.div variants={itemVariants} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Buscar por curso, docente o programa..."
          className="pl-12 h-14 bg-card/50 border-border/50 focus:bg-card transition-all text-lg rounded-2xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* 3. Listado principal */}
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
                {filteredSecciones.map((seccion) => {
                  const ocupacionPorcentaje = calculateOcupacion(seccion.inscritos, seccion.capacidad);
                  return (
                    <TableRow key={seccion.id} className="group hover:bg-muted/20 border-border/50 transition-colors">
                      <TableCell className="py-6 pl-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground tracking-tight">{seccion.curso}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{seccion.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 font-medium text-sm text-muted-foreground">{seccion.programa}</TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                            <span className="text-[10px] font-bold text-primary">{seccion.docente.charAt(0)}</span>
                          </div>
                          <span className="font-semibold text-sm">{seccion.docente}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 text-xs font-medium text-muted-foreground leading-relaxed">{seccion.horario}</TableCell>
                      <TableCell className="py-6 text-center">{getStatusBadge(seccion.estado)}</TableCell>
                      <TableCell className="py-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className={ocupacionPorcentaje > 90 ? "text-destructive" : "text-muted-foreground uppercase"}>
                              {seccion.inscritos} de {seccion.capacidad}
                            </span>
                            <span className="text-foreground">{ocupacionPorcentaje}%</span>
                          </div>
                          <Progress 
                            value={ocupacionPorcentaje} 
                            className={`h-1.5 ${ocupacionPorcentaje > 90 ? "bg-destructive/10" : "bg-muted"}`} 
                            indicatorClassName={ocupacionPorcentaje > 90 ? "bg-destructive" : "bg-primary"}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-6 pr-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 p-2 shadow-xl">
                            <DropdownMenuItem className="rounded-lg flex items-center gap-2 py-2 cursor-pointer">
                              <Eye className="h-4 w-4 opacity-70" />
                              <span className="font-medium text-sm">Ver detalles</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg flex items-center gap-2 py-2 cursor-pointer">
                              <Edit className="h-4 w-4 opacity-70" />
                              <span className="font-medium text-sm">Editar sección</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="opacity-50" />
                            <DropdownMenuItem className="rounded-lg flex items-center gap-2 py-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <XCircle className="h-4 w-4" />
                              <span className="font-bold text-sm">Cerrar sección</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredSecciones.length === 0 && (
              <div className="py-20 text-center space-y-3">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                <p className="text-muted-foreground font-medium">No se encontraron secciones para "{searchTerm}"</p>
                <Button variant="link" onClick={() => setSearchTerm("")} className="text-primary font-bold">
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
