"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { RefreshCw, ShieldAlert } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Firebase imports
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AjustesPage() {
    const { toast } = useToast();
    const db = useFirestore();

    const [notifications, setNotifications] = useState({
        pendingEnrollment: true,
        courseReminders: false,
    });

    // Función para reiniciar el contador secuencial global
    const handleResetCounter = async () => {
        if (!db) return;
        try {
            const counterRef = doc(db, "metadata", "counters");
            // Ponemos el contador en 0 para que la próxima sección sea (0 + 1) = SEC-0001
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
                                <br/><br/>
                                <strong>Nota:</strong> Esta acción no borra secciones existentes, solo reinicia la numeración futura.
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md font-medium text-sm flex items-center">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reiniciar Contador
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">¿Confirmar reinicio de secuencia?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción establecerá el contador en 0. La siguiente sección creada será la <strong>SEC-0001</strong>. 
                                        Asegúrese de que esta acción es necesaria para la integridad administrativa del recinto.
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
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}