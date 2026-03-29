"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"

export interface ComboboxOption {
  label: string
  value: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  emptyText = "No results found.",
  className,
  disabled
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-[var(--color-neutral-300)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm ring-offset-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <CommandPrimitive className="flex h-full w-full flex-col overflow-hidden rounded-md bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
          <div className="flex items-center border-b border-[var(--color-neutral-200)] px-3">
            <CommandPrimitive.Input 
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
            />
          </div>
          <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <CommandPrimitive.Empty className="py-6 text-center text-sm text-[var(--color-text-secondary)]">
              {emptyText}
            </CommandPrimitive.Empty>
            <CommandPrimitive.Group className="overflow-hidden p-1 text-[var(--color-text-primary)]">
              {options.map((option) => (
                <CommandPrimitive.Item
                  key={option.value}
                  value={option.label}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue === value ? "" : option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-[var(--color-neutral-100)] aria-selected:text-[var(--color-text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.Group>
          </CommandPrimitive.List>
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  )
}
