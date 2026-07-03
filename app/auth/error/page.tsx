import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AuthShell } from '@/components/auth-shell'
import { TriangleAlert } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <AuthShell>
      <Card className="border-border/60 text-center shadow-sm">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" />
          </div>
          <CardTitle className="font-heading text-2xl">Something went wrong</CardTitle>
          <CardDescription>
            We couldn&apos;t complete your request. The link may have expired or already been used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" render={<Link href="/auth/login" />}>
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
