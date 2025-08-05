"use client";
import {
    ArrowRight,
    Users,
    ClipboardCheck,
    BookOpen,
    GraduationCap,
    MoreHorizontal
  } from "lucide-react";
  
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
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
  } from "@/components/ui/dropdown-menu";
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { EnrollmentChart } from "@/components/enrollment-chart";
  import { motion } from "framer-motion";
  
  const statCards = [
    { title: "Nuevos Alumnos", value: "150", delta: "+11%", color: "bg-blue-500", icon: Users, chart: <EnrollmentChart type="bar" /> },
    { title: "Cursos Activos", value: "22", delta: "-0.5%", color: "bg-purple-500", icon: BookOpen, chart: <EnrollmentChart type="pie" /> },
    { title: "Certificados Emitidos", value: "3", delta: "+9%", color: "bg-red-500", icon: GraduationCap, chart: <EnrollmentChart type="bar" /> },
    { title: "Inscripciones Pendientes", value: "5", delta: "+31%", color: "bg-green-500", icon: ClipboardCheck, chart: <EnrollmentChart type="pie" /> },
  ];

  const recentEnrollments = [
      { name: "Abdullah Al Ahad", status: "Pendiente", course: "Seguridad de la Carga Aérea", date: "03.01.2024", time: "10:00 AM", avatar: "https://placehold.co/40x40.png" },
      { name: "Al Shahriar Shawon", status: "Aprobado", course: "Mercancías Peligrosas", date: "03.01.2024", time: "10:20 AM", avatar: "https://placehold.co/40x40.png" },
      { name: "Lyn R. Ramos", status: "Aprobado", course: "AVSEC para la Tripulación", date: "03.01.2024", time: "10:40 AM", avatar: "https://placehold.co/40x40.png" },
      { name: "Katherine A. Stanfill", status: "Pendiente", course: "Manejo de Crisis", date: "03.01.2024", time: "11:00 AM", avatar: "https://placehold.co/40x40.png" },
      { name: "Robert K. Panez", status: "Rechazado", course: "Seguridad Aeroportuaria", date: "03.01.2024", time: "11:20 AM", avatar: "https://placehold.co/40x40.png" },
      { name: "Jason L. Bowling", status: "Aprobado", course: "Seguridad de la Carga Aérea", date: "03.01.2024", time: "11:40 AM", avatar: "https://placehold.co/40x40.png" },
      { name: "Joseph A. Bove", status: "Aprobado", course: "Mercancías Peligrosas", date: "03.01.2024", time: "12:00 PM", avatar: "https://placehold.co/40x40.png" },
  ];
  
  export default function DashboardAdminPage() {
    return (
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl font-semibold">Resumen General</h1>
  
        {/* Stat Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`text-white ${card.color}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <p className="text-3xl font-bold">{card.value}</p>
                        <p className="text-xs opacity-80">Hoy</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span>{card.delta}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
  
        {/* Recent Enrollments Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Inscripciones de Hoy</CardTitle>
                    <CardDescription>150 inscripciones en total</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Nombre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className="text-right">Hora</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {recentEnrollments.map((enrollment) => (
                            <TableRow key={enrollment.name}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={enrollment.avatar} alt={enrollment.name} />
                                            <AvatarFallback>{enrollment.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{enrollment.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        variant={enrollment.status === 'Aprobado' ? 'default' : enrollment.status === 'Pendiente' ? 'secondary' : 'destructive'}
                                        className={
                                            enrollment.status === 'Aprobado' ? 'bg-green-100 text-green-800' :
                                            enrollment.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                                            'bg-red-100 text-red-800'
                                        }
                                    >
                                        {enrollment.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{enrollment.course}</TableCell>
                                <TableCell>{enrollment.date}</TableCell>
                                <TableCell className="text-right">{enrollment.time}</TableCell>
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                                        <DropdownMenuItem>Aprobar</DropdownMenuItem>
                                        <DropdownMenuItem>Rechazar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <div className="p-4 border-t">
                    <CustomPagination />
                </div>
            </Card>
        </motion.section>
      </div>
    );
  }

  function CustomPagination() {
      return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
                Mostrando 7 de 150 registros
            </div>
            <Pagination className="w-auto mx-0">
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                 <PaginationItem>
                    <PaginationLink href="#">...</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">25</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
      )
  }
  