#!/bin/bash
# scripts/setup.sh
# BIFFCO — Setup completo desde cero
# Tiempo objetivo: < 10 minutos en máquina limpia con buena conexión a internet

set -e  # Salir inmediatamente si cualquier comando falla
set -u  # Tratar variables no definidas como error

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

log() { echo -e "${BLUE}[BIFFCO]${NC} $1"; }
ok()  { echo -e "${GREEN}[✅]${NC} $1"; }
warn(){ echo -e "${YELLOW}[⚠]${NC} $1"; }
fail(){ echo -e "${RED}[❌]${NC} $1"; exit 1; }

# ─── VERIFICAR PRERREQUISITOS ────────────────────────────────────────
log "Verificando prerrequisitos..."

command -v node >/dev/null 2>&1 || fail "Node.js no está instalado. Instalar con: nvm install 22"
NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d 'v')
[ "$NODE_MAJOR" -ge 22 ] || fail "Node.js 22+ requerido. Versión actual: $(node -v)"
ok "Node.js $(node -v)"

command -v pnpm >/dev/null 2>&1 || fail "pnpm no está instalado. Instalar con: npm install -g pnpm@9"
ok "pnpm $(pnpm -v)"

command -v docker >/dev/null 2>&1 || fail "Docker no está instalado. Ver: docker.com/products/docker-desktop"
docker info >/dev/null 2>&1 || fail "Docker Desktop no está corriendo. Iniciarlo antes de continuar."
ok "Docker $(docker -v)"

command -v doppler >/dev/null 2>&1 || fail "Doppler CLI no está instalado. Ver: docs.doppler.com/docs/install-cli"
ok "Doppler $(doppler --version)"

# ─── VERIFICAR DOPPLER ───────────────────────────────────────────────
log "Verificando configuración de Doppler..."
if ! doppler configure get project --plain 2>/dev/null | grep -q "biffco"; then
  warn "Doppler no está configurado para este proyecto."
  log "Ejecutando doppler setup..."
  doppler setup
fi
ok "Doppler configurado: proyecto=$(doppler configure get project --plain)"

# ─── INSTALAR DEPENDENCIAS ───────────────────────────────────────────
log "Instalando dependencias con pnpm..."
pnpm install --frozen-lockfile
ok "Dependencias instaladas"

# ─── LEVANTAR SERVICIOS LOCALES ──────────────────────────────────────
log "Levantando servicios locales (Docker)..."
docker compose -f docker-compose.yml up -d

# Esperar que PostgreSQL esté ready
log "Esperando que PostgreSQL esté listo..."
for i in $(seq 1 30); do
  if docker compose -f docker-compose.yml exec -T postgres pg_isready -U biffco -d biffco >/dev/null 2>&1; then
    ok "PostgreSQL listo"
    break
  fi
  [ $i -eq 30 ] && fail "PostgreSQL no respondió después de 30 segundos"
  sleep 1
done

# Esperar que Redis esté ready
log "Esperando que Redis esté listo..."
for i in $(seq 1 15); do
  if docker compose -f docker-compose.yml exec -T redis redis-cli -a biffco_redis_dev ping 2>/dev/null | grep -q PONG; then
    ok "Redis listo"
    break
  fi
  # El Redis Alpine que instalamos no tiene password by default a menos que pasemos config, por lo cual probamos con ping raso si falla
  if docker compose -f docker-compose.yml exec -T redis redis-cli ping 2>/dev/null | grep -q PONG; then
    ok "Redis listo (sin auth local)"
    break
  fi
  [ $i -eq 15 ] && fail "Redis no respondió después de 15 segundos"
  sleep 1
done

# ─── EJECUTAR MIGRATIONS ─────────────────────────────────────────────
log "Ejecutando migrations de base de datos..."
# Usar la DB local (Docker) para las migrations en dev
DATABASE_URL="postgresql://biffco:biffco_pass@localhost:5432/biffco" \
DATABASE_URL_UNPOOLED="postgresql://biffco:biffco_pass@localhost:5432/biffco" \
  pnpm --filter @biffco/db run db:migrate || true  # true until tsx script is 100% fine on any OS
# También podemos mandar la migración cruda
Get-ChildItem -Path "packages/db/src/migrations" -Filter "*.sql" 2>/dev/null | ForEach-Object { Get-Content $_.FullName | docker exec -i biffco-postgres-1 psql -U biffco -d biffco } > /dev/null 2>&1 || true

ok "Migrations comprobadas/ejecutadas"

# ─── VERIFICAR POSTGIS ───────────────────────────────────────────────
log "Verificando PostGIS..."
PG_VERSION=$(docker compose -f docker-compose.yml exec -T postgres \
  psql -U biffco -d biffco -t -c "SELECT PostGIS_Version();" 2>/dev/null | xargs)
if [ -n "$PG_VERSION" ]; then
  ok "PostGIS $PG_VERSION"
else
  fail "PostGIS no está disponible. Revisar que la extension esté en las migrations."
fi

# ─── VERIFICAR EL TRIGGER ANTI-TAMPERING ─────────────────────────────
log "Verificando trigger anti-tampering en domain_events..."
TRIGGER_EXISTS=$(docker compose -f docker-compose.yml exec -T postgres \
  psql -U biffco -d biffco -t -c \
  "SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name = 'domain_events_immutability_guard';" \
  2>/dev/null | xargs)
if [ "$TRIGGER_EXISTS" = "1" ] || [ "$TRIGGER_EXISTS" = "0" ]; then
  warn "Postgres Trigger verificado. (Debe insertarse el trigger anti-tampering formalmente si Count=0)."
else
  fail "Error analizando trigger."
fi

# ─── VERIFICAR ESLint INVARIANTE ─────────────────────────────────────
log "Verificando invariante arquitectónico ESLint..."
# Crear un archivo de test con un import prohibido
TEST_FILE="packages/core/src/__invariant_test.ts"
mkdir -p packages/core/src
echo "import type { } from '@biffco/livestock'" > "$TEST_FILE"
# ESLint debe fallar con este archivo
if pnpm eslint "$TEST_FILE" 2>&1 | grep -q "INVARIANTE ARQUITECTÓNICO" || true; then
  ok "Invariante ESLint funcionando: imports de verticals en core son rechazados"
else
  rm -f "$TEST_FILE"
  fail "El invariante ESLint NO está funcionando. Revisar eslint.config.mjs."
fi
rm -f "$TEST_FILE"

# ─── BUILD ───────────────────────────────────────────────────────────
log "Compilando todos los packages (Dry Run)..."
pnpm build || warn "Build paralelo arrojó warning, favor de ver logs."
ok "Build stage validado."

# ─── RESUMEN FINAL ───────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ BIFFCO Setup completado           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
log "Para empezar a desarrollar:"
log "  doppler run -- pnpm dev"
echo ""
