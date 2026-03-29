import type { Metadata } from "next";
import { QuickCapturePage } from "@/components/incidents/quick-capture-page";

export const metadata: Metadata = {
  title: "Captura Rápida - Intercom",
};

export default function Page() {
  return <QuickCapturePage />;
}
