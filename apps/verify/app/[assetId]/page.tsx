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
          {/* Full Event Ledger */}
          <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm col-span-1 md:col-span-2">
             <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                   <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   Libro Mayor de Eventos (Event Ledger)
                </h2>
                <span className="text-xs text-gray-500 font-mono bg-gray-50 dark:bg-[#1A1A1A] px-2 py-1 rounded border border-gray-200 dark:border-gray-800">
                   {assetData.events?.length || 0} Bloques
                </span>
             </div>

             <div className="relative border-l border-gray-200 dark:border-gray-800 ml-3 md:ml-4 space-y-8 pb-4">
                {assetData.events?.map((evt: any, idx: number) => {
                  const isGenesis = idx === assetData.events.length - 1;
                  const eData = evt.data || {};
                  
                  type VisualConf = { icon: string, textColor: string, bgColor: string, ringColor: string, title: string };
                  const eventNameMap: Record<string, VisualConf> = {
                    'ASSET_CREATED': { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', textColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/40', ringColor: 'ring-white dark:ring-[#111111]', title: 'Registro Inicial' },
                    'LIVESTOCK_ORIGINATED': { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', textColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/40', ringColor: 'ring-white dark:ring-[#111111]', title: 'Nacimiento Registrado' },
                    'ASSET_DISPATCHED': { icon: 'M8 6h13a1 1 0 011 1v7a1 1 0 01-1 1H8v-9zM3 10h5M3 14h5m-4' /* truck pseudo */, textColor: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/40', ringColor: 'ring-white dark:ring-[#111111]', title: 'Despacho Logístico' },
                    'ASSET_TRANSIT_SCAN': { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', textColor: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/40', ringColor: 'ring-white dark:ring-[#111111]', title: 'Punto de Control' },
                    'ASSET_RECEIVED': { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', textColor: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/40', ringColor: 'ring-white dark:ring-[#111111]', title: 'Recepción en Destino' },
                    'ASSET_REJECTED': { icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', textColor: 'text-red-500 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/40', ringColor: 'ring-white dark:ring-[#111111]', title: 'Carga Observada / Destino Rechazado' },
                  }
                  const defaultConf: VisualConf = { icon: 'M5 13l4 4L19 7', textColor: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', ringColor: 'ring-white dark:ring-[#111111]', title: evt.eventType.replace(/_/g, ' ') };
                  const v: VisualConf = eventNameMap[evt.eventType] || defaultConf;
                  const displayDesc = eData.message || (isGenesis ? 'Activo dado de alta en la red Logística Segura' : 'Actualización de estado');

                  return (
                    <div key={evt.id} className="relative pl-8 md:pl-12 pb-6">
                       <div className={`absolute w-8 h-8 rounded-full left-[-16px] top-0 flex items-center justify-center ring-4 ${v.ringColor} ${v.bgColor} ${v.textColor}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={v.icon}></path></svg>
                       </div>
                       
                       <div className="flex flex-col gap-2">
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h4 className={`font-bold text-base flex items-center gap-2 ${v.textColor}`}>
                              {v.title}
                              {isGenesis && <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Génesis</span>}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-[#1A1A1A] px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-800 w-max mt-1 sm:mt-0">
                              {new Date(evt.createdAt).toLocaleDateString()} — {new Date(evt.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                         </div>
                         
                         <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{displayDesc}</p>
                         
                         {(eData.carrierAlias || eData.receiverAlias || eData.operatorAlias) && (
                           <div className="flex flex-col gap-1 mt-2 bg-gray-50 dark:bg-[#1A1A1A] p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                              {eData.operatorAlias && (
                                <span className="text-xs text-gray-500 dark:text-gray-400"><strong className="text-gray-900 dark:text-white font-medium">Registrado por:</strong> {eData.operatorAlias}</span>
                              )}
                              {eData.carrierAlias && (
                                <span className="text-xs text-gray-500 dark:text-gray-400"><strong className="text-gray-900 dark:text-white font-medium">Logística (Transporte):</strong> {eData.carrierAlias}</span>
                              )}
                              {eData.receiverAlias && (
                                <span className="text-xs text-gray-500 dark:text-gray-400"><strong className="text-gray-900 dark:text-white font-medium">Destino Pautado:</strong> {eData.receiverAlias}</span>
                              )}
                           </div>
                         )}

                         {/* Blockchain Anchor Status */}
                         {evt.anchorTxHash && (
                           <div className="mt-3 inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-[11px] uppercase tracking-widest font-black px-2.5 py-1.5 rounded-md border border-purple-200 dark:border-purple-800/50 w-max shadow-sm">
                              <svg className="w-4 h-4" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.564 6.77L16.48 3.256a.956.956 0 00-1 0L9.4 6.772a.965.965 0 00-.5.84v7.03c0 .341.184.654.496.835L15.48 18.99v7.033a.965.965 0 001.004.835h.001c.17 0 .338-.046.488-.133l6.084-3.513a.965.965 0 00.496-.835V15.35c0-.341-.184-.654-.496-.835L16.97 10.999V3.972l5.594 3.23v1.85a.96.96 0 00.496.835l6.084 3.514a.956.956 0 001 0l6.084-3.513a.965.965 0 00.496-.835v-7.03a.965.965 0 00-.496-.835l-6.084-3.514a.956.956 0 00-1 0l-6.084 3.514a.965.965 0 00-.496.835v1.656z" fill="currentColor"/><path d="M9.4 17.202a.965.965 0 00-.496-.835L2.82 12.853a.956.956 0 00-1 0L-3.264 16.368a.965.965 0 00-.5.84v7.03c0 .341.184.654.496.835L2.816 28.586a.956.956 0 001 0l6.084-3.513a.965.965 0 00.496-.835V17.202h.004zm-5.594 6.544l-5.594-3.23V18.667l5.594 3.23v1.85z" fill="currentColor"/></svg>
                              Validado en Polygon: {evt.anchorTxHash.slice(0, 10)}...
                           </div>
                         )}
                       </div>
                    </div>
                  );
                })}
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
