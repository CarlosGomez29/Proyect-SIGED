
"use client";
import {
    Users,
    ClipboardCheck,
    BookOpen,
    GraduationCap,
    MoreHorizontal,
    UserCheck,
    UserX,
    BookMarked
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
  import { motion } from "framer-motion";
  import { Progress } from "@/components/ui/progress";

  const GlassmorphismIcon = ({ shape }: { shape: 'circles' | 'squares' | 'swirl' }) => {
    if (shape === 'squares') {
        return (
            <div className="relative w-24 h-24">
                <div className="absolute top-0 left-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg transform rotate-[-15deg]"></div>
                <div className="absolute top-4 left-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg transform rotate-[-15deg] shadow-lg"></div>
                <div className="absolute top-2 left-2 w-16 h-16 bg-white/30 backdrop-blur-md rounded-lg transform rotate-[-15deg] shadow-xl"></div>
            </div>
        );
    }
     if (shape === 'swirl') {
        return (
             <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute w-16 h-16">
                    <div className="absolute w-16 h-16 border-8 border-white/20 rounded-full border-t-transparent transform rotate-45"></div>
                    <div className="absolute w-12 h-12 top-2 left-2 border-8 border-white/20 rounded-full border-b-transparent transform -rotate-45"></div>
                </div>
            </div>
        )
    }
    // circles
    return (
        <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full"></div>
            <div className="absolute top-4 left-4 w-16 h-16 bg-white/30 backdrop-blur-md rounded-full shadow-lg"></div>
        </div>
    );
};

const WavyBg = () => (
    <svg className="absolute bottom-0 left-0 w-full h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="currentColor" fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
)
  
  const statCards = [
    { title: "Nuevos Alumnos", value: "1,254", icon: Users, fromColor: "from-blue-400", toColor: "to-blue-600", iconShape: 'circles' as const },
    { title: "Cursos Activos", value: "82", icon: ClipboardCheck, fromColor: "from-cyan-400", toColor: "to-cyan-600", iconShape: 'squares' as const },
    { title: "Certificados", value: "4,502", icon: GraduationCap, fromColor: "from-emerald-400", toColor: "to-emerald-600", iconShape: 'swirl' as const },
    { title: "Inscripciones", value: "+350", icon: BookOpen, fromColor: "from-amber-400", toColor: "to-amber-600", iconShape: 'circles' as const },
  ];

  const academicMetrics = [
    { title: "Total de Estudiantes", value: "1,254", icon: Users, color: "text-blue-500", progress: 90 },
    { title: "Estudiantes Activos", value: "1,198", icon: UserCheck, color: "text-green-500", progress: 95 },
    { title: "Estudiantes Retirados", value: "56", icon: UserX, color: "text-red-500", progress: 5 },
    { title: "Cursos Abiertos", value: "82", icon: BookMarked, color: "text-purple-500", progress: 60 },
  ];

  const recentEnrollments = [
      { name: "Abdullah Al Ahad", status: "Pendiente", course: "Seguridad de la Carga Aérea", date: "03.01.2024", time: "10:00 AM", avatar: "https://placehold.co/40x40.png", "data-ai-hint": "person" },
      { name: "Al Shahriar Shawon", status: "Aprobado", course: "Mercancías Peligrosas", date: "03.01.2024", time: "10:20 AM", avatar: "https://placehold.co/40x40.png", "data-ai-hint": "person" },
      { name: "Lyn R. Ramos", status: "Aprobado", course: "AVSEC para la Tripulación", date: "03.01.2024", time: "10:40 AM", avatar: "https://placehold.co/40x40.png", "data-ai-hint": "person" },
      { name: "Katherine A. Stanfill", status: "Pendiente", course: "Manejo de Crisis", date: "03.01.2024", time: "11:00 AM", avatar: "https://placehold.co/40x40.png", "data-ai-hint": "person" },
      { name: "Robert K. Panez", status: "Rechazado", course: "Seguridad Aeroportuaria", date: "03.01.2024", time: "11:20 AM", avatar: "https://placehold.co/40x40.png", "data-ai-hint": "person" },
      { name: "Jason L. Bowling", status: "Aprobado", course: "Seguridad de la Carga Aérea", date: "03.01.2024", time: "11:40 AM", avatar: "https://placehold.co/40x40.png", "data-ai-hint": "person" },
      { name: "Joseph A. Bove", status: "Aprobado", course: "Mercancías Peligrosas", date: "03.01.2024", time: "12:00 PM", avatar: "https://placehold.co/40x40.png", "data-ai-hint": "person" },
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
  
        {/* Academic Metrics Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
            {academicMetrics.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
              >
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">
                            +2.1% from last month
                        </p>
                        <Progress value={card.progress} className="mt-4 h-2" />
                    </CardContent>
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
                                            <AvatarImage src={enrollment.avatar} alt={enrollment.name} data-ai-hint={enrollment['data-ai-hint']} />
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
                                            enrollment.status === 'Aprobado' ? 'bg-green-100 dark:bg-green-800/20 text-green-800 dark:text-green-300' :
                                            enrollment.status === 'Pendiente' ? 'bg-amber-100 dark:bg-amber-800/20 text-amber-800 dark:text-amber-300' :
                                            'bg-red-100 dark:bg-red-800/20 text-red-800 dark:text-red-300'
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
  
