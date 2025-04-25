"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const deviceData = [
  { name: "Desktop & PC", value: 70, color: "#1E3A8A" },
  { name: "Mobile Phones", value: 20, color: "#F59E0B" },
  { name: "Tablets & Others", value: 10, color: "#10B981" },
]

const browserData = [
  { name: "Chrome", value: 60, color: "#1E3A8A" },
  { name: "Safari", value: 25, color: "#F59E0B" },
  { name: "Firefox", value: 15, color: "#10B981" },
]

const locationData = [
  { name: "North America", value: 45, color: "#1E3A8A" },
  { name: "Europe", value: 30, color: "#F59E0B" },
  { name: "Asia", value: 25, color: "#10B981" },
]

export function TrafficAnalysis() {
  const [activeTab, setActiveTab] = useState("device")

  const getActiveData = () => {
    switch (activeTab) {
      case "device":
        return deviceData
      case "browser":
        return browserData
      case "location":
        return locationData
      default:
        return deviceData
    }
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Traffic Analysis</CardTitle>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative h-[220px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getActiveData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {getActiveData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                      <tspan x="50%" dy="-0.5em" fontSize="14" fill="#9CA3AF">
                        By
                      </tspan>
                      <tspan x="50%" dy="1.5em" fontSize="16" fontWeight="bold" fill="white">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      </tspan>
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {getActiveData().map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <TabButton label="Devices" active={activeTab === "device"} onClick={() => setActiveTab("device")} />
            <TabButton label="Browser" active={activeTab === "browser"} onClick={() => setActiveTab("browser")} />
            <TabButton
              label="Location"
              active={activeTab === "location"}
              onClick={() => setActiveTab("location")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TabButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      className={`flex items-center gap-2 text-sm transition-opacity ${active ? "opacity-100" : "opacity-40"}`}
      onClick={onClick}
    >
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: active ? "#4AE3F8" : "#4A5568" }}></span>
      {label}
    </button>
  )
}
