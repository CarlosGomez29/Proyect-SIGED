
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
  Users,
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  GraduationCap,
  BookOpen,
  Link as LinkIcon,
  ExternalLink,
  FileText,
  Loader2,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Firebase imports
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, where, getDocs } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Función para calcular la edad dinámicamente
function calculateAge(birthday: string) {
  if (!birthday) return "N/A";
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return isNaN(age) ? "N/A" : age;
}

// Subcomponente para mostrar asignaturas basadas en secciones
function DocenteSeccionesList({ docenteId }: { docenteId: string }) {
    const db = useFirestore();
    const q = useMemo(() => {
        if (!db || !docenteId) return null;
        return query(collection(db, "secciones"), where("docenteId", "==", docenteId));
    }, [db, docenteId]);

    const { data: secciones, loading } = useCollection(q);

    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;

    const cursosUnicos = Array.from(new Set(secciones?.map(s => s.curso) || []));

    if (cursosUnicos.length === 0) return <p className="text-sm font-semibold text-muted-foreground italic">No tiene secciones asignadas actualmente.</p>;

    return (
        <div className="flex flex-wrap gap-2">
            {cursosUnicos.map((curso, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] font-bold py-1 px-3 rounded-lg border-border/50">
                    {curso}
                </Badge>
            ))}
        </div>
    );
}

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
  
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    foto_perfil: "",
    fecha_ingreso: "",
    escuelaId: "",
    rango_militar: "",
    profesion: "",
    institucion: "",
    sexo: "Masculino",
    estado_civil: "Soltero",
    cantidad_hijos: "0",
    cv_url: "",
    clave_acceso: "",
    estado: "Activo",
  });

  const filteredDocentes = useMemo(() => {
    return docentes.filter((d) => {
      const matchesSearch = 
        d.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.cedula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.profesion?.toLowerCase().includes(searchTerm.toLowerCase());
      
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

    const cedulaExists = docentes.some(d => d.cedula === formData.cedula);
    const correoExists = docentes.some(d => d.correo === formData.correo);

    if (cedulaExists) {
      toast({ variant: "destructive", title: "Cédula duplicada", description: "Ya existe un docente registrado con esta cédula." });
      return;
    }

    if (correoExists) {
      toast({ variant: "destructive", title: "Correo duplicado", description: "Ya existe un docente registrado con este correo." });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const collectionRef = collection(db, "docentes");
      await addDoc(collectionRef, payload);
      
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: "Docente Registrado", description: "El docente ha sido añadido exitosamente." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Ocurrió un error al guardar." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedDocente) return;

    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(db, "docentes", selectedDocente.id);
      await updateDoc(docRef, payload);
      
      setIsEditDialogOpen(false);
      resetForm();
      toast({ title: "Docente Actualizado", description: "Los cambios han sido guardados en Firestore." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Ocurrió un error al actualizar." });
    } finally {
      setIsSaving(false);
    }
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
                description: "No es posible desactivar este docente porque está asignado a una o más secciones activas."
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
    setFormData({ 
      nombre: "", apellido: "", cedula: "", correo: "", telefono: "", direccion: "", 
      fecha_nacimiento: "", foto_perfil: "", fecha_ingreso: "", escuelaId: "", 
      rango_militar: "", profesion: "", institucion: "", 
      sexo: "Masculino", estado_civil: "Soltero", cantidad_hijos: "0", 
      cv_url: "",
      clave_acceso: "", estado: "Activo" 
    });
    setSelectedDocente(null);
  };

  const openEdit = (docente: any) => {
    setSelectedDocente(docente);
    setFormData({
      nombre: docente.nombre || "",
      apellido: docente.apellido || "",
      cedula: docente.cedula || "",
      correo: docente.correo || "",
      telefono: docente.telefono || "",
      direccion: docente.direccion || "",
      fecha_nacimiento: docente.fecha_nacimiento || "",
      foto_perfil: docente.foto_perfil || "",
      fecha_ingreso: docente.fecha_ingreso || "",
      escuelaId: docente.escuelaId || "",
      rango_militar: docente.rango_militar || "",
      profesion: docente.profesion || "",
      institucion: docente.institucion || "",
      sexo: docente.sexo || "Masculino",
      estado_civil: docente.estado_civil || "Soltero",
      cantidad_hijos: docente.cantidad_hijos?.toString() || "0",
      cv_url: docente.cv_url || "",
      clave_acceso: docente.clave_acceso || "",
      estado: docente.estado || "Activo",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <motion.div className="space-y-8 pb-10" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-black font-headline tracking-tighter">Módulo de Docentes</h1>
          </div>
          <p className="text-muted-foreground font-medium text-sm">Registro integral y perfil extendido de docentes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-9">
            <FileDown className="mr-2 h-4 w-4" /> Exportar
          </Button>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetForm} className="font-bold shadow-lg shadow-primary/20 uppercase tracking-wider text-[10px] h-9">
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Docente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] p-0 overflow-hidden">
              <DialogHeader className="p-8 bg-muted/30">
                <DialogTitle className="text-2xl font-black">Expediente de Docente</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground font-medium">Complete el perfil institucional del nuevo docente.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-8 h-12">
                    <TabsTrigger value="personal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Personal</TabsTrigger>
                    <TabsTrigger value="contacto" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Contacto</TabsTrigger>
                    <TabsTrigger value="laboral" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Laboral / Académico</TabsTrigger>
                    <TabsTrigger value="institucional" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Institucional</TabsTrigger>
                  </TabsList>

                  <div className="p-8 space-y-6">
                    <TabsContent value="personal" className="mt-0 space-y-4 text-left">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><Label>Nombre(s) *</Label><Input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Apellido(s) *</Label><Input required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Cédula *</Label><Input required value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Fecha de Nacimiento</Label><Input type="date" value={formData.fecha_nacimiento} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} /></div>
                          <div className="space-y-2">
                            <Label>Edad</Label>
                            <Input disabled value={calculateAge(formData.fecha_nacimiento)} className="bg-muted font-bold" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Sexo</Label>
                          <Select value={formData.sexo} onValueChange={v => setFormData({...formData, sexo: v})}>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Femenino">Femenino</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Estado Civil</Label>
                          <Select value={formData.estado_civil} onValueChange={v => setFormData({...formData, estado_civil: v})}>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Soltero">Soltero/a</SelectItem>
                              <SelectItem value="Casado">Casado/a</SelectItem>
                              <SelectItem value="Divorciado">Divorciado/a</SelectItem>
                              <SelectItem value="Viudo">Viudo/a</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label>Cantidad de Hijos</Label><Input type="number" min="0" value={formData.cantidad_hijos} onChange={e => setFormData({...formData, cantidad_hijos: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Foto de Perfil (URL)</Label><Input placeholder="https://..." value={formData.foto_perfil} onChange={e => setFormData({...formData, foto_perfil: e.target.value})} /></div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contacto" className="mt-0 space-y-4 text-left">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><Label>Correo Electrónico *</Label><Input type="email" required value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Teléfono</Label><Input value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
                        <div className="space-y-2 col-span-2"><Label>Dirección Residencial</Label><Input value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} /></div>
                      </div>
                    </TabsContent>

                    <TabsContent value="laboral" className="mt-0 space-y-4 text-left">
                      <div className="grid grid-cols-1 gap-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Formación profesional</Label>
                                <Input value={formData.profesion} onChange={e => setFormData({...formData, profesion: e.target.value})} />
                                <p className="text-[10px] text-muted-foreground italic">Carrera que estudió el docente.</p>
                            </div>
                            <div className="space-y-2"><Label>Fecha de Ingreso</Label><Input type="date" value={formData.fecha_ingreso} onChange={e => setFormData({...formData, fecha_ingreso: e.target.value})} /></div>
                        </div>
                        
                        <div className="space-y-4 p-6 border rounded-2xl bg-muted/20">
                          <Label className="text-sm font-bold flex items-center gap-2"><FileText className="h-4 w-4" /> Currículum Vitae (Enlace / Portafolio)</Label>
                          <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-bold opacity-60">Enlace directo al currículum</Label>
                              <div className="relative">
                                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="https://..." className="pl-10 h-10" value={formData.cv_url} onChange={e => setFormData({...formData, cv_url: e.target.value})} />
                              </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="institucional" className="mt-0 space-y-4 text-left">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><Label>Institución de Origen</Label><Input placeholder="Ej. Fuerzas Armadas" value={formData.institucion} onChange={e => setFormData({...formData, institucion: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Rango Militar (Opcional)</Label><Input value={formData.rango_militar} onChange={e => setFormData({...formData, rango_militar: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Escuela (Referencia ID)</Label><Input placeholder="ID de la escuela" value={formData.escuelaId} onChange={e => setFormData({...formData, escuelaId: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Clave de Acceso Temporal</Label><Input type="password" value={formData.clave_acceso} onChange={e => setFormData({...formData, clave_acceso: e.target.value})} /></div>
                      </div>
                    </TabsContent>
                  </div>

                  <DialogFooter className="p-8 bg-muted/30 border-t">
                    <DialogClose asChild><Button variant="ghost" disabled={isSaving}>Cancelar</Button></DialogClose>
                    <Button type="submit" disabled={isSaving} className="font-bold uppercase tracking-widest text-[10px] px-8">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : 'Finalizar Registro'}
                    </Button>
                  </DialogFooter>
                </Tabs>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre, cédula o formación..." 
            className="pl-12 h-12 bg-card/50 border-border/50 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
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
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Docente</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Cédula</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60">Formación profesional</TableHead>
                    <TableHead className="font-bold py-5 text-[10px] uppercase tracking-widest opacity-60 text-center">Estado</TableHead>
                    <TableHead className="font-bold py-5 pr-8 text-[10px] uppercase tracking-widest opacity-60 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDocentes.map((d, index) => (
                    <TableRow key={d.id} className="hover:bg-muted/20 border-border/50 transition-colors">
                      <TableCell className="py-6 pl-8 font-bold text-xs text-muted-foreground">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/50">
                            <AvatarImage src={d.foto_perfil} />
                            <AvatarFallback><UserCircle className="h-5 w-5 text-muted-foreground opacity-50" /></AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs">{d.nombre} {d.apellido}</span>
                            <span className="text-[10px] opacity-60">{d.correo}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 font-mono text-xs opacity-80">{d.cedula}</TableCell>
                      <TableCell className="py-6 font-medium text-xs truncate max-w-[180px]">{d.profesion || "N/A"}</TableCell>
                      <TableCell className="py-6 text-center">
                        <Badge className={`font-bold px-3 ${d.estado === 'Activo' ? 'bg-success/15 text-success border-success/20' : 'bg-destructive/15 text-destructive border-destructive/20'}`}>
                          {d.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6 pr-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl p-2 shadow-2xl">
                             <DropdownMenuLabel className="text-[9px] font-bold uppercase opacity-50 px-2">Acciones de Perfil</DropdownMenuLabel>
                             <DropdownMenuItem onClick={() => setSelectedDocente(d) || setIsViewDialogOpen(true)} className="cursor-pointer text-xs"><Eye className="h-4 w-4 mr-2" /> Ver Expediente</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => openEdit(d)} className="cursor-pointer text-xs"><Edit className="h-4 w-4 mr-2" /> Editar Datos</DropdownMenuItem>
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

      {/* Expediente Completo */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[1.5rem] p-0 overflow-hidden text-left border-none shadow-2xl">
          <DialogHeader className="p-8 bg-primary/5 border-b border-border/50 text-left">
            <div className="flex items-center gap-6">
               <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                  {selectedDocente?.foto_perfil ? (
                    <Avatar className="h-full w-full">
                      <AvatarImage src={selectedDocente.foto_perfil} className="object-cover" />
                      <AvatarFallback><UserCircle className="h-12 w-12 text-primary" /></AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserCircle className="h-12 w-12 text-primary" />
                  )}
               </div>
               <div className="text-left space-y-1">
                  <DialogTitle className="text-3xl font-black font-headline tracking-tighter text-foreground">
                    {selectedDocente?.nombre} {selectedDocente?.apellido}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedDocente?.estado === 'Activo' ? 'success' : 'destructive'} className="font-bold uppercase tracking-widest text-[9px] px-3">
                      {selectedDocente?.estado}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">• Registro Institucional</span>
                  </div>
               </div>
            </div>
          </DialogHeader>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-sm max-h-[60vh] overflow-y-auto">
            
            {/* SECCIÓN PERSONAL */}
            <section className="space-y-5">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-2 border-b border-primary/10 pb-2 mb-4">
                  <UserCircle className="h-4 w-4"/> Datos Personales
              </h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Cédula de Identidad</Label>
                  <p className="font-bold text-foreground text-base tracking-tight">{selectedDocente?.cedula}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">F. de Nacimiento</Label>
                    <p className="font-bold text-foreground">{selectedDocente?.fecha_nacimiento || "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Edad Actual</Label>
                    <p className="font-black text-primary text-base">{calculateAge(selectedDocente?.fecha_nacimiento)} años</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Sexo y Estado Civil</Label>
                  <p className="font-bold text-foreground">{selectedDocente?.sexo} — {selectedDocente?.estado_civil}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Hijos</Label>
                  <p className="font-bold text-foreground">{selectedDocente?.cantidad_hijos || "0"}</p>
                </div>
              </div>
            </section>

            {/* SECCIÓN CONTACTO */}
            <section className="space-y-5">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-2 border-b border-primary/10 pb-2 mb-4">
                  <Mail className="h-4 w-4"/> Contacto
              </h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Correo Electrónico</Label>
                  <p className="font-bold text-foreground break-all">{selectedDocente?.correo}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Teléfono</Label>
                  <p className="font-bold text-foreground">{selectedDocente?.telefono || "N/A"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Dirección Residencial</Label>
                  <p className="font-bold text-foreground text-xs leading-relaxed">{selectedDocente?.direccion || "N/A"}</p>
                </div>
              </div>
            </section>

            {/* PERFIL LABORAL */}
            <section className="space-y-5">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-2 border-b border-primary/10 pb-2 mb-4">
                  <Briefcase className="h-4 w-4"/> Perfil Laboral
              </h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Formación profesional</Label>
                  <p className="font-bold text-foreground">{selectedDocente?.profesion || "N/A"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Fecha de Ingreso</Label>
                  <p className="font-bold text-foreground">{selectedDocente?.fecha_ingreso || "N/A"}</p>
                </div>
                
                <div className="flex flex-col gap-1 pt-2">
                    <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Cursos que Imparte</Label>
                    <div className="pt-2">
                        <DocenteSeccionesList docenteId={selectedDocente?.id} />
                    </div>
                </div>

                {selectedDocente?.cv_url && (
                   <div className="flex flex-col gap-1 pt-2">
                      <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Currículum / Portafolio</Label>
                      <Button asChild variant="link" className="p-0 h-auto font-black text-xs text-primary hover:text-primary/80 flex items-center gap-1.5 justify-start transition-colors">
                        <a href={selectedDocente.cv_url} target="_blank" rel="noopener noreferrer">
                          Ver Portafolio Digital <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                   </div>
                )}
              </div>
            </section>

            {/* INSTITUCIONAL */}
            <section className="space-y-5">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-2 border-b border-primary/10 pb-2 mb-4">
                  <Shield className="h-4 w-4"/> Institucional
              </h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Institución de Origen</Label>
                  <p className="font-bold text-foreground">{selectedDocente?.institucion || "Sociedad Civil"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Rango Militar / Policial</Label>
                  <p className="font-bold text-foreground">{selectedDocente?.rango_militar || "N/A"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase opacity-50 tracking-wider">ID de Escuela</Label>
                  <p className="font-mono text-xs font-black bg-muted px-3 py-1 rounded-lg w-fit text-primary">{selectedDocente?.escuelaId || "Sin Asignar"}</p>
                </div>
              </div>
            </section>
          </div>
          <DialogFooter className="p-8 bg-muted/30 border-t border-border/50">
            <DialogClose asChild>
              <Button variant="outline" className="font-bold uppercase tracking-widest text-[10px] px-10 h-11 rounded-xl shadow-inner">
                Cerrar Expediente
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editar Perfil */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] p-0 overflow-hidden text-left">
          <DialogHeader className="p-8 bg-muted/30 text-left">
            <DialogTitle className="text-2xl font-black">Modificar Docente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-8 h-12">
                <TabsTrigger value="personal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Personal</TabsTrigger>
                <TabsTrigger value="contacto" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Contacto</TabsTrigger>
                <TabsTrigger value="laboral" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Laboral</TabsTrigger>
                <TabsTrigger value="institucional" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Institucional</TabsTrigger>
              </TabsList>

              <div className="p-8 space-y-6 text-left">
                <TabsContent value="personal" className="mt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Nombre(s)</Label><Input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Apellido(s)</Label><Input required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Cédula</Label><Input required value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Fecha de Nacimiento</Label><Input type="date" value={formData.fecha_nacimiento} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} /></div>
                      <div className="space-y-2">
                        <Label>Edad</Label>
                        <Input disabled value={calculateAge(formData.fecha_nacimiento)} className="bg-muted font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Sexo</Label>
                      <Select value={formData.sexo} onValueChange={v => setFormData({...formData, sexo: v})}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estado Civil</Label>
                      <Select value={formData.estado_civil} onValueChange={v => setFormData({...formData, estado_civil: v})}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Soltero">Soltero/a</SelectItem>
                          <SelectItem value="Casado">Casado/a</SelectItem>
                          <SelectItem value="Divorciado">Divorciado/a</SelectItem>
                          <SelectItem value="Viudo">Viudo/a</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contacto" className="mt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Correo Electrónico</Label><Input type="email" required value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Teléfono</Label><Input value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
                    <div className="space-y-2 col-span-2"><Label>Dirección Residencial</Label><Input value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} /></div>
                  </div>
                </TabsContent>

                <TabsContent value="laboral" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 gap-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Formación profesional</Label>
                            <Input value={formData.profesion} onChange={e => setFormData({...formData, profesion: e.target.value})} />
                            <p className="text-[10px] text-muted-foreground italic">Carrera que estudió el docente.</p>
                        </div>
                        <div className="space-y-2"><Label>Fecha de Ingreso</Label><Input type="date" value={formData.fecha_ingreso} onChange={e => setFormData({...formData, fecha_ingreso: e.target.value})} /></div>
                    </div>
                    
                    <div className="space-y-4 p-6 border rounded-2xl bg-muted/20">
                        <Label className="text-sm font-bold flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Currículum Vitae (Enlace / Portafolio)</Label>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase opacity-60">Actualizar enlace directo</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="https://..." className="pl-10 h-10" value={formData.cv_url} onChange={e => setFormData({...formData, cv_url: e.target.value})} />
                            </div>
                        </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="institucional" className="mt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Rango Militar</Label><Input value={formData.rango_militar} onChange={e => setFormData({...formData, rango_militar: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Institución</Label><Input value={formData.institucion} onChange={e => setFormData({...formData, institucion: e.target.value})} /></div>
                  </div>
                </TabsContent>
              </div>

              <DialogFooter className="p-8 bg-muted/30 border-t">
                <DialogClose asChild><Button variant="ghost" disabled={isSaving}>Cancelar</Button></DialogClose>
                <Button type="submit" disabled={isSaving} className="font-bold uppercase tracking-widest text-[10px] px-8">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : 'Guardar Cambios'}
                </Button>
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
