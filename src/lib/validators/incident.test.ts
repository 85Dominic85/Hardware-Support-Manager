import { describe, it, expect } from "vitest";
import { createIncidentSchema, updateIncidentSchema, transitionIncidentSchema } from "./incident";

describe("Incident Validators", () => {
  describe("createIncidentSchema", () => {
    it("accepts valid complete data", () => {
      const result = createIncidentSchema.safeParse({
        clientName: "Bar El Rincón",
        title: "TPV no enciende",
        description: "El equipo dejó de funcionar ayer",
        category: "escalado",
        hardwareOrigin: "qamarero",
        priority: "alta",
        assignedUserId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        deviceType: "tpv",
        deviceBrand: "Epson",
        deviceModel: "TM-T20",
        deviceSerialNumber: "SN12345",
        contactName: "Juan",
        contactPhone: "600111222",
        pickupAddress: "Calle Mayor 1",
        pickupCity: "Madrid",
        pickupPostalCode: "28001",
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal required fields", () => {
      const result = createIncidentSchema.safeParse({
        title: "Problema",
        category: "escalado",
        hardwareOrigin: "qamarero",
        priority: "media",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing title", () => {
      const result = createIncidentSchema.safeParse({
        category: "escalado",
        hardwareOrigin: "qamarero",
        priority: "alta",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty title", () => {
      const result = createIncidentSchema.safeParse({
        title: "",
        category: "escalado",
        hardwareOrigin: "qamarero",
        priority: "alta",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing category", () => {
      const result = createIncidentSchema.safeParse({
        title: "Test",
        hardwareOrigin: "qamarero",
        priority: "alta",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid category", () => {
      const result = createIncidentSchema.safeParse({
        title: "Test",
        category: "hardware",
        hardwareOrigin: "qamarero",
        priority: "alta",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid priority", () => {
      const result = createIncidentSchema.safeParse({
        title: "Test",
        category: "escalado",
        hardwareOrigin: "qamarero",
        priority: "urgente",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing hardwareOrigin", () => {
      const result = createIncidentSchema.safeParse({
        title: "Test",
        category: "escalado",
        priority: "media",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid hardwareOrigin", () => {
      const result = createIncidentSchema.safeParse({
        title: "Test",
        category: "escalado",
        hardwareOrigin: "otro",
        priority: "media",
      });
      expect(result.success).toBe(false);
    });

    it("accepts both valid hardwareOrigin values", () => {
      for (const hardwareOrigin of ["qamarero", "cliente_reciclado"]) {
        const result = createIncidentSchema.safeParse({
          title: "Test",
          category: "escalado",
          hardwareOrigin,
          priority: "media",
        });
        expect(result.success).toBe(true);
      }
    });

    it("accepts all valid categories", () => {
      const categories = ["escalado", "incidencia_directa", "mencion", "otro"];
      for (const category of categories) {
        const result = createIncidentSchema.safeParse({
          title: "Test",
          category,
          hardwareOrigin: "qamarero",
          priority: "media",
        });
        expect(result.success).toBe(true);
      }
    });

    it("accepts all valid priorities", () => {
      const priorities = ["baja", "media", "alta", "critica"];
      for (const priority of priorities) {
        const result = createIncidentSchema.safeParse({
          title: "Test",
          category: "escalado",
          hardwareOrigin: "qamarero",
          priority,
        });
        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid assignedUserId (not UUID)", () => {
      const result = createIncidentSchema.safeParse({
        title: "Test",
        category: "escalado",
        hardwareOrigin: "qamarero",
        priority: "media",
        assignedUserId: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid UUID for assignedUserId", () => {
      const result = createIncidentSchema.safeParse({
        title: "Test",
        category: "escalado",
        hardwareOrigin: "qamarero",
        priority: "media",
        assignedUserId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("updateIncidentSchema", () => {
    it("accepts partial update (only title)", () => {
      const result = updateIncidentSchema.safeParse({ title: "Nuevo título" });
      expect(result.success).toBe(true);
    });

    it("accepts empty object", () => {
      const result = updateIncidentSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("rejects invalid category in update", () => {
      const result = updateIncidentSchema.safeParse({ category: "invalid" });
      expect(result.success).toBe(false);
    });

    it("accepts updating hardwareOrigin alone", () => {
      const result = updateIncidentSchema.safeParse({ hardwareOrigin: "cliente_reciclado" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid hardwareOrigin in update", () => {
      const result = updateIncidentSchema.safeParse({ hardwareOrigin: "desconocido" });
      expect(result.success).toBe(false);
    });
  });

  describe("transitionIncidentSchema", () => {
    it("accepts valid transition", () => {
      const result = transitionIncidentSchema.safeParse({
        incidentId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        toStatus: "en_triaje",
      });
      expect(result.success).toBe(true);
    });

    it("accepts transition with comment", () => {
      const result = transitionIncidentSchema.safeParse({
        incidentId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        toStatus: "en_gestion",
        comment: "Iniciando gestión",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing incidentId", () => {
      const result = transitionIncidentSchema.safeParse({
        toStatus: "en_triaje",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status", () => {
      const result = transitionIncidentSchema.safeParse({
        incidentId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        toStatus: "invalid_status",
      });
      expect(result.success).toBe(false);
    });

    it("accepts all valid statuses", () => {
      const statuses = [
        "nuevo", "en_triaje", "en_gestion", "esperando_cliente",
        "esperando_proveedor", "resuelto", "cerrado", "cancelado",
      ];
      for (const toStatus of statuses) {
        const result = transitionIncidentSchema.safeParse({
          incidentId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          toStatus,
        });
        expect(result.success).toBe(true);
      }
    });
  });
});
