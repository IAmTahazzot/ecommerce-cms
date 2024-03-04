'use client'

import { useLayout } from "@/hooks/useLayout"
import { NotificationCard, NotificationType } from "./NotificationCard"
import { cn } from "@/lib/utils"

const emptyNotificationIcons: string[] = ['(^_^)', '\(o_o)/', '(^-^*)', '(>_<)', '(·.·)', '(≥o≤)', '(·_·)', '(˚Δ˚)']

export const NotificationPanel = () => {
  const { notificationPanel } = useLayout()

  return (
    <section className={
      cn(
        'fixed top-0 right-0 h-full flex flex-col gap-y-4 w-[270px] p-4 border-l border-neutral-200 bg-white transition-all',
        notificationPanel ? 'translate-x-0' : 'translate-x-full'
      )
    }>
      <div className="h-8 flex items-center">
        <h3 className="text-sm font-medium">Notification</h3>
      </div>

      {/* <div className="flex-1 flex flex-col justify-center items-center gap-y-6">
        <span className='text-8xl text-neutral-200'>
          {emptyNotificationIcons[Math.floor(Math.random() * emptyNotificationIcons.length)]}
        </span>
        <span className="text-neutral-400 text-sm">No activity yet.</span>
      </div> */}

      <div className="mt-4">
        <NotificationCard
          type={NotificationType.NEW_ORDER}
          title="Sarah ordered 3 items"
          date="12 minutes ago."
        />
        <NotificationCard
          type={NotificationType.SETTING_UPDATE}
          title="Default theme changed to silicon"
          date="2 hour ago."
        />
      </div>
    </section>
  );
}