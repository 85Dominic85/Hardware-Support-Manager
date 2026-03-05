export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo - Branding */}
      <div className="hidden flex-col justify-between bg-[oklch(0.205_0.04_265)] p-10 text-white lg:flex lg:w-1/2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.623_0.214_259)] text-sm font-bold">
            HSM
          </div>
          <span className="text-lg font-semibold">Hardware Support Manager</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Gestión integral de<br />
            soporte técnico
          </h2>
          <p className="text-base text-white/60">
            Incidencias, RMAs y seguimiento completo del ciclo de vida del hardware de tus clientes.
          </p>
        </div>
        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} Hardware Support Manager
        </p>
      </div>
      {/* Panel derecho - Formulario */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        {children}
      </div>
    </div>
  );
}
