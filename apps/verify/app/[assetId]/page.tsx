/* eslint-env node, browser */
/* global process, fetch, URL */
import { SignatureBadge } from '@biffco/ui';
import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';
import { PrintButton } from './PrintButton';

const DAGVisualizer = dynamic(
  () => import('@biffco/ui').then((mod) => mod.DAGVisualizer),
  { ssr: false, loading: () => <div className="h-[400px] flex items-center justify-center font-mono text-gray-500">Renderizando Trazabilidad...</div> }
);

interface VerifyPageProps {
  params: {
    assetId: string;
  };
}

export default async function VerifyPage({ params }: VerifyPageProps): Promise<ReactElement> {
  const { assetId } = params;

  // Edge-friendly Fetch a nuestro Backend tRPC (Cero dependencias de PostgreSQL o TCP!)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.biffco.co/trpc';
  const url = new URL(`${baseUrl}/verify.getAssetById`);
  url.searchParams.set('input', JSON.stringify({ id: assetId }));

  let res;
  try {
    res = await fetch(url.toString(), {
      cache: 'no-store', // Vital para evitar Stale Data en aduanas reales
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Error de Conexión</h1>
          <p className="mt-2 text-gray-600">No se pudo contactar al nodo de verificación. Intente nuevamente.</p>
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Activo no encontrado</h1>
          <p className="mt-2 text-gray-600">No se encontraron registros para el activo {assetId}</p>
        </div>
      </div>
    );
  }

  const { result: { data: assetData } } = await res.json();
  const event = assetData.events?.[0]; // Último evento

  // Fetch the lineage DAG graph for this asset (también compatible en Edge)
  let graphData = { nodes: [], edges: [] };
  try {
    const graphUrl = new URL(`${baseUrl}/verify.getLineageGraph`);
    graphUrl.searchParams.set('input', JSON.stringify({ id: assetId }));
    
    const [graphRes] = await Promise.all([
      fetch(graphUrl.toString(), { cache: 'no-store' })
    ]);
    if (graphRes.ok) {
       const raw = await graphRes.json();
       graphData = raw.result?.data || graphData;
    }
  } catch (err) {
    console.error("Graph Fetch Error", err);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-4 pt-8 dark:bg-[#0a0a0a] selection:bg-blue-500/30">
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* BRAND & STATUS HEADER */}
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-3">
             <img src="https://emojicdn.elk.sh/🔐" alt="Secure" className="w-6 h-6" />
             <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">BIFFCO TRUST INFRASTRUCTURE</h1>
          </div>
          
          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 w-full relative overflow-hidden">
             
             {/* Decorative Background Blob */}
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

             <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">Activo Digital Verificado</h2>
             <p className="font-mono text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight break-all">
                {assetId}
             </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold
                ${assetData.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                {assetData.status === 'ACTIVE' ? 'ESTADO CONFORME' : assetData.status}
              </span>

              {assetData.holds?.length === 0 ? (
                 <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                   Libre de Restricciones
                 </span>
              ) : (
                 <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-sm font-bold dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                   Retenido (Hold)
                 </span>
              )}
            </div>

            {assetData.holds?.length > 0 && (
              <div className="mt-6 border border-red-200 bg-red-50/50 p-4 rounded-xl dark:bg-red-950/20 dark:border-red-900/50 text-left">
                <p className="text-sm font-bold text-red-800 dark:text-red-400">⚠️ Este activo se encuentra inmovilizado comercialmente. Su transferencia a nivel global será rechazada matemáticamente.</p>
              </div>
            )}
          </div>
        </header>

        {/* LOGISTICS & DATA */}
        <main className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Card Last Event */}
             <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Último Movimiento Registrado</p>
                   <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{event ? event.eventType.replace(/_/g, ' ') : 'Registro Inicial'}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                   <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
                     {event ? new Date(event.createdAt).toLocaleString('es-AR') : 'Sin historial'}
                   </p>
                </div>
             </div>

             {/* Proof Validated */}
             <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:from-blue-900/10"></div>
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Seguridad Matemática</p>
                   <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-snug">
                     Firmas del operador validadas vía WebCrypto API desde nodos de borde (The Edge). Datos inmutables.
                   </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                   <SignatureBadge status="valid" />
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
             <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   Trazabilidad Física Inyectable
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Historial del ensamble de los componentes de este lote, auditables uno a uno.</p>
             </div>
             
             {graphData.nodes.length > 0 ? (
               <div className="w-full h-[400px] bg-[#fafafa] dark:bg-black/50">
                   <DAGVisualizer nodes={graphData.nodes} edges={graphData.edges} />
               </div>
             ) : (
               <div className="p-8 text-center bg-gray-50 dark:bg-[#0a0a0a]">
                 <p className="text-sm font-mono text-gray-400">Sin dependencias logísticas (Lote Original)</p>
               </div>
             )}
          </div>

          {/* PRINT BUTTON */}
          <div className="pt-8 pb-12 flex justify-center">
             <PrintButton />
          </div>
        </main>
      </div>
      
      {/* CSS para esconder elementos en impresion */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
           button { display: none !important; }
           body { background: white !important; }
           * { color: black !important; border-color: #ddd !important; }
        }
      `}} />
    </div>
  );
}
