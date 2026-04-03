import { db } from '@biffco/db'
import { assets } from '@biffco/db/schema'
import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'

async function tryInsert() {
  try {
     console.log("Attempting insert...");
     await db.transaction(async (tx) => {
        // Mock set_config to avoid RLS error
        await tx.execute(sql`SELECT set_config('app.current_workspace', 'qo1ujapueumrdsja50xtak9u', true)`)
        const [res] = await tx.insert(assets).values({
          id: createId(),
          workspaceId: 'qo1ujapueumrdsja50xtak9u',
          verticalId: 'bif-bovine-ar',
          type: 'AnimalAsset',
          status: 'ACTIVE',
          locationId: null,
          metadata: { test: true }
        }).returning()
        console.log("INSERT SUCCESS", res);
     })
  } catch (err: any) {
     console.error("EXACT DB ERROR:", err.message);
  } finally {
     process.exit(0);
  }
}

tryInsert();
