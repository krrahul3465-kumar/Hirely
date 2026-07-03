import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building2, Banknote } from 'lucide-react'
import { JOB_TYPE_LABELS, formatSalary, type Job } from '@/lib/types'

export function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job.salary_min, job.salary_max)

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-blue-100 bg-white p-5 shadow-sm shadow-slate-200/70 transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md hover:shadow-blue-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900 group-hover:text-primary">
            {job.title}
          </h3>
          {job.companies?.name && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
              <Building2 className="size-3.5" />
              {job.companies.name}
            </p>
          )}
        </div>
        <Badge variant="secondary" className="shrink-0">
          {JOB_TYPE_LABELS[job.job_type]}
        </Badge>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
        {job.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.location}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1">
            <Banknote className="size-3.5" />
            {salary}
          </span>
        )}
      </div>
    </Link>
  )
}
