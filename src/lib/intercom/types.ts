/** Intercom REST API v2.11 types (subset used by HSM) */

export interface IntercomContact {
  type: "contact";
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: "user" | "lead";
  external_id: string | null;
  company?: {
    id: string;
    name: string;
  } | null;
}

export interface IntercomConversationSource {
  type: string;
  id: string;
  delivered_as: string;
  subject: string;
  body: string;
  author: {
    type: string;
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface IntercomConversationPart {
  type: string;
  id: string;
  part_type: string;
  body: string | null;
  created_at: number;
  author: {
    type: string;
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface IntercomConversation {
  type: "conversation";
  id: string;
  title: string | null;
  created_at: number;
  updated_at: number;
  source: IntercomConversationSource;
  contacts: {
    type: "contact.list";
    contacts: IntercomContact[];
  };
  teammates?: {
    type: "admin.list";
    admins: { type: string; id: string; name: string | null }[];
  };
  team_assignee_id: string | null;
  tags: {
    type: "tag.list";
    tags: { type: string; id: string; name: string }[];
  };
  conversation_parts?: {
    type: "conversation_part.list";
    conversation_parts: IntercomConversationPart[];
  };
  state: "open" | "closed" | "snoozed";
  open: boolean;
  read: boolean;
}

export interface IntercomWebhookPayload {
  type: "notification_event";
  topic: string;
  id: string;
  created_at: number;
  delivery_status: string;
  data: {
    type: "notification_event_data";
    item: IntercomConversation;
  };
}

export interface IntercomSearchResponse<T> {
  type: "list";
  data: T[];
  total_count: number;
  pages?: {
    type: "pages";
    page: number;
    per_page: number;
    total_pages: number;
  };
}
