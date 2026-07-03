import { createClient } from '@/lib/supabase/server'
import type { Company } from '@/lib/types'

/**
 * Returns the employer's company, creating one if it doesn't exist yet.
 * The company may not exist right after signup when email confirmation delays
 * the first session, so we lazily create it on first authenticated access.
 */
export async function ensureCompany(
  userId: string,
  fallbackName: string | null,
): Promise<Company> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', userId)
    .maybeSingle()

  if (existing) return existing as Company

  const { data: created, error } = await supabase
    .from('companies')
    .insert({ owner_id: userId, name: fallbackName?.trim() || 'My Company' })
    .select('*')
    .single()

  if (error) throw error
  return created as Company
}
