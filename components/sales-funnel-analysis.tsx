"use client"

import { useState } from "react"
import { MoreHorizontal, Calendar, ArrowDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function SalesFunnelAnalysis() {
  const [dateRange] = useState({
    from: new Date(2025, 0, 1), // Jan 1, 2025
    to: new Date(2025, 0, 7), // Jan 7, 2025
  })

  // Funnel stages data
  const funnelData = [
    { label: "Impressions", value: "6.80k", percent: 100, color: "#4A97FC", change: -6, width: "75%" },
    { label: "Interactions", value: "5.75k", percent: 75, color: "#5CD8E5", change: 2, width: "65%" },
    { label: "Add to Cart", value: "4.5k", percent: 43, color: "#3DD2BA", change: 3, width: "50%" },
    { label: "Conversions", value: "3.5k", percent: 27, color: "#3DD2BA", change: 3, width: "40%" },
  ]

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Sales Funnel Analysis</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#2A2A2A] text-white"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
          </Button>
          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pt-2">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Weekly Revenue</p>
            <p className="text-2xl font-bold">INR 8,459</p>
          </div>

          <div className="relative h-[180px]">
            <div className="absolute inset-0 flex items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full relative"
              >
                {/* Funnel shape SVG */}
                <svg viewBox="0 0 800 200" className="w-full h-full">
                  {/* First stage */}
                  <motion.path
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    d="M0,20 L160,20 L160,180 L0,180 Z"
                    fill="#4A97FC"
                  />
                  {/* Second stage */}
                  <motion.path
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    d="M170,40 L300,40 L340,160 L170,160 Z"
                    fill="#5CD8E5"
                  />
                  {/* Third stage */}
                  <motion.path
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    d="M350,60 L450,60 L480,140 L350,140 Z"
                    fill="#3DD2BA"
                  />
                  {/* Fourth stage */}
                  <motion.path
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    d="M490,70 L570,70 L590,130 L490,130 Z"
                    fill="#26A69A"
                  />

                  {/* Labels and values */}
                  <text x="80" y="100" fill="white" textAnchor="middle" fontSize="14">
                    100%
                  </text>
                  <text x="235" y="100" fill="white" textAnchor="middle" fontSize="14">
                    75%
                  </text>
                  <text x="400" y="100" fill="white" textAnchor="middle" fontSize="14">
                    43%
                  </text>
                  <text x="540" y="100" fill="white" textAnchor="middle" fontSize="14">
                    15%
                  </text>
                </svg>

                {/* Value indicators */}
                <div className="absolute top-0 left-3 text-white font-medium">6.80k</div>
                <div className="absolute top-0 left-[25%] text-white font-medium">
                  <div className="flex items-center">
                    <span>6%</span>
                    <ArrowDown size={12} className="text-red-400 ml-1" />
                    <span className="text-xs text-gray-400 ml-1">last week</span>
                  </div>
                </div>

                <div className="absolute top-0 left-[40%] text-white font-medium">5.75k</div>
                <div className="absolute top-0 left-[55%] text-white font-medium">
                  <div className="flex items-center">
                    <span>2%</span>
                    <svg
                      className="w-3 h-3 text-green-400 ml-1 transform rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-xs text-gray-400 ml-1">last week</span>
                  </div>
                </div>

                <div className="absolute top-0 left-[70%] text-white font-medium">4.5k</div>
                <div className="absolute top-0 left-[85%] text-white font-medium">
                  <div className="flex items-center">
                    <span>3%</span>
                    <svg
                      className="w-3 h-3 text-green-400 ml-1 transform rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-xs text-gray-400 ml-1">last week</span>
                  </div>
                </div>

                <div className="absolute top-0 right-0 text-white font-medium">3.5k</div>
                <div className="absolute top-0 right-3 text-white font-medium">
                  <div className="flex items-center">
                    <span>3%</span>
                    <svg
                      className="w-3 h-3 text-green-400 ml-1 transform rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-xs text-gray-400 ml-1">last week</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-2 mb-2">
            <div className="text-right text-sm text-gray-400"># Units Sold</div>
            <div className="text-right text-white font-medium">500</div>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-[#252525] border-[#3A3A3A] text-gray-300 rounded-full text-xs"
            >
              Impressions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#252525] border-[#3A3A3A] text-gray-300 rounded-full text-xs"
            >
              Interactions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#252525] border-[#3A3A3A] text-gray-300 rounded-full text-xs"
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#252525] border-[#3A3A3A] text-gray-300 rounded-full text-xs"
            >
              Conversions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
