
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
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
      damping: 12,
    },
  },
};

export default function WelcomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Icons.logo className="h-28 w-28 text-primary mx-auto" />
        </motion.div>

        <motion.h1
          className="text-5xl font-bold font-headline mt-6 text-foreground"
          variants={itemVariants}
        >
          SIGED - DIGEV
        </motion.h1>

        <motion.p
          className="text-muted-foreground mt-3 text-lg max-w-xl"
          variants={itemVariants}
        >
          Sistema Integral de Gestión de Estudiantes y Docentes.
          <br />
          Modernizando la educación para un futuro más brillante.
        </motion.p>

        <motion.div className="mt-10" variants={itemVariants}>
          <Button asChild size="lg" className="group">
            <Link href="/login">
              Iniciar Sesión
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
