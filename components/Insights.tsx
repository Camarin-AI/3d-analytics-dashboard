"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { RegionGauges } from "@/components/region-gauges"
import { RegionAnalytics } from "@/components/region-analytics"
import { CustomerVolumeAge } from "@/components/customer-volume-age"
import { Search } from "@/components/search"
import { DateRangePicker } from "@/components/date-range-picker"; // Changed import

export function Insights() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1), 
    to: new Date(2025, 0, 7), 
  })

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      {/* FIX 1 & 5: Adjusted padding for mobile, added w-full and overflow-x-hidden */}
      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
        <Header />
        {/* FIX 3: Wrapper for DateRangePicker centering on mobile & using DateRangePicker component */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 mb-8 gap-4 md:gap-0">
          <h1 className="text-3xl md:text-4xl font-medium">Insights</h1>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
        </div>

        <Search />

        <KpiCards />

        <div className="mt-6">
          <RegionGauges />
        </div>

        <div className="mt-6">
          <RegionAnalytics />
        </div>

        <div className="mt-6">
          <CustomerVolumeAge />
        </div>
      </main>
    </div>
  )
}