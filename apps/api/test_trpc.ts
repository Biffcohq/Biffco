async function run() {
  const res = await fetch('http://localhost:3001/trpc/auth.register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workspaceName: "Test Space API",
      workspaceSlug: "test-space-api-" + Date.now(),
      country: "AR",
      verticalId: "livestock",
      initialRoles: ["producer"],
      personName: "API Admin",
      email: `api_${Date.now()}@test.com`,
      passwordHash: "a".repeat(70),
      publicKey: "b".repeat(70),
      wsIdx: 0
    })
  })
  const json = await res.json()
  console.log(JSON.stringify(json, null, 2))
}
run()
