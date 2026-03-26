import { defineConfig } from 'drizzle-kit'
import { env } from '@biffco/config'

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL_UNPOOLED
  },
  tablesFilter: ["!spatial_ref_sys"],
  verbose: true,
  strict: true
})
