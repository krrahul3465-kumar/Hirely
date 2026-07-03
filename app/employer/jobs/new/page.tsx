import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { getCurrentUser } from '@/lib/get-user'
import { ensureCompany } from '@/lib/ensure-company'
import { PostJobForm } from '@/components/post-job-form'

export default async function NewJobPage() {
  const { user, profile } = await getCurrentUser()
  if (!user) redirect('/auth/login')
  if (profile?.role !== 'employer') redirect('/dashboard')

  const company = await ensureCompany(user.id, profile.full_name)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Post a new job</h1>
          <p className="mt-1 text-muted-foreground">
            Publishing as <span className="font-medium text-foreground">{company.name}</span>.
          </p>
        </div>
        <PostJobForm companyId={company.id} />
      </main>
    </div>
  )
}
