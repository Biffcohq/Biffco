"use client"

import * as React from "react"
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { DayPicker } from "react-day-picker"

import { cn } from "../lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-[var(--color-text-secondary)] rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[var(--color-surface-raised)]/50 [&:has([aria-selected])]:bg-[var(--color-surface-raised)] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[var(--color-surface-raised)] rounded-md"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[var(--color-primary)] text-text-primary hover:bg-[var(--color-primary)] hover:text-text-primary focus:bg-[var(--color-primary)] focus:text-text-primary",
        day_today: "bg-[var(--color-surface-raised)] text-text-primary]",
        day_outside:
          "day-outside text-[var(--color-text-secondary)] opacity-50 aria-selected:bg-[var(--color-surface-raised)]/50 aria-selected:text-[var(--color-text-secondary)] aria-selected:opacity-30",
        day_disabled: "text-[var(--color-text-secondary)] opacity-50",
        day_range_middle:
          "aria-selected:bg-[var(--color-surface-raised)] aria-selected:text-text-primary]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === 'left') return <IconChevronLeft className="h-4 w-4" {...props as any} />
          if (orientation === 'right') return <IconChevronRight className="h-4 w-4" {...props as any} />
          return null
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
