"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { TotalSales } from "@/components/sales/total-sales"
import { TrafficAnalysis } from "@/components/sales/traffic-analysis-sales"
import { ReturnRates } from "@/components/sales/return-rates"
import { ConversionRates } from "@/components/sales/conversion-rates"
import { EmbedAssistedRevenue } from "@/components/sales/embed-assisted-revenue"
import { DateRangePicker } from "@/components/date-range-picker"
import { Search } from "@/components/search"

export function SalesAnalytics() {
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
          <h1 className="text-3xl md:text-4xl font-light font-sans text-white">Sales Analytics</h1>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
        </div>

        <Search />

        <KpiCards dateRange={dateRange} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TotalSales dateRange={dateRange} />
          <TrafficAnalysis dateRange={dateRange} />
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-light font-sans text-white mb-4">Comparative Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReturnRates dateRange={dateRange} />
            <ConversionRates dateRange={dateRange} />
          </div>
        </div>

        <div className="mt-6">
          <EmbedAssistedRevenue dateRange={dateRange} />
        </div>
      </main>
    </div>
  )
}