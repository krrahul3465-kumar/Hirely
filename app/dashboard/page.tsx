import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/get-user'
import { JOB_TYPE_LABELS, type Job } from '@/lib/types'
import { Building2, MapPin, Search } from 'lucide-react'

interface ApplicationRow {
  id: string
  applied_at: string
  jobs: Job | null
}

export default async function SeekerDashboard() {
  const { user, profile } = await getCurrentUser()
  if (!user) redirect('/login')
  if (profile?.role === 'employer') redirect('/dashboard/employer')

  const supabase = await createClient()
  const { data } = await supabase
    .from('applications')
    .select('id, applied_at, jobs(*, companies(*))')
    .eq('seeker_id', user.id)
    .order('applied_at', { ascending: false })

  const applications = (data as unknown as ApplicationRow[]) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              Hi, {profile?.full_name ?? 'there'}
            </h1>
            <p className="mt-1 text-muted-foreground">Track the roles you&apos;ve applied to.</p>
          </div>
          <Button render={<Link href="/jobs" />}>
            <Search className="mr-1 size-4" />
            Find more jobs
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-heading text-lg font-semibold">My applications</h2>
          <Badge variant="secondary">{applications.length}</Badge>
        </div>

        {applications.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {applications.map((app) => (
              <li key={app.id}>
                {app.jobs ? (
                  <Link
                    href={`/jobs/${app.jobs.id}`}
                    className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-semibold">{app.jobs.title}</h3>
                        <Badge variant="secondary">{JOB_TYPE_LABELS[app.jobs.job_type]}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {app.jobs.companies?.name && (
                          <span className="flex items-center gap-1">
                            <Building2 className="size-3.5" />
                            {app.jobs.companies.name}
                          </span>
                        )}
                        {app.jobs.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {app.jobs.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </span>
                  </Link>
                ) : (
                  <div className="rounded-xl border border-border/60 bg-card p-5 text-sm text-muted-foreground">
                    This job is no longer available.
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">You haven&apos;t applied to any jobs yet.</p>
            <Button className="mt-4" render={<Link href="/jobs" />}>
              Browse open roles
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
