export type UserRole = 'seeker' | 'employer'

export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract'

export type JobStatus = 'open' | 'closed'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export interface Company {
  id: string
  owner_id: string
  name: string
  created_at: string
}

export interface Job {
  id: string
  company_id: string
  title: string
  description: string
  location: string | null
  job_type: JobType
  salary_min: number | null
  salary_max: number | null
  status: JobStatus
  created_at: string
  companies?: Company | null
}

export interface Application {
  id: string
  job_id: string
  seeker_id: string
  applied_at: string
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  internship: 'Internship',
  contract: 'Contract',
}

export function formatSalary(min: number | null, max: number | null): string | null {
  const fmt = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  if (max) return `Up to ${fmt(max)}`
  return null
}
