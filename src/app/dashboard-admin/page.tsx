
"use client";
import Link from "next/link";
import {
    Activity,
    BookCopy,
    ChevronDown,
    ClipboardCheck,
    GraduationCap,
    MoreHorizontal,
    Users
} from "lucide-react";
import { motion } from "framer-motion";
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
import { EnrollmentChart } from "@/components/enrollment-chart";
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
    PaginationEllipsis
  } from "@/components/ui/pagination";

const motionTableRow = motion(TableRow);

const taskCards = [
    { title: "Nuevos Alumnos", description: "Recibidas 5 solicitudes", icon: Users, color: "bg-purple-500/20 text-purple-400", href: "/dashboard-admin/alumnos" },
    { title: "Cursos Activos", description: "Verifica los materiales", icon: BookCopy, color: "bg-green-500/20 text-green-400", href: "/dashboard-admin/cursos" },
    { title: "Certificados", description: "Tienes 20 nuevos mensajes", icon: GraduationCap, color: "bg-blue-500/20 text-blue-400", href: "/dashboard-admin/calificaciones" },
    { title: "Inscripciones", description: "Tienes nuevos mensajes", icon: ClipboardCheck, color: "bg-pink-500/20 text-pink-400", href: "/dashboard-admin/inscripciones" },
];

const recentEnrollments = [
      { name: "Abdullah Al Ahad", age: 29, email: "evgene_1982@yahoo.ru", phone: "+7 (916) 474 48 39", status: "Activo" },
      { name: "Al Shahriar Shawon", age: 48, email: "nazar_183_up@gmail.com", phone: "+7 (916) 234 48 35", status: "Vencido" },
      { name: "Lyn R. Ramos", age: 19, email: "mizzz@mail.ru", phone: "+7 (916) 234 62 31", status: "Cerrado" },
      { name: "Katherine A. Stanfill", age: 29, email: "evgene_1982@yahoo.ru", phone: "+7 (919) 284 53 31", status: "Cerrado" },
      { name: "Robert K. Panez", age: 34, email: "skorieek@yandex.ru", phone: "+7 (916) 474 48 93", status: "Activo" },
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
    },
  },
};

export default function DashboardAdminPage() {
  return (
    <div className="flex flex-col flex-1 space-y-6">
       
        <motion.section 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {taskCards.map((card, index) => (
                <Link href={card.href} key={index}>
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="h-full"
                    >
                        <Card className="bg-card hover:bg-card/80 transition-colors h-full cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className={`p-2 rounded-md ${card.color}`}>
                                    <card.icon className="w-5 h-5"/>
                                </div>
                                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-lg font-semibold">{card.title}</h3>
                                <p className="text-sm text-muted-foreground">{card.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Link>
            ))}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1">
            {/* Main content */}
            <motion.div 
                className="lg:col-span-3 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                 {/* Recent Enrollments */}
                <Card className="h-full flex flex-col flex-1">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="text-lg">Inscripciones Recientes</CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-card-foreground/10 text-card-foreground">212 Alumnos</Badge>
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground cursor-pointer" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <div className="flex-1">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Edad</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {recentEnrollments.map((enrollment, index) => (
                                    <motion.tr 
                                      key={enrollment.name}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      whileHover={{ y: -2, transition: { type: "spring", stiffness: 300 } }}
                                      className="hover:bg-muted/50 cursor-pointer"
                                    >
                                        <TableCell className="font-medium">{enrollment.name}</TableCell>
                                        <TableCell>{enrollment.age}</TableCell>
                                        <TableCell className="text-muted-foreground">{enrollment.email}</TableCell>
                                        <TableCell className="text-muted-foreground">{enrollment.phone}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                className={`border-none capitalize ${
                                                enrollment.status === 'Activo' ? 'bg-green-500/20 text-green-400' : 
                                                enrollment.status === 'Vencido' ? 'bg-red-500/20 text-red-400' : 
                                                'bg-gray-500/20 text-gray-400'
                                                }`}
                                            >
                                                {enrollment.status}
                                            </Badge>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <p className="text-xs text-muted-foreground">Mostrar por página: 100</p>
                            <CustomPagination />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            {/* Side column */}
            <motion.div 
                className="lg:col-span-2 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="h-full flex flex-col flex-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Estadísticas de Inscripciones por Edad</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex">
                       <EnrollmentChart />
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    </div>
  );
}

function CustomPagination() {
    return (
        <Pagination className="w-auto mx-0 justify-end">
            <PaginationContent>
            <PaginationItem>
                <PaginationPrevious href="#" className="h-8 w-8" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#" className="h-8 w-8">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#" className="h-8 w-8">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#" isActive className="h-8 w-8">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationEllipsis className="h-8 w-8" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#" className="h-8 w-8">8</PaginationLink>
            </PaginationItem>
             <PaginationItem>
                <PaginationLink href="#" className="h-8 w-8">9</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationNext href="#" className="h-8 w-8" />
            </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

    
