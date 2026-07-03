import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

/**
 * Returns the current authenticated user and their profile row (role, name).
 * Returns null values when there is no session.
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, profile: null as Profile | null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile: (profile as Profile) ?? null }
}
