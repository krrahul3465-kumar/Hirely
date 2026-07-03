import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/get-user'
import { UserMenu } from '@/components/user-menu'

export async function SiteHeader() {
  const { user, profile } = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Briefcase className="size-4" />
          </span>
          <span className="text-xl font-bold tracking-tight text-sky-700">Hirely</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/jobs"
            className="rounded-md px-3 py-2 text-sm font-semibold text-sky-500 transition-colors hover:text-sky-700"
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
