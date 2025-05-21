"use client"

import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  date: {
    from: Date
    to: Date
  }
  onDateChange: (date: { from: Date; to: Date }) => void
}

export function DateRangePicker({ date, onDateChange }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-full sm:w-[280px] flex justify-center text-center font-normal bg-[#27272A] border border-transparent text-gray-300 hover:border-[#4F4F52] focus:bg-[#1F1F22] focus:border-[#4F4F52] focus:ring-0 rounded-md placeholder:text-gray-500"
        >
          <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate"> {/* To prevent text overflow on very small button widths */}
            {format(date.from, "d MMM, yyyy")} - {format(date.to, "d MMM, yyyy")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-[#2A2A2A]" align="end">
        <CalendarComponent
          initialFocus
          mode="range"
          defaultMonth={date.from}
          selected={{
            from: date.from,
            to: date.to,
          }}
          onSelect={(selectedDate) => {
            if (selectedDate?.from && selectedDate?.to) {
              onDateChange({
                from: selectedDate.from,
                to: selectedDate.to,
              })
            }
          }}
          numberOfMonths={2}
          className="bg-[#1A1A1A] text-white"
        />
      </PopoverContent>
    </Popover>
  )
}