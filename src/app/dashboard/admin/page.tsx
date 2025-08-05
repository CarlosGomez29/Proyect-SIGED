"use client";
import {
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
    { title: "Nuevos Alumnos", value: "150", delta: "+11%", color: "bg-blue-500", icon: Users, chartType: 'bar' },
    { title: "Cursos Activos", value: "22", delta: "-0.5%", color: "bg-purple-500", icon: BookOpen, chartType: 'pie' },
    { title: "Certificados Emitidos", value: "3", delta: "+9%", color: "bg-red-500", icon: GraduationCap, chartType: 'bar' },
    { title: "Inscripciones Pendientes", value: "5", delta: "+31%", color: "bg-green-500", icon: ClipboardCheck, chartType: 'pie' },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  
  export default function DashboardAdminPage() {
    return (
      <div className="flex-1 space-y-6">
        <motion.h1 
          className="text-2xl font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Resumen General
        </motion.h1>
  
        {/* Stat Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
            {statCards.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
              >
                <Card className={`text-white ${card.color} overflow-hidden flex flex-col`}>
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
                    <div className="flex-grow flex items-end w-full h-[60px] opacity-50">
                        <EnrollmentChart type={card.chartType as 'bar' | 'pie'} />
                    </div>
                </Card>
              </motion.div>
            ))}
        </motion.section>
  
        {/* Recent Enrollments Table */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
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
                            <TableHead className="w-[250px] hidden sm:table-cell">Nombre</TableHead>
                             <TableHead className="sm:hidden">Alumno</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="hidden md:table-cell">Curso</TableHead>
                            <TableHead className="hidden lg:table-cell text-right">Fecha</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {recentEnrollments.map((enrollment) => (
                           <motion.tr 
                              key={enrollment.name}
                              className="hover:bg-muted/50 transition-colors"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={enrollment.avatar} alt={enrollment.name} />
                                            <AvatarFallback>{enrollment.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                          <span className="font-medium">{enrollment.name}</span>
                                          <span className="text-muted-foreground text-xs md:hidden">{enrollment.course}</span>
                                        </div>
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
                                <TableCell className="hidden md:table-cell">{enrollment.course}</TableCell>
                                <TableCell className="hidden lg:table-cell text-right">{enrollment.date}</TableCell>
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
                            </motion.tr>
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
        <motion.div 
            className="flex items-center justify-between text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
        >
            <div className="hidden sm:block">
                Mostrando 7 de 150 registros
            </div>
             <div className="sm:hidden">
                7 de 150
            </div>
            <Pagination className="w-auto mx-0">
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem className="hidden sm:block">
                    <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem className="hidden sm:block">
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                 <PaginationItem className="hidden sm:block">
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
        </motion.div>
      )
  }
  