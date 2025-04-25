"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { SalesOverview } from "@/components/sales-overview"
import { TrafficAnalysis } from "@/components/traffic-analysis"
import { WeeklyVisits } from "@/components/weekly-visits"
import { WeeklyVisitors } from "@/components/weekly-visitors"
import { DateRangePicker } from "@/components/date-range-picker"
import { Search } from "@/components/search"

export function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1), // Jan 1, 2025
    to: new Date(2025, 0, 7), // Jan 7, 2025
  })

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        <div className="flex items-center justify-between mt-6 mb-8">
          <h1 className="text-4xl font-medium">Dashboard</h1>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
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
