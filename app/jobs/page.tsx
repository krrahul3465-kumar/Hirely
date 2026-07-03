import { SiteHeader } from '@/components/site-header'
import { JobFilters } from '@/components/job-filters'
import { JobCard } from '@/components/job-card'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/lib/types'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; location?: string; type?: string }>
}) {
  const { q, location, type } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select('*, companies(*)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (q) query = query.ilike('title', `%${q}%`)
  if (location) query = query.ilike('location', `%${location}%`)
  if (type) query = query.eq('job_type', type)

  const { data } = await query
  const jobs = (data as Job[]) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Browse jobs</h1>
          <p className="mt-1 text-muted-foreground">
            {jobs.length} open {jobs.length === 1 ? 'role' : 'roles'} waiting for you.
          </p>
        </div>

        <div className="mb-8">
          <JobFilters />
        </div>

        {jobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
            No jobs match your search. Try adjusting the filters.
          </div>
        )}
      </main>
    </div>
  )
}
