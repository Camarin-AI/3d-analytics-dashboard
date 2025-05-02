"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { SkuDetails } from "@/components/sku-details"
import { VisitorAnalysis } from "@/components/visitor-analysis"
import { SalesFunnelAnalysis } from "@/components/sales-funnel-analysis"
import { InteractionDuration } from "@/components/interaction-duration"
import { Search } from "@/components/search"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SkuAnalytics() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1), // Jan 1, 2025
    to: new Date(2025, 0, 7), // Jan 7, 2025
  })

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mt-6 mb-8">
          <h1 className="text-4xl font-medium">SKU Analytics</h1>
          <Button variant="outline" className="bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#2A2A2A] text-white">
            <Calendar className="mr-2 h-4 w-4" />
            {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
          </Button>
        </div>

        <Search />

        <KpiCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <SkuDetails />
          <VisitorAnalysis />
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-medium mb-4">Engagement Analysis</h2>
          <div className="space-y-6">
            <SalesFunnelAnalysis />
            <InteractionDuration />
          </div>
        </div>
      </main>
    </div>
  )
}
