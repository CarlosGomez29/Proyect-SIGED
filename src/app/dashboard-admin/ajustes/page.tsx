
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { RefreshCw, ShieldAlert, Database, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Firebase imports
import { useFirestore } from '@/firebase';
import { doc, setDoc, collection, writeBatch, getDocs, query, limit } from 'firebase/firestore';

const RANGOS_MILITARES_DEFAULT = [
    { nombre: "Civil", orden: 1 },
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

export default function AjustesPage() {
    const { toast } = useToast();
    const db = useFirestore();

    const [isSeeding, setIsSeeding] = useState(false);
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

    const handleSeedRangos = async () => {
        if (!db) return;
        setIsSeeding(true);
        try {
            // Verificar si ya existen rangos para evitar duplicados
            const rangosRef = collection(db, "rangos_militares");
            const snapshot = await getDocs(query(rangosRef, limit(1)));
            
            if (!snapshot.empty) {
                toast({ 
                    title: "Información", 
                    description: "El catálogo de rangos ya ha sido inicializado anteriormente." 
                });
                setIsSeeding(false);
                return;
            }

            const batch = writeBatch(db);
            RANGOS_MILITARES_DEFAULT.forEach((rango) => {
                const docRef = doc(collection(db, "rangos_militares"));
                batch.set(docRef, rango);
            });
            await batch.commit();
            toast({ 
                title: "Catálogo Inicializado", 
                description: "Se han cargado los 15 rangos militares correctamente en Firestore." 
            });
        } catch (error) {
            toast({ 
                variant: "destructive", 
                title: "Error de inicialización", 
                description: "No se pudo cargar el catálogo de rangos. Revise sus permisos." 
            });
        } finally {
            setIsSeeding(false);
        }
    };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
                            <CardTitle className="text-destructive">Mantenimiento de Secuencias</CardTitle>
                        </div>
                        <CardDescription>Acciones de bajo nivel para corregir o reiniciar identificadores institucionales.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/10 bg-destructive/5">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Reiniciar Secuencia de Secciones</h4>
                                <p className="text-xs text-muted-foreground max-w-md">
                                    Restaura el contador a cero. Al confirmar, la próxima sección que se cree en el módulo de Apertura tendrá el código <strong>SEC-0001</strong>. 
                                </p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reiniciar Contador
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-destructive">¿Confirmar reinicio de secuencia?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción establecerá el contador en 0. La siguiente sección creada será la <strong>SEC-0001</strong>. 
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleResetCounter} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Confirmar Reinicio
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            <CardTitle>Inicialización de Catálogos</CardTitle>
                        </div>
                        <CardDescription>Poblar la base de datos con valores predeterminados del sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-xl border">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Poblar Rangos Militares</h4>
                                <p className="text-xs text-muted-foreground">
                                    Crea el catálogo oficial de rangos militares en Firestore para su uso en formularios.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSeedRangos} disabled={isSeeding}>
                                {isSeeding ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                                ) : (
                                    <><Database className="mr-2 h-4 w-4" /> Inicializar Rangos</>
                                )}
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
