
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { RefreshCw, ShieldAlert, Database, Loader2, Landmark, Layers, Map, ShieldCheck } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Firebase imports
import { useFirestore } from '@/firebase';
import { doc, setDoc, collection, writeBatch, getDocs, query, limit, serverTimestamp } from 'firebase/firestore';

const RANGOS_MILITARES_DEFAULT = [
    { nombre: "Igualado", orden: 1 },
    { nombre: "Asimilado", orden: 2 },
    { nombre: "Raso", orden: 3 },
    { nombre: "Cabo", orden: 4 },
    { nombre: "Sargento", orden: 5 },
    { nombre: "Sargento Mayor", orden: 6 },
    { nombre: "Segundo Teniente", orden: 7 },
    { nombre: "Primer Teniente", orden: 8 },
    { nombre: "Capitán", orden: 9 },
    { nombre: "Mayor", orden: 10 },
    { nombre: "Teniente Coronel", orden: 11 },
    { nombre: "Coronel", orden: 12 },
    { nombre: "General de Brigada", orden: 13 },
    { nombre: "Mayor General", orden: 14 },
    { nombre: "Teniente General", orden: 15 },
];

const INSTITUCIONES_DEFAULT = [
    { nombre: "E.R.D.", orden: 1 },
    { nombre: "A.R.D.", orden: 2 },
    { nombre: "F.A.R.D.", orden: 3 },
    { nombre: "P.N.", orden: 4 },
    { nombre: "N/A", orden: 5 },
];

const PROGRAMAS_DEFAULT = [
    { nombre: "DIGEV-Directo", estado: "activo" },
    { nombre: "DIGEV-INFOTEP", estado: "activo" },
    { nombre: "Dominicana Digna", estado: "activo" },
    { nombre: "Oportunidad 14/24", estado: "activo" },
];

const PROVINCIAS_DEFAULT = [
  "Distrito Nacional", "Azua", "Bahoruco", "Barahona", "Dajabón", "Duarte", "Elías Piña", "El Seibo", 
  "Espaillat", "Hato Mayor", "Hermanas Mirabal", "Independencia", "La Altagracia", "La Romana", 
  "La Vega", "María Trinidad Sánchez", "Monseñor Nouel", "Monte Cristi", "Monte Plata", "Pedernales", 
  "Peravia", "Puerto Plata", "Samaná", "San Cristóbal", "San José de Ocoa", "San Juan", 
  "San Pedro de Macorís", "Sánchez Ramírez", "Santiago", "Santiago Rodríguez", "Santo Domingo", "Valverde"
];

export default function AjustesPage() {
    const { toast } = useToast();
    const db = useFirestore();

    const [isSeedingRangos, setIsSeedingRangos] = useState(false);
    const [isSeedingInstituciones, setIsSeedingInstituciones] = useState(false);
    const [isSeedingProgramas, setIsSeedingProgramas] = useState(false);
    const [isSeedingProvincias, setIsSeedingProvincias] = useState(false);
    const [isSeedingAdmin, setIsSeedingAdmin] = useState(false);
    
    const [notifications, setNotifications] = useState({
        pendingEnrollment: true,
        courseReminders: false,
    });

    const handleResetCounter = async () => {
        if (!db) return;
        try {
            const counterRef = doc(db, "metadata", "counters");
            await setDoc(counterRef, { inst_secciones_count: 0 }, { merge: true });
            toast({ 
                title: "Secuencia Reiniciada", 
                description: "El contador de Código de Sección ahora comenzará desde SEC-0001." 
            });
        } catch (error) {
            toast({ 
                variant: "destructive", 
                title: "Error al reiniciar", 
                description: "No se pudo actualizar el contador institucional en Firestore." 
            });
        }
    };

    const handleSeedSuperAdmin = async () => {
        if (!db) return;
        setIsSeedingAdmin(true);
        try {
            const adminId = "superadmin_root";
            const adminRef = doc(db, "users", adminId);
            
            // Hash SHA-256 de "123456"
            const passwordHash = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

            await setDoc(adminRef, {
                username: "superadmin",
                passwordHash: passwordHash,
                nombre: "Super",
                apellido: "Admin",
                rol: "superadmin",
                estado: "activo",
                escuelaId: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });

            toast({ title: "Acceso Restaurado", description: "Usuario 'superadmin' creado exitosamente." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo crear el superadmin." });
        } finally {
            setIsSeedingAdmin(false);
        }
    };

    const handleSeedRangos = async () => {
        if (!db) return;
        setIsSeedingRangos(true);
        try {
            const rangosRef = collection(db, "rangos_militares");
            const snapshot = await getDocs(query(rangosRef, limit(1)));
            
            if (!snapshot.empty) {
                toast({ title: "Información", description: "El catálogo de rangos ya ha sido inicializado." });
                setIsSeedingRangos(false);
                return;
            }

            const batch = writeBatch(db);
            RANGOS_MILITARES_DEFAULT.forEach((rango) => {
                const docRef = doc(collection(db, "rangos_militares"));
                batch.set(docRef, rango);
            });
            await batch.commit();
            toast({ title: "Catálogo Inicializado", description: "Se han cargado los rangos militares correctamente." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el catálogo." });
        } finally {
            setIsSeedingRangos(false);
        }
    };

    const handleSeedInstituciones = async () => {
        if (!db) return;
        setIsSeedingInstituciones(true);
        try {
            const instRef = collection(db, "instituciones");
            const snapshot = await getDocs(query(instRef, limit(1)));
            
            if (!snapshot.empty) {
                toast({ title: "Información", description: "El catálogo de instituciones ya ha sido inicializado." });
                setIsSeedingInstituciones(false);
                return;
            }

            const batch = writeBatch(db);
            INSTITUCIONES_DEFAULT.forEach((inst) => {
                const docRef = doc(collection(db, "instituciones"));
                batch.set(docRef, inst);
            });
            await batch.commit();
            toast({ title: "Catálogo Inicializado", description: "Se han cargado las instituciones oficiales." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el catálogo." });
        } finally {
            setIsSeedingInstituciones(false);
        }
    };

    const handleSeedProgramas = async () => {
        if (!db) return;
        setIsSeedingProgramas(true);
        try {
            const progRef = collection(db, "programas");
            const snapshot = await getDocs(query(progRef, limit(1)));
            
            if (!snapshot.empty) {
                toast({ title: "Información", description: "El catálogo de programas ya ha sido inicializado." });
                setIsSeedingProgramas(false);
                return;
            }

            const batch = writeBatch(db);
            PROGRAMAS_DEFAULT.forEach((prog) => {
                const docRef = doc(collection(db, "programas"));
                batch.set(docRef, { ...prog, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            });
            await batch.commit();
            toast({ title: "Catálogo Inicializado", description: "Se han cargado los programas oficiales." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el catálogo." });
        } finally {
            setIsSeedingProgramas(false);
        }
    };

    const handleSeedProvincias = async () => {
        if (!db) return;
        setIsSeedingProvincias(true);
        try {
            const provRef = collection(db, "provincias");
            const snapshot = await getDocs(query(provRef, limit(1)));
            
            if (!snapshot.empty) {
                toast({ title: "Información", description: "El catálogo de provincias ya ha sido inicializado." });
                setIsSeedingProvincias(false);
                return;
            }

            const batch = writeBatch(db);
            PROVINCIAS_DEFAULT.sort().forEach((prov) => {
                const docId = prov.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
                const docRef = doc(db, "provincias", docId);
                batch.set(docRef, { nombre: prov });
            });
            await batch.commit();
            toast({ title: "Catálogo Inicializado", description: "Se han cargado las provincias de República Dominicana correctamente." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el catálogo de provincias." });
        } finally {
            setIsSeedingProvincias(false);
        }
    };

  return (
    <motion.div className="flex flex-col gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Ajustes del Sistema</h1>
        <p className="text-muted-foreground">Configura y gestiona los parámetros globales de la aplicación.</p>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                    <CardDescription>Define qué notificaciones automáticas se envían.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="enrollment-notif">Inscripción Pendiente</Label>
                            <p className="text-sm text-muted-foreground">Enviar una notificación cuando una nueva inscripción requiere aprobación.</p>
                        </div>
                        <Switch id="enrollment-notif" checked={notifications.pendingEnrollment} onCheckedChange={(checked) => setNotifications({...notifications, pendingEnrollment: checked})}/>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="course-reminder-notif">Recordatorios de Cursos</Label>
                            <p className="text-sm text-muted-foreground">Enviar recordatorios a los alumnos sobre cursos que están por comenzar.</p>
                        </div>
                        <Switch id="course-reminder-notif" checked={notifications.courseReminders} onCheckedChange={(checked) => setNotifications({...notifications, courseReminders: checked})} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
             <div className="grid gap-6">
                <Card className="border-destructive/20">
                    <CardHeader className="bg-destructive/5">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-destructive" />
                            <CardTitle className="text-destructive">Mantenimiento Crítico</CardTitle>
                        </div>
                        <CardDescription>Acciones de bajo nivel para corregir o reiniciar identificadores institucionales y accesos.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/10 bg-destructive/5">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Reiniciar Secuencia de Secciones</h4>
                                <p className="text-xs text-muted-foreground max-w-md">Restaura el contador a cero. SEC-0001 será la siguiente.</p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm"><RefreshCw className="mr-2 h-4 w-4" />Reiniciar</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-destructive">¿Confirmar reinicio?</AlertDialogTitle>
                                        <AlertDialogDescription>Esta acción establecerá el contador en 0.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleResetCounter} className="bg-destructive">Confirmar Reinicio</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-primary/5">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Restaurar Acceso SuperAdmin</h4>
                                <p className="text-xs text-muted-foreground max-w-md">Crea o actualiza el usuario 'superadmin' con clave '123456'.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSeedSuperAdmin} disabled={isSeedingAdmin}>
                                {isSeedingAdmin ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />} Restaurar Root
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            <CardTitle>Inicialización de Catálogos</CardTitle>
                        </div>
                        <CardDescription>Poblar la base de datos con valores predeterminados.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Poblar Rangos Militares</h4>
                                <p className="text-xs text-muted-foreground">Crea el catálogo oficial de rangos militares.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSeedRangos} disabled={isSeedingRangos}>
                                {isSeedingRangos ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />} Inicializar Rangos
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Poblar Instituciones</h4>
                                <p className="text-xs text-muted-foreground">Crea el catálogo oficial de instituciones.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSeedInstituciones} disabled={isSeedingInstituciones}>
                                {isSeedingInstituciones ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Landmark className="mr-2 h-4 w-4" />} Inicializar Instituciones
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Poblar Programas</h4>
                                <p className="text-xs text-muted-foreground">Inicializa DIGEV-Directo, INFOTEP, etc.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSeedProgramas} disabled={isSeedingProgramas}>
                                {isSeedingProgramas ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Layers className="mr-2 h-4 w-4" />} Inicializar Programas
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Poblar Provincias</h4>
                                <p className="text-xs text-muted-foreground">Inicializa las 32 provincias de la República Dominicana.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSeedProvincias} disabled={isSeedingProvincias}>
                                {isSeedingProvincias ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Map className="mr-2 h-4 w-4" />} Inicializar Provincias
                            </Button>
                        </div>
                    </CardContent>
                </Card>
             </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
