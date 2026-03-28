"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createClientLocationSchema,
  type CreateClientLocationInput,
} from "@/lib/validators/client";

interface ClientLocationFormProps {
  clientId: string;
  defaultValues?: Partial<CreateClientLocationInput>;
  onSubmit: (data: CreateClientLocationInput) => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientLocationForm({
  clientId,
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
  open,
  onOpenChange,
}: ClientLocationFormProps) {
  const form = useForm<CreateClientLocationInput>({
    resolver: zodResolver(createClientLocationSchema),
    defaultValues: {
      clientId,
      name: defaultValues?.name ?? "",
      contactName: defaultValues?.contactName ?? "",
      contactEmail: defaultValues?.contactEmail ?? "",
      contactPhone: defaultValues?.contactPhone ?? "",
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? "",
      postalCode: defaultValues?.postalCode ?? "",
      notes: defaultValues?.notes ?? "",
      isDefault: defaultValues?.isDefault ?? false,
    },
  });

  function handleSubmit(data: CreateClientLocationInput) {
    onSubmit(data);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Añadir local" : "Editar local"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Nombre del local - full width */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del local *</FormLabel>
                  <FormControl>
                    <Input placeholder="Sede central, Delegacion Madrid..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* contactName + contactPhone - 2-col grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persona de contacto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono contacto</FormLabel>
                    <FormControl>
                      <Input placeholder="+34 600 000 000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* contactEmail - full width */}
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email contacto</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contacto@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* address - full width */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direccion</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Calle, numero, piso..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* city + postalCode - 2-col grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Madrid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codigo Postal</FormLabel>
                    <FormControl>
                      <Input placeholder="28001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* isDefault - checkbox */}
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Local por defecto</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* notes - full width */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre este local"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Guardando..."
                  : mode === "create"
                    ? "Añadir local"
                    : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
