import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Users, Zap } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Zap className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-base font-semibold">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Button asChild variant="outline" className="justify-start gap-2">
            <Link href="/incidents">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              Nueva Incidencia
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start gap-2">
            <Link href="/rmas">
              <RotateCcw className="h-4 w-4 text-purple-600" />
              Nuevo RMA
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start gap-2">
            <Link href="/clients/new">
              <Users className="h-4 w-4 text-emerald-600" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
