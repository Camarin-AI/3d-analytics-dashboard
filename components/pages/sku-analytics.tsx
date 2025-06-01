"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { SkuDetails } from "@/components/sku/sku-details"
import { VisitorAnalysis } from "@/components/sku/visitor-analysis"
import { SalesFunnelAnalysis } from "@/components/sku/sales-funnel-analysis"
import { InteractionDuration } from "@/components/sku/interaction-duration"
import { Search } from "@/components/search"
import { DateRangePicker } from "@/components/date-range-picker"
import { Sidebar } from "@/components/sidebar"

export function SkuAnalytics() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 0, 7),
  })

  return (
    
    <div className="flex min-h-screen bg-[#121212] text-white">
    <Sidebar />
    {/* FIX 1 & 5: Adjusted padding for mobile, added w-full and overflow-x-hidden */}
    <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden"> 
      <Header />
      {/* FIX 3: Wrapper for DateRangePicker centering on mobile */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-6 mb-8 gap-4 md:gap-0">
        <h1 className="text-3xl md:text-4xl font-light font-sans text-white">SKU Analytics</h1>
        <div className="w-full md:w-auto flex justify-center md:justify-end">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

        <Search />

        <KpiCards />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <div className="lg:col-span-3">
            <SkuDetails />
          </div>
          <div className="lg:col-span-2">
            <VisitorAnalysis />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-light font-sans font-inter mb-4">Engagement Analysis</h2>
          <div className="space-y-6">
            <SalesFunnelAnalysis />
            <InteractionDuration />
          </div>
        </div>
      </main>
    </div>
  )
}