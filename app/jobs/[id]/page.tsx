import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApplyButton } from '@/components/apply-button'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { getCurrentUser } from '@/lib/get-user'
import { JOB_TYPE_LABELS, formatSalary, type Job } from '@/lib/types'
import { MapPin, Building2, Banknote, ArrowLeft, CalendarDays } from 'lucide-react'

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!hasSupabaseEnv()) notFound()

  const supabase = await createClient()

  const { data } = await supabase
    .from('jobs')
    .select('*, companies(*)')
    .eq('id', id)
    .single()

  const job = data as Job | null
  if (!job) notFound()

  const { user, profile } = await getCurrentUser()

  let alreadyApplied = false
  if (user && profile?.role === 'seeker') {
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', job.id)
      .eq('seeker_id', user.id)
      .maybeSingle()
    alreadyApplied = Boolean(existing)
  }

  const salary = formatSalary(job.salary_min, job.salary_max)
  const posted = new Date(job.created_at).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" render={<Link href="/jobs" />}>
          <ArrowLeft className="mr-1 size-4" />
          Back to jobs
        </Button>

        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  {job.title}
                </h1>
                {job.companies?.name && (
                  <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                    <Building2 className="size-4" />
                    {job.companies.name}
                  </p>
                )}
              </div>
              <Badge variant="secondary">{JOB_TYPE_LABELS[job.job_type]}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {job.location}
                </span>
              )}
              {salary && (
                <span className="flex items-center gap-1.5">
                  <Banknote className="size-4" />
                  {salary}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                Posted {posted}
              </span>
            </div>
          </div>

          <hr className="my-6 border-border/60" />

          <div className="prose prose-sm max-w-none">
            <h2 className="font-heading text-lg font-semibold">About this role</h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground/90">
              {job.description}
            </p>
          </div>

          <hr className="my-6 border-border/60" />

          <ApplySection
            jobId={job.id}
            userId={user?.id}
            role={profile?.role}
            alreadyApplied={alreadyApplied}
          />
        </div>
      </main>
    </div>
  )
}

function ApplySection({
  jobId,
  userId,
  role,
  alreadyApplied,
}: {
  jobId: string
  userId?: string
  role?: string
  alreadyApplied: boolean
}) {
  if (!userId) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Sign in as a job seeker to apply.</p>
        <Button size="lg" className="w-full sm:w-auto" render={<Link href="/login" />}>
          Sign in to apply
        </Button>
      </div>
    )
  }

  if (role === 'employer') {
    return (
      <p className="text-sm text-muted-foreground">
        You&apos;re signed in as an employer. Switch to a seeker account to apply for roles.
      </p>
    )
  }

  return <ApplyButton jobId={jobId} seekerId={userId} alreadyApplied={alreadyApplied} />
}
