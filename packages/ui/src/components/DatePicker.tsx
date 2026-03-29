"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./Button"
import { Calendar } from "./Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./Popover"

export function DatePicker({
  date,
  setDate,
  className
}: {
  date?: Date
  setDate?: (d?: Date) => void
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)]",
            !date && "text-[var(--color-text-secondary)]",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border border-[var(--color-border)]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate as any}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
