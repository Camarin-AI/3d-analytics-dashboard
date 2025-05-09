"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { SkuDetails } from "@/components/sku-details"
import { VisitorAnalysis } from "@/components/visitor-analysis"
import { SalesFunnelAnalysis } from "@/components/sales-funnel-analysis"
import { InteractionDuration } from "@/components/interaction-duration"
import { Search } from "@/components/search"
import { DateRangePicker } from "@/components/date-range-picker"
import { Sidebar } from "@/components/sidebar"

export function SkuAnalytics() {
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
        <h1 className="text-4xl font-light font-sans text-white">SKU Analytics</h1>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

        <Search />

        <KpiCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <SkuDetails />
          <VisitorAnalysis />
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-light font-sans font-inter mb-4">Engagement Analysis</h2>
          <div className="space-y-6">
            <SalesFunnelAnalysis />
            <InteractionDuration />
          </div>
        </div>
      </main>
    </div>
  )
}
