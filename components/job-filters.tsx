'use client'

import type React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { JOB_TYPE_LABELS } from '@/lib/types'

export function JobFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const [title, setTitle] = useState(params.get('title') ?? params.get('q') ?? '')
  const [location, setLocation] = useState(params.get('location') ?? '')
  const [type, setType] = useState(params.get('type') ?? 'all')

  const applyFilters = (e?: React.FormEvent) => {
    e?.preventDefault()
    const next = new URLSearchParams()
    if (title.trim()) next.set('title', title.trim())
    if (location.trim()) next.set('location', location.trim())
    if (type && type !== 'all') next.set('type', type)
    router.push(`/jobs?${next.toString()}`)
  }

  return (
    <form
      onSubmit={applyFilters}
      className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-sm shadow-slate-200/70 md:flex-row md:items-end"
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="title" className="text-xs font-semibold text-slate-600">
          Title
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cyan-500" />
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job title"
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="location" className="text-xs font-semibold text-slate-600">
          Location
        </label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or Remote"
        />
      </div>

      <div className="flex w-full flex-col gap-1.5 md:w-44">
        <span className="text-xs font-semibold text-slate-600">Job type</span>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any type</SelectItem>
            {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="md:w-auto">
        Search
      </Button>
    </form>
  )
}
