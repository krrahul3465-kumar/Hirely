import type React from 'react'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">Hirely</span>
        </Link>
        {children}
      </div>
    </main>
  )
}
