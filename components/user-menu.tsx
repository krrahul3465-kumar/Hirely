'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutDashboard, LogOut } from 'lucide-react'
import type { UserRole } from '@/lib/types'
import Link from 'next/link'

export function UserMenu({
  name,
  role,
}: {
  name: string
  role: UserRole
}) {
  const router = useRouter()

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {initials || 'U'}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate">{name}</span>
          <span className="text-xs font-normal capitalize text-muted-foreground">{role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={role === 'employer' ? '/employer' : '/dashboard'} />}>
          <LayoutDashboard className="mr-2 size-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
