import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/get-user'
import { UserMenu } from '@/components/user-menu'

export async function SiteHeader() {
  const { user, profile } = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="size-4" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight">Hirely</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/jobs"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse jobs
          </Link>

          {user && profile ? (
            <>
              {profile.role === 'employer' && (
                <Button size="sm" className="hidden sm:inline-flex" render={<Link href="/dashboard/employer/post" />}>
                  Post a job
                </Button>
              )}
              <UserMenu name={profile.full_name ?? 'User'} role={profile.role} />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                Sign in
              </Button>
              <Button size="sm" render={<Link href="/signup" />}>
                Get started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
