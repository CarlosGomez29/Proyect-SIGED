
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';
import { FileText, BarChart2, Users, GraduationCap } from "lucide-react";
import { EnrollmentChart } from '@/components/enrollment-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const reportTypes = [
  { value: "alumnos_por_curso", label: "Alumnos por Curso", icon: Users },
  { value: "asistencia", label: "Reporte de Asistencia", icon: BarChart2 },
  { value: "certificados_emitidos", label: "Certificados Emitidos", icon: GraduationCap },
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

const reportData = {
    alumnos_por_curso: [
        { curso: "Seguridad de la Carga Aérea", alumnos: 25 },
        { curso: "Mercancías Peligrosas", alumnos: 18 },
        { curso: "AVSEC para Tripulación", alumnos: 32 },
    ],
    certificados_emitidos: [
        { alumno: "Juan Pérez", curso: "Seguridad de la Carga Aérea", fecha: "2024-05-10" },
        { alumno: "María García", curso: "Mercancías Peligrosas", fecha: "2024-05-12" },
    ]
}

export default function ReportesPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<any[] | null>(null);

  const handleGenerateReport = () => {
      if (selectedReport === 'alumnos_por_curso') {
          setGeneratedReport(reportData.alumnos_por_curso);
      } else if (selectedReport === 'certificados_emitidos') {
          setGeneratedReport(reportData.certificados_emitidos);
      } else {
          setGeneratedReport(null);
      }
  }

  const renderReport = () => {
      if (!generatedReport) return <p className="text-center text-muted-foreground mt-8">Seleccione un tipo de reporte y haga clic en "Generar".</p>;

      if (selectedReport === 'alumnos_por_curso') {
          return (
            <Table>
                <TableHeader><TableRow><TableHead>Curso</TableHead><TableHead className="text-right">Nº de Alumnos</TableHead></TableRow></TableHeader>
                <TableBody>
                    {generatedReport.map(row => (
                        <TableRow key={row.curso}><TableCell>{row.curso}</TableCell><TableCell className="text-right">{row.alumnos}</TableCell></TableRow>
                    ))}
                </TableBody>
            </Table>
          )
      }
       if (selectedReport === 'certificados_emitidos') {
          return (
            <Table>
                <TableHeader><TableRow><TableHead>Alumno</TableHead><TableHead>Curso</TableHead><TableHead className="text-right">Fecha de Emisión</TableHead></TableRow></TableHeader>
                <TableBody>
                    {generatedReport.map(row => (
                        <TableRow key={row.alumno}><TableCell>{row.alumno}</TableCell><TableCell>{row.curso}</TableCell><TableCell className="text-right">{row.fecha}</TableCell></TableRow>
                    ))}
                </TableBody>
            </Table>
          )
      }
       if (selectedReport === 'asistencia') {
           return <div className="h-64"><EnrollmentChart /></div>
       }

      return null;
  }

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Generación de Reportes</h1>
        <p className="text-muted-foreground">Crea análisis y resúmenes de la actividad de la escuela.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Panel de Control</CardTitle>
              <CardDescription>Selecciona un reporte para generar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo de Reporte</label>
                <Select onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar reporte..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((report) => (
                      <SelectItem key={report.value} value={report.value}>
                        <div className="flex items-center gap-2">
                           <report.icon className="h-4 w-4" /> 
                           <span>{report.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerateReport} className="w-full" disabled={!selectedReport}>
                <FileText className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="min-h-[300px]">
            <CardHeader>
              <CardTitle>Vista del Reporte</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReport()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

    