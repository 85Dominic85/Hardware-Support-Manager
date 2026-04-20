"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateClientDialog } from "@/components/shared/create-client-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
import { SearchableSelect } from "@/components/shared/searchable-select";
import {
  rmaFormSchema,
  type RmaFormInput,
} from "@/lib/validators/rma";
import { DEVICE_TYPE_LABELS } from "@/lib/constants/device-types";
import { fetchClientsForSelect } from "@/server/actions/clients";
import {
  fetchArticleTypes,
  fetchArticleBrands,
  fetchArticleModels,
} from "@/server/actions/articles";
import { fetchIncidentById } from "@/server/actions/incidents";

interface RmaFormProps {
  providers: { id: string; name: string }[];
  incidents: { id: string; incidentNumber: string }[];
  defaultValues?: Partial<RmaFormInput>;
  onSubmit: (data: RmaFormInput) => void;
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
  const queryClient = useQueryClient();
  const [clientDialogOpen, setClientDialogOpen] = useState(false);

  const form = useForm<RmaFormInput>({
    resolver: zodResolver(rmaFormSchema),
    mode: "onTouched",
    defaultValues: {
      providerId: defaultValues?.providerId ?? "",
      incidentId: defaultValues?.incidentId ?? "",
      clientId: defaultValues?.clientId ?? "",
      clientName: defaultValues?.clientName ?? "",
      clientExternalId: defaultValues?.clientExternalId ?? "",
      clientIntercomUrl: defaultValues?.clientIntercomUrl ?? "",
      articleId: defaultValues?.articleId ?? "",
      deviceType: defaultValues?.deviceType ?? "",
      deviceBrand: defaultValues?.deviceBrand ?? "",
      deviceModel: defaultValues?.deviceModel ?? "",
      deviceSerialNumber: defaultValues?.deviceSerialNumber ?? "",
      contactName: defaultValues?.contactName ?? "",
      contactPhone: defaultValues?.contactPhone ?? "",
      pickupAddress: defaultValues?.pickupAddress ?? "",
      pickupPostalCode: defaultValues?.pickupPostalCode ?? "",
      pickupCity: defaultValues?.pickupCity ?? "",
      trackingNumberOutgoing: defaultValues?.trackingNumberOutgoing ?? "",
      trackingNumberReturn: defaultValues?.trackingNumberReturn ?? "",
      providerRmaNumber: defaultValues?.providerRmaNumber ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  const selectedIncidentId = form.watch("incidentId");

  const { data: clientsData = [] } = useQuery({
    queryKey: ["clients", "select"],
    queryFn: () => fetchClientsForSelect(),
  });

  const { data: incidentData } = useQuery({
    queryKey: ["incident-for-rma", selectedIncidentId],
    queryFn: () => fetchIncidentById(selectedIncidentId!),
    enabled: !!selectedIncidentId && !defaultValues,
  });

  // Track which incident was last auto-filled to avoid re-running on unrelated re-renders
  const lastAutoFilledIncidentId = useRef<string | null>(null);

  // Auto-fill RMA form from incident data when an incident is selected in create mode
  useEffect(() => {
    if (!incidentData || !selectedIncidentId || defaultValues) return;
    if (lastAutoFilledIncidentId.current === selectedIncidentId) return;

    lastAutoFilledIncidentId.current = selectedIncidentId;

    let didFill = false;

    const setIfEmpty = (field: keyof RmaFormInput, value: string | null | undefined) => {
      if (!value) return;
      const current = form.getValues(field);
      if (!current) {
        form.setValue(field, value as never, { shouldDirty: true });
        didFill = true;
      }
    };

    // Client identity
    if (incidentData.clientId) {
      const currentClientId = form.getValues("clientId");
      if (!currentClientId) {
        form.setValue("clientId", incidentData.clientId, { shouldDirty: true });
        didFill = true;
      }
    }

    // Device fields
    setIfEmpty("deviceType", incidentData.deviceType);
    setIfEmpty("deviceBrand", incidentData.deviceBrand);
    setIfEmpty("deviceModel", incidentData.deviceModel);
    setIfEmpty("deviceSerialNumber", incidentData.deviceSerialNumber);

    // Contact and pickup fields
    setIfEmpty("contactName", incidentData.contactName);
    setIfEmpty("contactPhone", incidentData.contactPhone);
    setIfEmpty("pickupAddress", incidentData.pickupAddress);
    setIfEmpty("pickupPostalCode", incidentData.pickupPostalCode);
    setIfEmpty("pickupCity", incidentData.pickupCity);

    // Intercom
    setIfEmpty("clientIntercomUrl", incidentData.intercomUrl);

    // Client name from joined client record or free-text
    setIfEmpty("clientName", incidentData.clientCompanyName ?? incidentData.clientName);

    // Article ID
    setIfEmpty("articleId", incidentData.articleId);

    // Pre-fill notes with incident title + description
    const noteParts: string[] = [];
    if (incidentData.title) noteParts.push(incidentData.title);
    if (incidentData.description) {
      const desc = incidentData.description.length > 500
        ? incidentData.description.slice(0, 500) + "..."
        : incidentData.description;
      noteParts.push(desc);
    }
    if (noteParts.length > 0) {
      setIfEmpty("notes", noteParts.join("\n\n"));
    }

    if (didFill) {
      toast.success("Datos importados de la incidencia");
    }
  }, [incidentData, selectedIncidentId, defaultValues, form]);

  // Article cascading dropdowns
  const selectedDeviceType = form.watch("deviceType");
  const selectedDeviceBrand = form.watch("deviceBrand");

  const { data: articleTypes = [] } = useQuery({
    queryKey: ["article-types"],
    queryFn: () => fetchArticleTypes(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: articleBrands = [] } = useQuery({
    queryKey: ["article-brands", selectedDeviceType],
    queryFn: () => fetchArticleBrands(selectedDeviceType!),
    enabled: !!selectedDeviceType && selectedDeviceType !== "otro" && selectedDeviceType !== "desconocido",
    staleTime: 10 * 60 * 1000,
  });

  const { data: articleModels = [] } = useQuery({
    queryKey: ["article-models", selectedDeviceType, selectedDeviceBrand],
    queryFn: () => fetchArticleModels(selectedDeviceType!, selectedDeviceBrand!),
    enabled: !!selectedDeviceType && !!selectedDeviceBrand && selectedDeviceType !== "otro",
    staleTime: 10 * 60 * 1000,
  });

  // Reset brand/model when type changes
  useEffect(() => {
    if (selectedDeviceType) {
      form.setValue("deviceBrand", "");
      form.setValue("deviceModel", "");
      form.setValue("articleId", "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceType]);

  // Reset model when brand changes
  useEffect(() => {
    if (selectedDeviceBrand) {
      form.setValue("deviceModel", "");
      form.setValue("articleId", "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceBrand]);

  const clientOptions = clientsData.map((c: { id: string; name: string }) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Seccion 1 — Relaciones */}
        <div>
          <h3 className="flex items-center gap-3 text-sm font-semibold text-foreground uppercase tracking-wide mb-4"><span className="h-4 w-1 rounded-full bg-primary" />Relaciones</h3>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor *</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={providers.map((p) => ({ value: p.id, label: p.name }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Seleccionar proveedor"
                      searchPlaceholder="Buscar proveedor..."
                      emptyMessage="No se encontro proveedor."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente (empresa)</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={clientOptions}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      placeholder="Seleccionar cliente..."
                      searchPlaceholder="Buscar cliente..."
                      emptyMessage="No se encontraron clientes."
                      emptyAction={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setClientDialogOpen(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Crear nuevo cliente
                        </Button>
                      }
                    />
                  </FormControl>
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
                  <FormControl>
                    <SearchableSelect
                      options={incidents.map((i) => ({ value: i.id, label: i.incidentNumber }))}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      placeholder="Sin vincular"
                      searchPlaceholder="Buscar incidencia..."
                      emptyMessage="No se encontro incidencia."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre cliente (texto libre)</FormLabel>
                  <FormControl>
                    <Input placeholder="Si no hay cliente registrado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientExternalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID externo cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="ID en sistema externo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4">
            <FormField
              control={form.control}
              name="clientIntercomUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Intercom</FormLabel>
                  <FormControl>
                    <Input placeholder="https://app.intercom.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Seccion 2 — Contacto y Recogida */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-3 text-sm font-semibold text-foreground uppercase tracking-wide"><span className="h-4 w-1 rounded-full bg-primary" />
            Contacto y Recogida
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
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
                  <FormLabel>Teléfono de contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="Teléfono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="pickupAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección de recogida</FormLabel>
                <FormControl>
                  <Textarea placeholder="Dirección completa" rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="pickupCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ciudad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupPostalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal</FormLabel>
                  <FormControl>
                    <Input placeholder="CP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Seccion 3 — Dispositivo */}
        <div>
          <h3 className="flex items-center gap-3 text-sm font-semibold text-foreground uppercase tracking-wide mb-4"><span className="h-4 w-1 rounded-full bg-primary" />Dispositivo</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="deviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de dispositivo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {articleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {DEVICE_TYPE_LABELS[type as keyof typeof DEVICE_TYPE_LABELS] ?? type}
                        </SelectItem>
                      ))}
                      <SelectItem value="otro">Otro</SelectItem>
                      <SelectItem value="desconocido">Desconocido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceBrand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  {articleBrands.length > 0 ? (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {articleBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input placeholder="Escribir marca" {...field} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  {articleModels.length > 0 ? (
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v);
                        const article = articleModels.find((a) => a.model === v);
                        if (article) form.setValue("articleId", article.id);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {articleModels.map((a) => (
                          <SelectItem key={a.id} value={a.model}>{a.model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input placeholder="Escribir modelo" {...field} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceSerialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N de serie</FormLabel>
                  <FormControl>
                    <Input placeholder="N de serie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Seccion 4 — Seguimiento (solo en modo edicion) */}
        {mode === "edit" && (
          <>
            <Separator className="bg-border/40" />
            <div>
              <h3 className="flex items-center gap-3 text-sm font-semibold text-foreground uppercase tracking-wide mb-4"><span className="h-4 w-1 rounded-full bg-primary" />Seguimiento</h3>
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="trackingNumberOutgoing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N seguimiento envio</FormLabel>
                      <FormControl>
                        <Input placeholder="Tracking de envio" {...field} />
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
                      <FormLabel>N seguimiento devolucion</FormLabel>
                      <FormControl>
                        <Input placeholder="Tracking de devolucion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="providerRmaNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N RMA proveedor</FormLabel>
                      <FormControl>
                        <Input placeholder="N RMA del proveedor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        )}

        <Separator className="bg-border/40" />

        {/* Seccion 5 — Notas */}
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

      <CreateClientDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        onClientCreated={({ clientId, clientName }) => {
          queryClient.invalidateQueries({ queryKey: ["clients", "select"] });
          form.setValue("clientId", clientId);
          form.setValue("clientName", clientName);
        }}
      />
    </Form>
  );
}
