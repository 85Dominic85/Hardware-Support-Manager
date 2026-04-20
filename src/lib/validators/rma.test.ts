import { describe, it, expect } from "vitest";
import { createRmaSchema, updateRmaSchema, rmaFormSchema, transitionRmaSchema } from "./rma";

const VALID_UUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const VALID_UUID_2 = "b1ffcd00-0d1c-4ef9-bb7e-7cc0ce491b22";

describe("RMA Validators", () => {
  describe("createRmaSchema", () => {
    it("accepts valid complete data", () => {
      const result = createRmaSchema.safeParse({
        providerId: VALID_UUID,
        incidentId: VALID_UUID_2,
        clientName: "Restaurante La Plaza",
        clientExternalId: "CLI-001",
        clientIntercomUrl: "https://intercom.io/contact/123",
        deviceType: "tpv",
        deviceBrand: "Epson",
        deviceModel: "TM-T88VI",
        deviceSerialNumber: "SN-98765",
        contactName: "María",
        contactPhone: "+34 612 345 678",
        pickupAddress: "Calle Mayor 10",
        pickupCity: "Madrid",
        pickupPostalCode: "28001",
        notes: "Fallo de impresora térmica",
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal data (only providerId)", () => {
      const result = createRmaSchema.safeParse({
        providerId: VALID_UUID,
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty strings for all optional fields", () => {
      const result = createRmaSchema.safeParse({
        providerId: VALID_UUID,
        incidentId: "",
        clientName: "",
        clientExternalId: "",
        clientIntercomUrl: "",
        deviceType: "",
        deviceBrand: "",
        deviceModel: "",
        deviceSerialNumber: "",
        contactName: "",
        contactPhone: "",
        pickupAddress: "",
        pickupCity: "",
        pickupPostalCode: "",
        notes: "",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing providerId", () => {
      const result = createRmaSchema.safeParse({
        clientName: "Test",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid providerId", () => {
      const result = createRmaSchema.safeParse({
        providerId: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid incidentId (not UUID and not empty)", () => {
      const result = createRmaSchema.safeParse({
        providerId: VALID_UUID,
        incidentId: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateRmaSchema", () => {
    it("accepts partial update", () => {
      const result = updateRmaSchema.safeParse({
        notes: "Actualizado",
        trackingNumberOutgoing: "TRACK-001",
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty object", () => {
      const result = updateRmaSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts tracking numbers", () => {
      const result = updateRmaSchema.safeParse({
        trackingNumberOutgoing: "TRACK-OUT-123",
        trackingNumberReturn: "TRACK-RET-456",
        providerRmaNumber: "PROV-RMA-789",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid providerId in update", () => {
      const result = updateRmaSchema.safeParse({
        providerId: "not-uuid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("rmaFormSchema", () => {
    it("accepts same data as createRmaSchema", () => {
      const data = {
        providerId: VALID_UUID,
        clientName: "Test",
        deviceType: "tpv",
      };
      const createResult = createRmaSchema.safeParse(data);
      const formResult = rmaFormSchema.safeParse(data);
      expect(createResult.success).toBe(formResult.success);
    });

    it("includes tracking fields for edit mode", () => {
      const result = rmaFormSchema.safeParse({
        providerId: VALID_UUID,
        trackingNumberOutgoing: "TRACK-001",
        trackingNumberReturn: "TRACK-002",
        providerRmaNumber: "PROV-RMA-001",
      });
      expect(result.success).toBe(true);
    });

    it("accepts homogeneous contact and pickup fields", () => {
      const result = rmaFormSchema.safeParse({
        providerId: VALID_UUID,
        contactName: "Luis",
        contactPhone: "600000000",
        pickupAddress: "C/ Mayor 3",
        pickupCity: "Madrid",
        pickupPostalCode: "28001",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("transitionRmaSchema", () => {
    it("accepts valid transition", () => {
      const result = transitionRmaSchema.safeParse({
        rmaId: VALID_UUID,
        toStatus: "solicitado",
      });
      expect(result.success).toBe(true);
    });

    it("accepts transition with comment", () => {
      const result = transitionRmaSchema.safeParse({
        rmaId: VALID_UUID,
        toStatus: "aprobado",
        comment: "Proveedor confirmó la aprobación",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing rmaId", () => {
      const result = transitionRmaSchema.safeParse({
        toStatus: "solicitado",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status", () => {
      const result = transitionRmaSchema.safeParse({
        rmaId: VALID_UUID,
        toStatus: "invalid_status",
      });
      expect(result.success).toBe(false);
    });

    it("accepts all valid RMA statuses", () => {
      const statuses = [
        "borrador", "solicitado", "aprobado", "enviado_proveedor",
        "en_proveedor", "devuelto", "recibido_oficina",
        "cerrado", "cancelado",
      ];
      for (const toStatus of statuses) {
        const result = transitionRmaSchema.safeParse({
          rmaId: VALID_UUID,
          toStatus,
        });
        expect(result.success).toBe(true);
      }
    });
  });
});
