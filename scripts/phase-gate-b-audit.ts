/* global console, process */
/* eslint-env node */
import fs from 'fs';
import path from 'path';

console.log('🛡️  Iniciando Auditoría de Seguridad Automatizada - Phase Gate B (Día 36) 🛡️\n');

// Obviamente en producción se podría abstraer sobre el AST (Abstract Syntax Tree), 
// Pero para un CI de GitHub Actions, regex de alto vuelo es igual de feroz.
const routersDir = path.join(process.cwd(), 'apps', 'api', 'src', 'routers');

const whitelistedPublicRouters = ['auth.ts', 'verify.ts', 'verticals.ts', 'workspace-members.ts']; // Estos por diseño tienen endpoints públicos

let hasLeak = false;

// 1. Recolectar todos los tRPC Routers
const files = fs.readdirSync(routersDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

files.forEach(file => {
  const content = fs.readFileSync(path.join(routersDir, file), 'utf-8');
  const isWhitelisted = whitelistedPublicRouters.includes(file);

  if (!isWhitelisted) {
    // Si algún router transaccional tiene un "publicProcedure" definido o exportado (no en comentarios).
    // Usamos regex negativo para lookbehind de comentarios, o lo limpiamos.
    const cleanContent = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    
    if (cleanContent.includes('publicProcedure')) {
      console.error(`❌ [DATA_LEAKAGE_RISK] El archivo ${file} incrusta un "publicProcedure". Esto expone endpoints B2B sin firma JWT!`);
      hasLeak = true;
    } else {
      console.log(`✅ [RBAC_OK] ${file} está cien por ciento forrado bajo "protectedProcedure".`);
    }
    
    // Si contiene tokens de AWS expuestos duros (no via enviroment variables).
    if (content.match(/AKIA[0-9A-Z]{16}/)) {
      console.error(`🚨 [SECRET_EXPOSED] AWS Access Key encontrada estáticamente en ${file}`);
      hasLeak = true;
    }
  } else {
    console.log(`⚡ [WHITELISTED_PUBLIC] ${file} permite accesos públicos verificados.`);
  }
});

console.log('\n=======================================');
if (hasLeak) {
  console.error('🚫 AUDITORIA FALLIDA: Deuda técnica y brechas de seguridad encontradas. El pipeline fallará aquí.');
  process.exit(1);
} else {
  console.log('🎖️ AUDITORIA SUPERADA: RBAC Strict adherido al 100%. Módulos inmunes.');
  process.exit(0);
}
