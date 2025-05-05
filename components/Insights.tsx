"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { RegionGauges } from "@/components/region-gauges"
// import { RegionAnalytics } from "@/components/region-analytics"
import { CustomerVolumeAge } from "@/components/customer-volume-age"
import { Search } from "@/components/search"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Insights() {
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
          <h1 className="text-4xl font-medium">Insights</h1>
          <Button variant="outline" className="bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#2A2A2A] text-white">
            <Calendar className="mr-2 h-4 w-4" />
            {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
          </Button>
        </div>

        <Search />

        <KpiCards />

        <div className="mt-6">
          <RegionGauges />
        </div>

        <div className="mt-6">
          {/* <RegionAnalytics /> */}
        </div>

        <div className="mt-6">
          <CustomerVolumeAge />
        </div>
      </main>
    </div>
  )
}
