
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
        <Image
            src="https://scontent-mia3-2.xx.fbcdn.net/v/t51.75761-15/472886842_18316761754166708_5441275870719636355_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Af3ARebzWyoQ7kNvwGdcUaA&_nc_oc=Adniowp876a0ZToJ8swAXJh0s9gejlmNBoCOH-ynfyyPaqo99hECiEvmI43wt-HHMh18qYSrBuBtOnlPF-XghMEo&_nc_zt=23&_nc_ht=scontent-mia3-2.xx&_nc_gid=j0DCcsxWiDEF9vNzTiUiNg&oh=00_Afj0BcG5Zw-XKh2f5ReqxXXfPWuFYjpEaoWXS1RZXUS1eA&oe=69129172"
            alt="Background"
            fill
            priority
            className="z-0 object-cover filter brightness-50 blur-sm"
        />
      <motion.div
        className="relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Icons.logo className="h-28 w-28 text-primary mx-auto" />
        </motion.div>

        <motion.h1
          className="text-5xl font-bold font-headline mt-6 text-white drop-shadow-lg"
          variants={itemVariants}
        >
          SIGED - DIGEV
        </motion.h1>

        <motion.p
          className="text-neutral-200 mt-3 text-lg max-w-xl drop-shadow-md"
          variants={itemVariants}
        >
          Sistema Integral de Gestión de Estudiantes y Docentes.
          <br />
          Modernizando la educación para un futuro más brillante.
        </motion.p>

        <motion.div className="mt-10 flex flex-col items-center gap-4" variants={itemVariants}>
          <Button asChild size="lg" className="group w-64">
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
