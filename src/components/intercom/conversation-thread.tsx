"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, MessageSquare, Loader2, User, Shield, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchIntercomConversation, type ConversationMessage } from "@/server/actions/intercom-inbox";

interface ConversationThreadProps {
  conversationId: string;
  defaultOpen?: boolean;
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageIcon({ type }: { type: string }) {
  if (type === "admin") return <Shield className="h-3.5 w-3.5" />;
  if (type === "bot") return <MessageSquare className="h-3.5 w-3.5" />;
  return <User className="h-3.5 w-3.5" />;
}

function MessageBubble({ msg }: { msg: ConversationMessage }) {
  const isAdmin = msg.authorType === "admin";
  const isNote = msg.partType === "note";
  const text = stripHtml(msg.body);

  return (
    <div
      className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}
      style={{ animationDelay: "50ms" }}
    >
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
          isNote
            ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400"
            : isAdmin
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {isNote ? <StickyNote className="h-3.5 w-3.5" /> : <MessageIcon type={msg.authorType} />}
      </div>
      <div
        className={`flex-1 min-w-0 rounded-lg px-3 py-2 text-sm ${
          isNote
            ? "bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20"
            : isAdmin
              ? "bg-primary/5 dark:bg-primary/10"
              : "bg-muted/50"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-xs">
            {msg.authorName}
          </span>
          {isNote && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium uppercase">
              Nota interna
            </span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">
            {formatTimestamp(msg.createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export function ConversationThread({ conversationId, defaultOpen = false }: ConversationThreadProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const { data, isLoading, error } = useQuery({
    queryKey: ["intercom-conversation", conversationId],
    queryFn: () => fetchIntercomConversation(conversationId),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const messages = data?.success ? data.data.messages : [];

  return (
    <div className="border rounded-lg">
      <Button
        variant="ghost"
        className="w-full justify-between px-4 py-3 h-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4" />
          Conversación Intercom
          {messages.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({messages.length} mensajes)
            </span>
          )}
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Cargando conversación...
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive py-4 text-center">
              Error al cargar la conversación
            </p>
          )}

          {!isLoading && !error && messages.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No se encontraron mensajes
            </p>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </div>
      )}
    </div>
  );
}
