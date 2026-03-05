import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuración</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Módulo en desarrollo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            La configuración del sistema estará disponible próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
