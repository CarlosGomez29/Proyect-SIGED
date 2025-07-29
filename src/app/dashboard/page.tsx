"use client";

import { MoreHorizontal, Users, BookCopy, GraduationCap, DollarSign, Activity } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EnrollmentChart } from "@/components/enrollment-chart";

const recentStudents = [
  { name: "Juan Pérez", email: 'juan.perez@email.com', course: "Seguridad de la Carga Aérea", date: "2024-07-20", status: "Confirmado" },
  { name: "Maria Rodriguez", email: 'maria.rodriguez@email.com', course: "Gestión de Seguridad (AVSEC)", date: "2024-07-19", status: "Confirmado" },
  { name: "Carlos Gomez", email: 'carlos.gomez@email.com', course: "Manejo de Crisis", date: "2024-07-18", status: "Pendiente" },
  { name: "Ana Martinez", email: 'ana.martinez@email.com', course: "Inspectores Nacionales", date: "2024-07-17", status: "Confirmado" },
  { name: "Luis Fernandez", email: 'luis.fernandez@email.com', course: "Instrucción Básica", date: "2024-07-16", status: "Cancelado" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alumnos Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cursos Ofertados
            </CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +2 cursos nuevos este semestre
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevas Inscripciones</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+180</div>
            <p className="text-xs text-muted-foreground">+32 esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad Reciente</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              Interacciones en la última hora
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Inscripciones Recientes</CardTitle>
              <CardDescription>
                Listado de los últimos alumnos registrados en la plataforma.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1 bg-primary">
              <a href="#">
                Ver Todos
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumno</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Curso
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Estado
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Fecha de Inscripción
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={`https://placehold.co/40x40.png`}
                          width={40}
                          height={40}
                          alt="Avatar"
                          className="rounded-full"
                          data-ai-hint="person portrait"
                        />
                        <div className="font-medium">{student.name}
                        <div className="hidden text-sm text-muted-foreground md:inline">
                           {" "}- {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      {student.course}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge 
                        variant={student.status === "Confirmado" ? "secondary" : student.status === "Cancelado" ? "destructive" : "outline"} 
                        className={student.status === "Confirmado" ? "bg-green-100 text-green-800" : ""}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {student.date}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inscripciones por Mes</CardTitle>
            <CardDescription>
              Un análisis de las tendencias de inscripción en los últimos 6 meses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnrollmentChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
