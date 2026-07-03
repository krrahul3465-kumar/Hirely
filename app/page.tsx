import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { JobCard } from '@/components/job-card'
import type { Job } from '@/lib/types'
import { ArrowRight, Building2, MapPin, Search, ShieldCheck, Sparkles, Users } from 'lucide-react'

const popularSearches = ['Remote jobs', 'Software engineer', 'Marketing', 'Freshers', 'Data analyst']

export default async function HomePage() {
  let jobs = null

  if (hasSupabaseEnv()) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('jobs')
      .select('*, companies(*)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(6)
    jobs = data
  }

  const featured = (jobs as Job[]) ?? []

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8ff]">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-sky-100 bg-gradient-to-b from-white to-sky-50">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
            <p className="mb-3 text-sm font-semibold text-sky-500">India's hiring desk for growing teams</p>
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight text-sky-700 md:text-5xl">
              Find your dream job now
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-sky-500 md:text-lg">
              Search roles by title and location, apply quickly, and track every application from one dashboard.
            </p>

            <form
              action="/jobs"
              className="mx-auto mt-8 grid max-w-4xl gap-3 rounded-2xl border border-sky-100 bg-white p-3 shadow-lg shadow-sky-100 md:grid-cols-[1fr_1fr_auto]"
            >
              <label className="flex items-center gap-3 rounded-xl border border-sky-100 px-4 py-3 text-left">
                <Search className="size-5 text-sky-400" />
                <input
                  name="title"
                  className="w-full bg-transparent text-sm text-sky-700 outline-none placeholder:text-sky-300"
                  placeholder="Search by job title, skill, or company"
                />
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-sky-100 px-4 py-3 text-left">
                <MapPin className="size-5 text-sky-400" />
                <input
                  name="location"
                  className="w-full bg-transparent text-sm text-sky-700 outline-none placeholder:text-sky-300"
                  placeholder="City, country, or remote"
                />
              </label>
              <Button size="lg" type="submit" className="h-12 rounded-xl px-7">
                Search
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {popularSearches.map((item) => (
                <Link
                  key={item}
                  href={`/jobs?title=${encodeURIComponent(item)}`}
                  className="rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-sky-500 transition-colors hover:border-sky-300 hover:text-sky-700"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-3">
          <TrustCard icon={<Building2 className="size-5" />} label="Verified employers" value="Post roles with company ownership" />
          <TrustCard icon={<Users className="size-5" />} label="Simple applications" value="One-click apply for seekers" />
          <TrustCard icon={<ShieldCheck className="size-5" />} label="Protected dashboards" value="Role-based access for every user" />
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-14 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-sky-700">Recommended jobs</h2>
                <p className="mt-1 text-sm text-sky-500">Fresh open roles from employers on Hirely.</p>
              </div>
              <Button variant="ghost" className="hidden sm:inline-flex" render={<Link href="/jobs" />}>
                View all
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>

            {featured.length > 0 ? (
              <div className="grid gap-4">
                {featured.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-sky-200 bg-white py-14 text-center text-sky-500">
                No openings yet. Be the first to{' '}
                <Link href="/signup" className="font-semibold text-sky-600 hover:underline">
                  post a job
                </Link>
                .
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sky-600">
                <Sparkles className="size-5" />
                <h3 className="font-semibold">Quick start</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-sky-500">
                <p>Create a seeker account to apply and track your applications.</p>
                <p>Employers can create a company, post jobs, and review applicants.</p>
              </div>
              <Button className="mt-5 w-full" render={<Link href="/signup" />}>
                Create account
              </Button>
            </div>

            <div className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-sky-700">Popular categories</h3>
              <div className="mt-4 grid gap-2">
                {['Technology', 'Sales', 'Design', 'Operations'].map((item) => (
                  <Link
                    key={item}
                    href={`/jobs?title=${encodeURIComponent(item)}`}
                    className="rounded-lg border border-sky-100 px-3 py-2 text-sm font-medium text-sky-500 hover:border-sky-300 hover:text-sky-700"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

function TrustCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
      <span className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500">{icon}</span>
      <div>
        <p className="font-semibold text-sky-700">{label}</p>
        <p className="text-sm text-sky-500">{value}</p>
      </div>
    </div>
  )
}
