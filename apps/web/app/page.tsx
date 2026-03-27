export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center gap-2 rounded-full py-2 px-4 bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-medium text-sm border border-[var(--color-primary)]/20 shadow-sm animate-in fade-in duration-500">
          <span className="h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse" />
          Fase 0 - Foundation en Verde 🟢
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text-primary)] max-w-4xl leading-tight">
          Trust Infrastructure for <br className="hidden md:block" />
          <span className="text-[var(--color-primary)]">Global Value Chains</span>
        </h1>

        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl font-normal leading-relaxed">
          BIFFCO™ permite que cada transformación, traslado e incidencia sea 
          <span className="font-mono text-[13px] bg-[var(--color-surface-overlay)] py-0.5 px-1.5 rounded-sm ml-1 text-[var(--color-text-primary)]">criptográficamente_irrefutable</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button className="h-12 px-8 text-base rounded-full font-medium inline-flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 active:scale-95 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm">
            Explorar Verticales
          </button>
          <button className="h-12 px-8 text-base rounded-full font-medium inline-flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 active:scale-95 bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] shadow-xs">
            Leer Arquitectura
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full bg-[var(--color-surface)] border-y border-[var(--color-border)] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Arquitectura Agnóstica</h2>
            <p className="text-base text-[var(--color-text-secondary)]">El Core no sabe qué es una vaca ni qué es un mineral. Solo entiende de inmutabilidad.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col gap-4">
              <div className="h-12 w-12 rounded-full bg-[var(--color-success-subtle)] flex items-center justify-center">
                <span className="text-[var(--color-success)] font-bold text-xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Compliance Regulatorio</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Nuestros <span className="font-medium text-[var(--color-text-primary)]">VerticalPacks</span> implementan frameworks como la normativa EUDR o la EU Battery Regulation automáticamente.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col gap-4">
              <div className="h-12 w-12 rounded-full bg-[var(--color-teal-subtle)] flex items-center justify-center">
                <span className="font-mono text-[var(--color-teal)] font-medium">Tx</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Client-Side Signing</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Ed25519 end-to-end. Las firmas ocurren en tu dispositivo. BIFFCO no puede falsificar eventos a tu nombre.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col gap-4">
              <div className="h-12 w-12 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center">
                <span className="text-[var(--color-primary)] font-bold">DAG</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Linaje Completo</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Soporte nativo para agrupaciones temporales (Groups), subdivisiones y transformaciones atómicas dentro de la DB.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verticals Focus */}
      <section id="verticals" className="w-full bg-[var(--color-navy)] py-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-10">Módulos Activos</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex-1 backdrop-blur-sm max-w-sm">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                🐄 Ganadería (EUDR 2026)
              </h3>
              <p className="text-sm text-[#94A3B8]">Desde la parcela de recría en Santa Fe hasta el contenedor de cortes congelados para UE.</p>
            </div>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-strong)] p-6 rounded-xl flex-1 max-w-sm relative opacity-90">
              <div className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-warning-subtle)] text-[var(--color-warning)]">
                Próximamente
              </div>
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2 text-[var(--color-navy)]">
                ⛏️ Minería Crítica
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Battery precursors, minerales libres de conflicto y trazabilidad IRMA on-chain.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
