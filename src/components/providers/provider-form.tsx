"use client";

import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createProviderSchema,
  type CreateProviderInput,
} from "@/lib/validators/provider";

interface ProviderFormProps {
  defaultValues?: Partial<CreateProviderInput>;
  onSubmit: (data: CreateProviderInput) => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

export function ProviderForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: ProviderFormProps) {
  const form = useForm<CreateProviderInput>({
    resolver: zodResolver(createProviderSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      website: defaultValues?.website ?? "",
      rmaUrl: defaultValues?.rmaUrl ?? "",
      contacts: defaultValues?.contacts ?? [],
      notes: defaultValues?.notes ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Seccion 1: Informacion General */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informacion general</h3>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email SAT</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="sat@proveedor.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Seccion 2: Proceso RMA */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Proceso RMA</h3>
          <Separator />
          <FormField
            control={form.control}
            name="rmaUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Portal RMA</FormLabel>
                <FormControl>
                  <Input placeholder="https://portal.proveedor.com/rma" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seccion 3: Contactos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Contactos</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", email: "", phone: "", role: "" })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Añadir contacto
            </Button>
          </div>
          <Separator />

          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No hay contactos registrados
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid flex-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre del contacto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="contacto@proveedor.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.phone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefono</FormLabel>
                              <FormControl>
                                <Input placeholder="+34 600 000 000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rol</FormLabel>
                              <FormControl>
                                <Input placeholder="Tecnico, SAT, Comercial..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar contacto</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Seccion 4: Notas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notas</h3>
          <Separator />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Notas adicionales sobre el proveedor"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : mode === "create"
                ? "Crear Proveedor"
                : "Guardar Cambios"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/providers">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
