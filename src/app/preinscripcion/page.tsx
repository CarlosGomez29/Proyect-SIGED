
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function PreinscripcionPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preinscripción Enviada",
      description: "Gracias por tu interés. Nos pondremos en contacto contigo pronto.",
    });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden p-4">
        <Image
            src="https://scontent-mia3-2.xx.fbcdn.net/v/t51.75761-15/472886842_18316761754166708_5441275870719636355_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Af3ARebzWyoQ7kNvwGdcUaA&_nc_oc=Adniowp876a0ZToJ8swAXJh0s9gejlmNBoCOH-ynfyyPaqo99hECiEvmI43wt-HHMh18qYSrBuBtOnlPF-XghMEo&_nc_zt=23&_nc_ht=scontent-mia3-2.xx&_nc_gid=j0DCcsxWiDEF9vNzTiUiNg&oh=00_Afj0BcG5Zw-XKh2f5ReqxXXfPWuFYjpEaoWXS1RZXUS1eA&oe=69129172"
            alt="Background"
            fill
            priority
            className="z-0 object-cover filter brightness-50 blur-sm"
        />
      <Card className="mx-auto max-w-md z-10 bg-black/60 backdrop-blur-md border border-white/20 text-white">
        <CardHeader className="text-center">
          <Icons.logo className="h-16 w-16 text-primary mx-auto" />
          <CardTitle className="text-2xl font-headline mt-4">Formulario de Preinscripción</CardTitle>
          <CardDescription className="text-neutral-300">
            Completa tus datos para iniciar tu proceso de admisión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="text-neutral-200">Nombre Completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Ingresa tu nombre completo"
                required
                className="bg-transparent border-white/30 placeholder:text-neutral-400"
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="email" className="text-neutral-200">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                required
                 className="bg-transparent border-white/30 placeholder:text-neutral-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course" className="text-neutral-200">Curso de Interés</Label>
              <Select>
                <SelectTrigger id="course" className="bg-transparent border-white/30 text-white">
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carga_aerea">Seguridad de la Carga Aérea</SelectItem>
                  <SelectItem value="mercancias_peligrosas">Mercancías Peligrosas</SelectItem>
                  <SelectItem value="avsec">AVSEC para la Tripulación</SelectItem>
                  <SelectItem value="crisis">Manejo de Crisis</SelectItem>
                  <SelectItem value="seg_aeroportuaria">Seguridad Aeroportuaria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full mt-2">
              Enviar Preinscripción
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
