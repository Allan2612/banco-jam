"use client"

import { useAuthStore } from "@/lib/stores/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthDebug() {
  const { user, loading, isAuthenticated } = useAuthStore()

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-gray-800 border-gray-700 text-white opacity-80 hover:opacity-100 transition-opacity">
      <CardHeader className="py-2">
        <CardTitle className="text-sm">Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="py-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Loading:</span>
            <span>{loading ? "true" : "false"}</span>
          </div>
          <div className="flex justify-between">
            <span>Authenticated:</span>
            <span>{isAuthenticated ? "true" : "false"}</span>
          </div>
          <div>
            <span>User:</span>
            <pre className="mt-1 bg-gray-900 p-2 rounded overflow-auto max-h-40">{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
