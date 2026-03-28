import { db } from '@biffco/db'
import { workspaces, workspaceMembers, persons, credentials } from '@biffco/db/schema'
import { createId } from '@paralleldrive/cuid2'

async function testInsert() {
  const workspaceId = createId()
  const personId = createId()
  const memberId = createId()
  const credentialId = createId()

  try {
    await db.transaction(async (tx) => {
      await tx.insert(persons).values({
        id: personId,
        name: "Test Name",
        email: `test_${Date.now()}@biffco.co`,
      })
      await tx.insert(credentials).values({
        id: credentialId,
        personId,
        passwordHash: "dummyhash123",
      })
      await tx.insert(workspaces).values({
        id: workspaceId,
        name: "Test Workspace",
        slug: `test-ws-${Date.now()}`,
        verticalId: "livestock",
        plan: "free",
        settings: { country: "AR" },
      })
      await tx.insert(workspaceMembers).values({
        id: memberId,
        workspaceId,
        personId,
        publicKey: "dummypublickey1234567890abcdef",
        roles: ["admin"],
        status: "active",
        acceptedAt: new Date(),
      })
    })
    console.log("Success!")
  } catch (e) {
    console.error("DB Error:", e)
  }
}

testInsert().then(() => process.exit(0))
