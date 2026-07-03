'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Check, Send } from 'lucide-react'

export function ApplyButton({
  jobId,
  seekerId,
  alreadyApplied,
}: {
  jobId: string
  seekerId: string
  alreadyApplied: boolean
}) {
  const [applied, setApplied] = useState(alreadyApplied)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApply = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('applications')
      .insert({ job_id: jobId, seeker_id: seekerId })

    setLoading(false)

    if (error) {
      if (error.code === '23505') {
        setApplied(true)
        toast.info('You already applied to this job.')
      } else {
        toast.error(error.message)
      }
      return
    }

    setApplied(true)
    toast.success('Application submitted!')
    router.refresh()
  }

  if (applied) {
    return (
      <Button size="lg" disabled className="w-full sm:w-auto">
        <Check className="mr-1 size-4" />
        Applied
      </Button>
    )
  }

  return (
    <Button size="lg" onClick={handleApply} disabled={loading} className="w-full sm:w-auto">
      <Send className="mr-1 size-4" />
      {loading ? 'Applying...' : 'Apply now'}
    </Button>
  )
}
