import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { QuickConsultationProvider } from "@/components/incidents/quick-consultation-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuickConsultationProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 bg-background p-4 sm:p-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </QuickConsultationProvider>
  );
}
