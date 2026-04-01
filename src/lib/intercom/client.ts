import type {
  IntercomConversation,
  IntercomContact,
  IntercomSearchResponse,
} from "./types";

const INTERCOM_API_BASE = "https://api.intercom.io";

function getHeaders(): HeadersInit {
  const token = process.env.INTERCOM_ACCESS_TOKEN;
  if (!token) {
    throw new Error("INTERCOM_ACCESS_TOKEN no configurado");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "Intercom-Version": "2.11",
  };
}

async function intercomFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${INTERCOM_API_BASE}${path}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(
      `Intercom API error ${res.status}: ${res.statusText}${errorBody ? ` — ${errorBody}` : ""}`
    );
  }

  return res.json() as Promise<T>;
}

/** Obtener una conversación con sus partes (mensajes) */
export async function getConversation(conversationId: string): Promise<IntercomConversation> {
  return intercomFetch<IntercomConversation>(
    `/conversations/${conversationId}?display_as=plaintext`
  );
}

/** Obtener un contacto por ID */
export async function getContact(contactId: string): Promise<IntercomContact> {
  return intercomFetch<IntercomContact>(`/contacts/${contactId}`);
}

/** Buscar contactos por email o nombre */
export async function searchContacts(query: string): Promise<IntercomContact[]> {
  // Try email search first
  const isEmail = query.includes("@");

  const searchPayload = {
    query: {
      operator: "OR",
      value: [
        {
          field: "email",
          operator: isEmail ? "=" : "~",
          value: query,
        },
        {
          field: "name",
          operator: "~",
          value: query,
        },
      ],
    },
  };

  const result = await intercomFetch<IntercomSearchResponse<IntercomContact>>(
    "/contacts/search",
    {
      method: "POST",
      body: JSON.stringify(searchPayload),
    }
  );

  return result.data;
}

/** Añadir nota interna a una conversación */
export async function addNote(
  conversationId: string,
  body: string,
  adminId: string
): Promise<void> {
  await intercomFetch(`/conversations/${conversationId}/reply`, {
    method: "POST",
    body: JSON.stringify({
      message_type: "note",
      type: "admin",
      admin_id: adminId,
      body,
    }),
  });
}

/** Etiquetar una conversación */
export async function tagConversation(
  conversationId: string,
  tagId: string,
  adminId: string
): Promise<void> {
  await intercomFetch(`/conversations/${conversationId}/tags`, {
    method: "POST",
    body: JSON.stringify({
      id: tagId,
      admin_id: adminId,
    }),
  });
}
