import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/get-user'
import { JOB_TYPE_LABELS, type Job, type Profile } from '@/lib/types'
import { ArrowLeft, User } from 'lucide-react'

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { user, profile } = await getCurrentUser()
  if (!user) redirect('/auth/login')
  if (profile?.role !== 'employer') redirect('/dashboard')

  const supabase = await createClient()

  // Load the job and verify ownership via company.
  const { data: jobData } = await supabase
    .from('jobs')
    .select('*, companies(*)')
    .eq('id', id)
    .single()

  const job = jobData as Job | null
  if (!job) notFound()
  if (job.companies?.owner_id !== user.id) redirect('/employer')

  const { data: apps } = await supabase
    .from('applications')
    .select('id, seeker_id, applied_at')
    .eq('job_id', id)
    .order('applied_at', { ascending: false })

  const applications = (apps as { id: string; seeker_id: string; applied_at: string }[]) ?? []

  // Fetch seeker profiles separately (no direct FK to embed).
  const profilesById = new Map<string, Profile>()
  if (applications.length > 0) {
    const { data: seekers } = await supabase
      .from('profiles')
      .select('*')
      .in(
        'id',
        applications.map((a) => a.seeker_id),
      )
    for (const p of (seekers as Profile[]) ?? []) profilesById.set(p.id, p)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link href="/employer">
            <ArrowLeft className="mr-1 size-4" />
            Back to dashboard
          </Link>
        </Button>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{job.title}</h1>
            <Badge variant="secondary">{JOB_TYPE_LABELS[job.job_type]}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            {applications.length} {applications.length === 1 ? 'applicant' : 'applicants'}
          </p>
        </div>

        {applications.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {applications.map((app) => {
              const seeker = profilesById.get(app.seeker_id)
              return (
                <li
                  key={app.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium">{seeker?.full_name ?? 'Anonymous applicant'}</p>
                      <p className="text-sm text-muted-foreground">
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
            No applicants yet. Share your job link to attract candidates.
          </div>
        )}
      </main>
    </div>
  )
}
