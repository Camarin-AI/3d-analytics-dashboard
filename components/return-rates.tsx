"use client"

import { MoreHorizontal, ArrowDown, ArrowUp } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReturnRates() {
  const returnRate = 71
  const trend = "down"

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Return Rates</CardTitle>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[250px]">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2A2A" strokeWidth="8" strokeLinecap="round" />

              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4AE3F8"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{
                  strokeDashoffset: 251.2 - (251.2 * returnRate) / 100,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 50 50)"
              />

              <text x="50" y="45" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">
                {returnRate}%
              </text>
              <text x="50" y="65" textAnchor="middle" fontSize="14" fill="white">
                Returns
              </text>

              {/* Trend indicator */}
              {trend === "down" ? (
                <ArrowDown size={20} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500" />
              ) : (
                <ArrowUp size={20} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500" />
              )}
            </svg>
          </div>

          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4AE3F8]"></span>
              <span className="text-sm">Without Embeds</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2A2A2A]"></span>
              <span className="text-sm">With Embeds</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
