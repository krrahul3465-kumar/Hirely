'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { JOB_TYPE_LABELS, type JobType } from '@/lib/types'

export function PostJobForm({ companyId }: { companyId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [jobType, setJobType] = useState<JobType>('full-time')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const salaryMin = form.get('salary_min')
    const salaryMax = form.get('salary_max')

    const supabase = createClient()
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        company_id: companyId,
        title: String(form.get('title')),
        description: String(form.get('description')),
        location: (String(form.get('location')) || null) as string | null,
        job_type: jobType,
        salary_min: salaryMin ? Number(salaryMin) : null,
        salary_max: salaryMax ? Number(salaryMax) : null,
        status: 'open',
      })
      .select('id')
      .single()

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Job posted!')
    router.push('/dashboard/employer')
    router.refresh()
  }

  return (
    <Card className="border-border/60">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Job title</Label>
            <Input id="title" name="title" required placeholder="Senior Product Designer" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Remote, New York, ..." />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Job type</Label>
              <Select value={jobType} onValueChange={(v) => setJobType(v as JobType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="salary_min">Min salary (USD/yr)</Label>
              <Input id="salary_min" name="salary_min" type="number" min="0" placeholder="80000" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="salary_max">Max salary (USD/yr)</Label>
              <Input id="salary_max" name="salary_max" type="number" min="0" placeholder="120000" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={8}
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/employer')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish job'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
