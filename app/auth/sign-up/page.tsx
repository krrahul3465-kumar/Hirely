'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AuthShell } from '@/components/auth-shell'
import { Briefcase, User } from 'lucide-react'
import type { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function SignUpPage() {
  const [role, setRole] = useState<UserRole>('seeker')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            role,
            full_name: role === 'employer' ? companyName : fullName,
          },
        },
      })
      if (error) throw error

      // If a company account, create the company row once a session exists.
      if (role === 'employer' && data.session && data.user) {
        await supabase
          .from('companies')
          .insert({ owner_id: data.user.id, name: companyName })
      }

      router.push('/auth/sign-up-success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="font-heading text-2xl">Create your account</CardTitle>
          <CardDescription>Get started with Hirely in seconds.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <RoleOption
                active={role === 'seeker'}
                onClick={() => setRole('seeker')}
                icon={<User className="size-5" />}
                label="Job Seeker"
                hint="Find & apply"
              />
              <RoleOption
                active={role === 'employer'}
                onClick={() => setRole('employer')}
                icon={<Briefcase className="size-5" />}
                label="Employer"
                hint="Post jobs"
              />
            </div>

            {role === 'employer' ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="company">Company name</Label>
                <Input
                  id="company"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  )
}

function RoleOption({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  hint: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors',
        active
          ? 'border-primary bg-accent text-accent-foreground'
          : 'border-border bg-card hover:bg-muted',
      )}
    >
      <span className={cn(active ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </button>
  )
}
