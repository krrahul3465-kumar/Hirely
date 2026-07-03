import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/job-card'
import type { Job } from '@/lib/types'
import { Search, Send, Building2, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, companies(*)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(4)

  const featured = (jobs as Job[]) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Now hiring across every industry
            </span>
            <h1 className="text-balance font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Find the job that fits your life
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              Hirely connects talented people with companies that are growing. Browse thousands of
              roles, apply in one click, and track everything in one place.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/jobs" />}>
                Browse jobs
                <ArrowRight className="ml-1 size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/auth/sign-up" />}>
                Post a job
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 shadow-sm">
            <Image
              src="/hero-workspace.png"
              alt="Professionals collaborating in a modern office"
              fill
              priority
              className="object-cover"
            />
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border/60 bg-muted/40">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-3">
            <Step
              icon={<Search className="size-5" />}
              title="Discover roles"
              text="Search open positions by title, location, and type across every field."
            />
            <Step
              icon={<Send className="size-5" />}
              title="Apply instantly"
              text="Submit your application in a single click and keep track of every one."
            />
            <Step
              icon={<Building2 className="size-5" />}
              title="Hire great people"
              text="Employers post jobs and review applicants from a clean dashboard."
            />
          </div>
        </section>

        {/* Featured jobs */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">Latest openings</h2>
              <p className="mt-1 text-muted-foreground">Fresh roles added by employers on Hirely.</p>
            </div>
            <Button variant="ghost" className="hidden sm:inline-flex" render={<Link href="/jobs" />}>
              View all
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>

          {featured.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
              No openings yet. Be the first to{' '}
              <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
                post a job
              </Link>
              .
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <p>Hirely — Find your next role.</p>
          <p>Built as a Phase 1 MVP.</p>
        </div>
      </footer>
    </div>
  )
}

function Step({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      <p className="text-pretty leading-relaxed text-muted-foreground">{text}</p>
    </div>
  )
}
