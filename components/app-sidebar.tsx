'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'

import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'

import { ChatHistorySection } from './sidebar/chat-history-section'
import { ChatHistorySkeleton } from './sidebar/chat-history-skeleton'
import { Button } from './ui/button'
import { IconLogo } from './ui/icons'
import { FeedbackModal } from './feedback-modal'
import GuestMenu from './guest-menu'
import UserMenu from './user-menu'

interface AppSidebarProps {
  hasUser: boolean
}

export default function AppSidebar({ hasUser }: AppSidebarProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="flex flex-row justify-between items-center">
          <Link href="/" className="flex items-center gap-2 px-2 py-3">
            <IconLogo className={cn('size-5')} />
            <span className="font-semibold text-sm">Morphic</span>
          </Link>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent className="flex flex-col px-2 py-4 h-full">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Plus className="size-4" />
                  <span>New</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<ChatHistorySkeleton />}>
              <ChatHistorySection />
            </Suspense>
          </div>
        </SidebarContent>
        <SidebarFooter className="flex flex-col gap-2 p-2 border-t border-sidebar-border">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedbackOpen(true)}
              className="flex-1 justify-start"
            >
              Feedback
            </Button>
            {hasUser ? <UserMenu /> : <GuestMenu />}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  )
}
