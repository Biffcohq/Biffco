"use client"
export default function ErrorBoundary({ error }: { error: Error }) {
  console.error("ROUTE BUILD ERROR:", error)
  return <div>Route Error: {error.message}</div>
}
