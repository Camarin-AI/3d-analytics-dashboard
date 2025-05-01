"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { TotalSales } from "@/components/total-sales"
import { TrafficAnalysis } from "@/components/traffic-analysis-sales"
import { ReturnRates } from "@/components/return-rates"
import { ConversionRates } from "@/components/conversion-rates"
import { EmbedAssistedRevenue } from "@/components/embed-assisted-revenue"
import { DateRangePicker } from "@/components/date-range-picker"
import { Search } from "@/components/search"

export function SalesAnalytics() {
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
          <h1 className="text-4xl font-light font-sans text-white">Sales Analytics</h1>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>

        <Search />

        <KpiCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TotalSales />
          <TrafficAnalysis />
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-light font-sans text-white mb-4">Comparative Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReturnRates />
            <ConversionRates />
          </div>
        </div>

        <div className="mt-6">
          <EmbedAssistedRevenue />
        </div>
      </main>
    </div>
  )
}
