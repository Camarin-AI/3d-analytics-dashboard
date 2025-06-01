"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { SalesOverview } from "@/components/dashboard/sales-overview"
import { TrafficAnalysis } from "@/components/dashboard/traffic-analysis"
import { WeeklyVisits } from "@/components/dashboard/weekly-visits"
import { WeeklyVisitors } from "@/components/dashboard/weekly-visitors"
import { DateRangePicker } from "@/components/date-range-picker"
import { Search } from "@/components/search"

export function Dashboard() {
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
          <h1 className="text-3xl md:text-4xl font-light font-sans text-white">Dashboard</h1>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
        </div>

        <Search />

        <KpiCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <SalesOverview />
          <TrafficAnalysis />
        </div>

        <div className="mt-6 space-y-6">
          <WeeklyVisits />
          <WeeklyVisitors />
        </div>
      </main>
    </div>
  )
}