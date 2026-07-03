import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/get-user'

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUser()

  if (!user) redirect('/login')
  redirect(profile?.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker')
}
