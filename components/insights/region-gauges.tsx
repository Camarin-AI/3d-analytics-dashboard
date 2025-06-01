"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function RegionGauges() {
  const regions = [
    { name: "India", value: 30, color: "#4CD8E5" },
    { name: "United Kingdom", value: 20, color: "#4CD8E5" },
    { name: "Canada", value: 10, color: "#4CD8E5" },
    { name: "Australia", value: 15, color: "#8A70D6" },
    { name: "Spain", value: 15, color: "#8A70D6" },
    { name: "Europe", value: 10, color: "#8A70D6" },
  ]

  return (
    <Card className="bg-[#1A1A1A] border-[#FFFFFF88] text-white">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {regions.map((region) => (
            <RegionGauge key={region.name} region={region} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface RegionGaugeProps {
  region: {
    name: string
    value: number
    color: string
  }
}

function RegionGauge({ region }: RegionGaugeProps) {
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference * (1 - region.value / 100)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="10"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />

          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={region.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />

          {/* Percentage text */}
          <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="light" fill="white" className="select-none">
            {region.value}%
          </text>
        </svg>
      </div>
      <p className="mt-2 text-sm text-center font-light font-sans">{region.name}</p>
    </div>
  )
}
