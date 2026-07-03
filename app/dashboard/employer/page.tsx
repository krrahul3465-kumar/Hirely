import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/get-user'
import { ensureCompany } from '@/lib/ensure-company'
import { JOB_TYPE_LABELS, type Job } from '@/lib/types'
import { Plus, Users, MapPin, Briefcase } from 'lucide-react'

export default async function EmployerDashboard() {
  const { user, profile } = await getCurrentUser()
  if (!user) redirect('/login')
  if (profile?.role !== 'employer') redirect('/dashboard/seeker')

  const company = await ensureCompany(user.id, profile.full_name)
  const supabase = await createClient()

  const { data: jobsData } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  const jobs = (jobsData as Job[]) ?? []

  // Applicant counts per job
  const { data: appsData } = await supabase
    .from('applications')
    .select('job_id')
    .in('job_id', jobs.length ? jobs.map((j) => j.id) : ['00000000-0000-0000-0000-000000000000'])

  const counts = new Map<string, number>()
  for (const row of (appsData as { job_id: string }[]) ?? []) {
    counts.set(row.job_id, (counts.get(row.job_id) ?? 0) + 1)
  }

  const totalApplicants = Array.from(counts.values()).reduce((a, b) => a + b, 0)
  const openCount = jobs.filter((j) => j.status === 'open').length

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">{company.name}</h1>
            <p className="mt-1 text-muted-foreground">Manage your job postings and applicants.</p>
          </div>
          <Button render={<Link href="/dashboard/employer/post" />}>
            <Plus className="mr-1 size-4" />
            Post a job
          </Button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={<Briefcase className="size-5" />} label="Total jobs" value={jobs.length} />
          <Stat icon={<Briefcase className="size-5" />} label="Open jobs" value={openCount} />
          <Stat icon={<Users className="size-5" />} label="Applicants" value={totalApplicants} />
        </div>

        <h2 className="mb-4 font-heading text-lg font-semibold">Your postings</h2>

        {jobs.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {jobs.map((job) => {
              const count = counts.get(job.id) ?? 0
              return (
                <li
                  key={job.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold">{job.title}</h3>
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                      <Badge variant="secondary">{JOB_TYPE_LABELS[job.job_type]}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {job.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        {count} {count === 1 ? 'applicant' : 'applicants'}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" render={<Link href={`/jobs/${job.id}`} />}>
                      View
                    </Button>
                    <Button size="sm" render={<Link href={`/dashboard/employer/jobs/${job.id}/applicants`} />}>
                      Applicants ({count})
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">You haven&apos;t posted any jobs yet.</p>
            <Button className="mt-4" render={<Link href="/dashboard/employer/post" />}>
              Post your first job
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5">
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
