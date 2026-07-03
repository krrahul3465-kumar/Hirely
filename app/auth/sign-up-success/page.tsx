import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AuthShell } from '@/components/auth-shell'
import { MailCheck } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <AuthShell>
      <Card className="border-border/60 text-center shadow-sm">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary">
            <MailCheck className="size-6" />
          </div>
          <CardTitle className="font-heading text-2xl">Check your email</CardTitle>
          <CardDescription>
            We sent you a confirmation link. Please confirm your email address to activate your
            account, then sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" render={<Link href="/login" />}>
            Go to sign in
          </Button>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
