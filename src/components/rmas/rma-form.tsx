"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createRmaSchema,
  type CreateRmaInput,
} from "@/lib/validators/rma";

interface RmaFormProps {
  providers: { id: string; name: string }[];
  incidents: { id: string; incidentNumber: string }[];
  defaultValues?: Partial<CreateRmaInput>;
  onSubmit: (data: CreateRmaInput) => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

export function RmaForm({
  providers,
  incidents,
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: RmaFormProps) {
  const form = useForm<CreateRmaInput>({
    resolver: zodResolver(createRmaSchema),
    defaultValues: {
      providerId: defaultValues?.providerId ?? "",
      incidentId: defaultValues?.incidentId ?? "",
      deviceBrand: defaultValues?.deviceBrand ?? "",
      deviceModel: defaultValues?.deviceModel ?? "",
      deviceSerialNumber: defaultValues?.deviceSerialNumber ?? "",
      trackingNumberOutgoing: defaultValues?.trackingNumberOutgoing ?? "",
      trackingNumberReturn: defaultValues?.trackingNumberReturn ?? "",
      providerRmaNumber: defaultValues?.providerRmaNumber ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="providerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="incidentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incidencia vinculada</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sin vincular" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {incidents.map((incident) => (
                    <SelectItem key={incident.id} value={incident.id}>
                      {incident.incidentNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="deviceBrand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca del dispositivo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Dell, HP, Lenovo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deviceModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo del dispositivo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Latitude 5520" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deviceSerialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de serie</FormLabel>
                <FormControl>
                  <Input placeholder="Nº de serie del dispositivo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="trackingNumberOutgoing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº seguimiento envío</FormLabel>
                <FormControl>
                  <Input placeholder="Número de seguimiento de envío" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trackingNumberReturn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº seguimiento devolución</FormLabel>
                <FormControl>
                  <Input placeholder="Número de seguimiento de devolución" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="providerRmaNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº RMA proveedor</FormLabel>
              <FormControl>
                <Input placeholder="Número de RMA del proveedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas adicionales sobre el RMA"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : mode === "create"
                ? "Crear RMA"
                : "Guardar Cambios"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/rmas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
