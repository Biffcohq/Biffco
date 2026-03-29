"use client";
/* global process */
import type { ReactElement } from 'react';
import { 
  IconWorld, 
  IconMoon,
  IconSun,
  IconChevronDown,
  IconShieldLock, 
  IconCpu, 
  IconAnchor, 
  IconLeaf, 
  IconTruck, 
  IconCertificate,
  IconCheck,
  IconBrandGithub,
  IconBrandYoutube,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandDiscord,
  IconBrandSpotify
} from '@tabler/icons-react';

export default function LandingPage(): ReactElement {
  const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL || 'https://platform.biffco.co';

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-16">
            {/* Logo wrapper perfectly centered */}
            <a href="/" className="flex items-center pb-[2px]">
              <img src="/biffco-iso-color.svg" alt="Biffco" className="h-6 w-auto sm:hidden" />
              <img src="/biffco-logo-color.svg" alt="Biffco" className="h-[26px] w-auto hidden sm:block" />
            </a>
            
            <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[var(--color-text-secondary)] ml-8">
              <button className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors group">
                Products <IconChevronDown size={14} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors" />
              </button>
              <button className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors group">
                Resources <IconChevronDown size={14} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors" />
              </button>
              <button className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors group">
                Solutions <IconChevronDown size={14} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors" />
              </button>
              <a href="#enterprise" className="hover:text-[var(--color-text-primary)] transition-colors">Enterprise</a>
              <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors">Pricing</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[var(--color-text-secondary)] border-r border-[var(--color-border)] pr-4 mr-2">
              <button aria-label="Cambiar idioma" className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-overlay)] transition-colors text-[var(--color-text-secondary)]">
                <IconWorld size={18} stroke={1.5} />
              </button>
              <button aria-label="Cambiar tema" className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-overlay)] transition-colors text-[var(--color-text-secondary)]">
                <IconMoon size={18} stroke={1.5} />
              </button>
            </div>
            
            <a 
              href={`${platformUrl}/login`} 
              className="h-9 px-4 flex items-center justify-center text-sm font-medium border border-[var(--color-border)] rounded-full hover:bg-[var(--color-surface-overlay)] text-[var(--color-text-primary)] transition-colors"
            >
              Log In
            </a>
            <a 
              href={`${platformUrl}/signup`} 
              className="h-9 px-4 flex items-center justify-center text-sm font-medium rounded-full text-[var(--color-bg)] bg-[var(--color-text-primary)] hover:opacity-90 transition-colors shadow-sm"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* HERO SECTION - 100vh height */}
        <section className="w-full relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center border-b border-[var(--color-border)] overflow-hidden bg-[var(--color-surface-raised)]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 z-0 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)', backgroundSize: '4rem 4rem', opacity: 0.3 }} 
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] to-transparent pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col items-center max-w-5xl mt-[-8vh]">
            <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] font-bold tracking-tighter text-[var(--color-text-primary)] leading-[1.05] mb-6">
              Build and deploy on the <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-text-secondary)]">
                on the Trust Cloud.
              </span>
            </h1>

            <p className="text-[17px] md:text-lg text-[var(--color-text-secondary)] max-w-2xl font-normal leading-relaxed mt-4 px-4">
              BIFFCO provides the developer tools and cryptographic infrastructure <br className="hidden md:block"/>
              to build, scale, and secure verified global value chains.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a 
                href={`${platformUrl}/signup`}
                className="h-12 px-8 text-base font-medium inline-flex items-center justify-center gap-2 bg-[var(--color-text-primary)] text-[var(--color-bg)] rounded-full hover:scale-105 transition-transform shadow-md"
              >
                Start Deploying
              </a>
              <a 
                href="/contact"
                className="h-12 px-8 text-base font-medium inline-flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-full hover:bg-[var(--color-surface-raised)] transition-colors shadow-sm"
              >
                Get a Demo
              </a>
            </div>
            
            <p className="mt-8 text-sm text-[var(--color-text-muted)] font-mono opacity-80">~ pnpm install @biffco/core</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="w-full bg-[var(--color-surface-raised)] border-y border-[var(--color-border)] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                ¿Por qué no usar papel o un PDF?
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl">
                En las cadenas de distribución tradicionales, los documentos pueden editarse en segundos y los sistemas de cada empresa están desconectados. BIFFCO cambia las reglas fundamentales de los registros.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center mb-2">
                  <IconShieldLock className="text-[var(--color-primary)]" size={24} stroke={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Solo agregar, nunca borrar</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Es como escribir con tinta permanente. Una vez que algo queda registrado, no hay forma de borrarlo. Si alguien se equivoca, agrega una corrección, pero la historia original permanece.
                </p>
              </div>
              
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-[var(--color-purple-subtle)] flex items-center justify-center mb-2">
                  <IconCpu className="text-[var(--color-purple)]" size={24} stroke={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Firma Digital Irrefutable</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Cada anotación requiere la firma criptográfica de quien la realizó. Esa huella matemática es infalsificable y puede ser verificada sin necesidad de confiar en BIFFCO.
                </p>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-[var(--color-teal-subtle)] flex items-center justify-center mb-2">
                  <IconAnchor className="text-[var(--color-teal)]" size={24} stroke={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Verificación Descentralizada</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Una copia del avance cronológico de los activos se ancla en redes blockchain públicas. Incluso si nuestros servidores desaparecen, tu historial auditado sobrevivirá.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INDUSTRIES AFFECTED */}
        <section id="industries" className="w-full py-24 bg-[var(--color-surface)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4 tracking-tight">Cualquier Industria, Un Mismo Protocolo</h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                No importa si tu negocio es de manufactura, farmacéutico, minería o agro. Si tocás un producto físico, necesitás trazabilidad verificable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] flex flex-col gap-3">
                <IconLeaf className="text-[var(--color-success)]" size={28} stroke={1.5} />
                <h4 className="font-semibold text-[var(--color-text-primary)]">Materias Primas</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">Soja, madera, café, cacao. Demostrá con datos irrefutables que no provienen de suelos deforestados (EUDR).</p>
              </div>
              <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] flex flex-col gap-3">
                <IconCpu className="text-[var(--color-purple)]" size={28} stroke={1.5} />
                <h4 className="font-semibold text-[var(--color-text-primary)]">Baterías & Minería</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">Pasaportes digitales obligatorios para certificar el origen legal y responsable de litio y minerales críticos.</p>
              </div>
              <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] flex flex-col gap-3">
                <IconCertificate className="text-[var(--color-primary)]" size={28} stroke={1.5} />
                <h4 className="font-semibold text-[var(--color-text-primary)]">Farma / Laboratorios</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">Trazabilidad estricta y auditorías inmutables de cada etapa en la producción de medicamentos.</p>
              </div>
              <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] flex flex-col gap-3">
                <IconTruck className="text-[var(--color-orange)]" size={28} stroke={1.5} />
                <h4 className="font-semibold text-[var(--color-text-primary)]">Logística y Alimentos</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">Resolvé recalls sanitarios y cumplí con normativas aduaneras (FSMA 204) al instante a nivel lote.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="w-full py-24 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">Pricing that scales with you.</h2>
              <p className="text-lg text-[var(--color-text-secondary)]">Start for free, upgrade when you need advanced compliance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
              {/* Hobby */}
              <div className="p-8 md:border-r border-b md:border-b-0 border-[var(--color-border)] flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Hobby</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] pt-1">The perfect starting place for your web app or personal project.</p>
                </div>
                <div className="text-3xl font-bold text-[var(--color-text-primary)]">Free</div>
                <ul className="text-sm text-[var(--color-text-secondary)] flex flex-col gap-3 flex-1 pt-4">
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Up to 300 assets/mo</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Client-side signatures</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Public Verification QR</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Standard SLAs</li>
                </ul>
                <a href={`${platformUrl}/signup`} className="h-10 w-full flex items-center justify-center rounded-full border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-surface-raised)] mt-6 text-[var(--color-text-primary)]">
                  Start Deploying
                </a>
              </div>
              
              {/* Pro */}
              <div className="p-8 md:border-r border-b md:border-b-0 border-[var(--color-border)] flex flex-col gap-6 relative bg-[var(--color-surface-overlay)]">
                <div className="absolute top-0 left-[50%] -translate-x-1/2 -translate-y-px py-1 px-4 bg-[var(--color-text-primary)] text-[var(--color-bg)] text-[11px] font-bold rounded-b-md tracking-wider uppercase shadow-md">Popular</div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Pro</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] pt-1">Everything you need to build and scale your app securely.</p>
                </div>
                <div className="text-3xl font-bold text-[var(--color-text-primary)]">$349<span className="text-lg font-normal text-[var(--color-text-secondary)]">/mo</span></div>
                <ul className="text-sm text-[var(--color-text-secondary)] flex flex-col gap-3 flex-1 pt-4">
                  <li className="font-medium text-[var(--color-text-primary)]">All Hobby features, plus:</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Unlimited assets</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Public Blockchain Anchor</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Automated EUDR Alerts</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Team Collaboration</li>
                </ul>
                <a href={`${platformUrl}/signup`} className="h-10 w-full flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[#2563EB] mt-6 shadow-sm">
                  Start a free trial
                </a>
              </div>
              
              {/* Enterprise */}
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Enterprise</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] pt-1">Critical security, performance, observability, and support.</p>
                </div>
                <div className="text-3xl font-bold text-[var(--color-text-primary)]">Custom</div>
                <ul className="text-sm text-[var(--color-text-secondary)] flex flex-col gap-3 flex-1 pt-4">
                  <li className="font-medium text-[var(--color-text-primary)]">All Pro features, plus:</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Guest & Team Access Controls</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Multi-tenant environments</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> Dedicated Solutions Architect</li>
                  <li className="flex items-center gap-2"><IconCheck size={16} className="text-[var(--color-text-primary)]" /> 99.99% SLA</li>
                </ul>
                <a href="/contact" className="h-10 w-full flex items-center justify-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] text-sm font-medium hover:opacity-90 mt-6 shadow-sm">
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full bg-[var(--color-bg)] py-24 border-t border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
              Ready to deploy?
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-4">
              Start building your next verified value chain with BIFFCO.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`${platformUrl}/signup`}
                className="h-12 px-8 text-base font-medium inline-flex items-center justify-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] hover:opacity-90 shadow-md"
              >
                Start Deploying
              </a>
              <a 
                href="/contact"
                className="h-12 px-8 text-base font-medium inline-flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)] shadow-sm"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[var(--color-bg)] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-12 pb-16">
            
            {/* Column 0: Biffco Isotipo (Left side) */}
            <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-1 flex flex-col items-start gap-4">
              <a href="/" className="hover:opacity-80 transition-opacity inline-block" aria-label="Biffco Home">
                <img src="/biffco-iso-color.svg" alt="Biffco" className="h-4 w-auto" />
              </a>
              <div className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                <strong className="font-semibold text-[var(--color-text-primary)] font-mono text-[11px] uppercase tracking-wider">Biffco Inc.</strong><br/>
                Global Headquarters<br/>
                Buenos Aires, AR.
              </div>
            </div>
            
            {/* Column 1 */}
            <div className="flex flex-col">
              <h4 className="text-[12px] font-semibold tracking-wider text-[var(--color-text-primary)] uppercase mb-6">Products</h4>
              <nav className="flex flex-col gap-3.5">
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Event Ledger</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Asset Passports</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">EUDR Compliance</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Digital Twins</a>
              </nav>
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col">
              <h4 className="text-[12px] font-semibold tracking-wider text-[var(--color-text-primary)] uppercase mb-6">Platform</h4>
              <nav className="flex flex-col gap-3.5">
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Verification Nodes</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors inline-flex items-center gap-2">API & Webhooks <span className="text-[9px] bg-[var(--color-surface-raised)] border border-[var(--color-border)] px-1.5 py-0.5 rounded font-mono font-medium">NEW</span></a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Enterprise</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Security</a>
              </nav>
            </div>
            
            {/* Column 3 */}
            <div className="flex flex-col">
              <h4 className="text-[12px] font-semibold tracking-wider text-[var(--color-text-primary)] uppercase mb-6">Verticals</h4>
              <nav className="flex flex-col gap-3.5">
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Agribusiness</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Mining</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Manufacturing</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Supply Chain</a>
              </nav>
            </div>
            
            {/* Column 4 */}
            <div className="flex flex-col">
              <h4 className="text-[12px] font-semibold tracking-wider text-[var(--color-text-primary)] uppercase mb-6">Resources</h4>
              <nav className="flex flex-col gap-3.5">
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Documentation</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Pricing</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Changelog</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Customers</a>
              </nav>
            </div>
            
            {/* Column 5 */}
            <div className="flex flex-col">
              <h4 className="text-[12px] font-semibold tracking-wider text-[var(--color-text-primary)] uppercase mb-6">Company</h4>
              <nav className="flex flex-col gap-3.5">
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">About</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Careers</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Contact</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Press</a>
              </nav>
            </div>
            
            {/* Column 6 */}
            <div className="flex flex-col relative">
              <h4 className="text-[12px] font-semibold tracking-wider text-[var(--color-text-primary)] uppercase mb-6">Legal</h4>
              <nav className="flex flex-col gap-3.5">
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Privacy Policy</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Terms of Service</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Cookie Policy</a>
                <a href="#" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Trust Center</a>
              </nav>
            </div>
          </div>
          
          {/* Bottom Bar: System Status, Copyright + Links, Toggles */}
          <div className="flex flex-col xl:flex-row justify-between items-center gap-6 pt-8 mt-8 border-t border-[var(--color-border)] w-full">
            
            {/* Left/Center: Status, Copyright and Policies */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 w-full xl:w-auto justify-center xl:justify-start">
              <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0 h-6">
                <div className="w-2.5 h-2.5 bg-[#0070F3] rounded-[1px]" />
                <span className="font-mono text-[12px] font-semibold text-[#0070F3] tracking-wider uppercase leading-none mt-[1px]">
                  All systems normal.
                </span>
              </a>
              
              <div className="hidden md:block h-4 w-px bg-[var(--color-border)]"></div>
              
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[var(--color-text-secondary)] text-[13px] h-6">
                <span className="leading-none mt-[1px]">© {new Date().getFullYear()} BIFFCO Inc. All rights reserved.</span>
                <span className="opacity-40 hidden md:inline leading-none mt-[1px] text-[10px]">●</span>
                <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors leading-none mt-[1px]">Privacy</a>
                <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors leading-none mt-[1px]">Terms</a>
                <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors leading-none mt-[1px]">Cookies</a>
                <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors leading-none mt-[1px]">Disclaimers</a>
              </div>
            </div>
            
            {/* Right: Social & Toggles */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--color-text-secondary)] w-full xl:w-auto">
              <div className="flex items-center gap-3.5 h-6">
                <a href="https://github.com/biffco" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center" aria-label="GitHub"><IconBrandGithub size={18} stroke={1.5} /></a>
                <a href="https://twitter.com/biffco" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center" aria-label="X (Twitter)">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                </a>
                <a href="https://facebook.com/biffco" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center" aria-label="Facebook"><IconBrandFacebook size={18} stroke={1.5} /></a>
                <a href="https://instagram.com/biffco" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center" aria-label="Instagram"><IconBrandInstagram size={18} stroke={1.5} /></a>
                <a href="https://tiktok.com/@biffco" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center" aria-label="TikTok"><IconBrandTiktok size={18} stroke={1.5} /></a>
                <a href="https://discord.gg/biffco" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center" aria-label="Discord"><IconBrandDiscord size={18} stroke={1.5} /></a>
                <a href="https://youtube.com/biffco" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center" aria-label="YouTube"><IconBrandYoutube size={18} stroke={1.5} /></a>
                <a href="https://spotify.com/biffco" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center" aria-label="Spotify"><IconBrandSpotify size={18} stroke={1.5} /></a>
              </div>
              
              <div className="h-4 w-px bg-[var(--color-border)] mx-1 hidden md:block"></div>
              
              {/* Vercel-style toggle group context menu */}
              <div className="hidden sm:flex items-center justify-center h-8 px-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full hover:border-[var(--color-border-strong)] transition-colors cursor-pointer text-[var(--color-text-secondary)]">
                <div className="h-6 w-6 flex items-center justify-center rounded-full bg-[var(--color-bg)] shadow-sm mx-0.5 text-[var(--color-text-primary)] border border-[var(--color-border)]">
                  <IconWorld size={14} stroke={1.5} />
                </div>
                <div className="h-6 w-6 flex items-center justify-center rounded-full mx-0.5 hover:text-[var(--color-text-primary)]">
                  <IconSun size={14} stroke={1.5} />
                </div>
                <div className="h-6 w-6 flex items-center justify-center rounded-full mx-0.5 hover:text-[var(--color-text-primary)]">
                  <IconMoon size={14} stroke={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
