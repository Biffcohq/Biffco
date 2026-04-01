export const runtime = "edge";

interface VerifyPageProps {
  params: {
    assetId: string;
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { assetId } = params;

  // En el D21 simulamos el fetch que tardaría en Edge conectándose a apps/api
  // El Skeleton de loading.tsx brillará mientras esperamos la promesa.
  await new Promise(resolve => setTimeout(resolve, 2000));

  // TODO (D22): fetch real vía HTTP al API (`/trpc/assets.getById`) sin cache.
  // Actualmente mockeamos para evidenciar el Edge Layout
  const event = {
    eventType: "MOCK_SYNC_EDGE",
    createdAt: new Date()
  };
  const anchorData = null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F9FAFB] p-6 pt-12 dark:bg-[#0C111D] animate-in fade-in">
      <div className="w-full max-w-2xl space-y-6">
        
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#101828] dark:text-[#F2F4F7]">
            Verificación de Activo Real
          </h1>
          <p className="text-sm font-mono mt-1 text-[#475467] dark:text-[#98A2B3]">
            {assetId}
          </p>
        </header>

        <main className="rounded-xl border border-[#EAECF0] bg-white p-6 shadow-sm dark:border-[#1F242F] dark:bg-[#161B26]">
          <h2 className="mb-4 text-lg font-semibold text-[#101828] dark:text-[#F2F4F7]">
             Integridad Logística
          </h2>
          
          <div className="grid grid-cols-2 gap-4 rounded bg-[#F2F4F7] p-4 dark:bg-[#1C222E]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#475467] dark:text-[#98A2B3]">Último Evento</p>
              <p className="font-mono text-sm dark:text-[#F2F4F7]">{event.eventType}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#475467] dark:text-[#98A2B3]">Timestamp</p>
              <p className="text-sm font-mono dark:text-[#F2F4F7]">
                {event.createdAt.toLocaleTimeString('es-AR')}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 p-4 rounded border border-dashed border-primary/30 bg-primary/5">
             <p className="text-sm font-bold text-primary">⚡ Edge Runtime Activo</p>
             <p className="text-xs text-text-muted">
                La página fue generada en el borde de la red geográficamente más cercano al visitante. En el Día 22 conectaremos los datos reales via Server Fetch HTTP sin romper la restricción Edge.
             </p>
          </div>
        </main>
      </div>
    </div>
  );
}
