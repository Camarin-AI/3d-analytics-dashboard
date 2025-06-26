"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { RegionGauges } from "@/components/insights/region-gauges"
import { RegionAnalytics } from "@/components/insights/region-analytics"
import { CustomerVolumeAge } from "@/components/insights/customer-volume-age"
import { Search } from "@/components/search"
import { DateRangePicker } from "@/components/date-range-picker"

export function Insights() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1), 
    to: new Date(2025, 0, 7), 
  })

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
        <Header />
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 mb-8 gap-4 md:gap-0">
          <h1 className="text-3xl md:text-4xl font-light font-sans">Insights</h1>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
        </div>

        <Search />

        <KpiCards dateRange={dateRange} />

        <div className="mt-6">
          <RegionGauges dateRange={dateRange} />
        </div>

        <div className="mt-6">
          <RegionAnalytics dateRange={dateRange} />
        </div>

        <div className="mt-6">
          <CustomerVolumeAge dateRange={dateRange} />
        </div>
      </main>
    </div>
  )
}