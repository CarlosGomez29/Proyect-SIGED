
"use client";

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

export default function PreinscripcionForm() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preinscripción Enviada",
      description: "Gracias por tu interés. Nos pondremos en contacto contigo pronto.",
    });
  };

  return (
      <Card className="mx-auto w-full max-w-md z-10 bg-black/60 backdrop-blur-md border border-white/20 text-white">
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
  );
}
