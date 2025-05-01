"use client"
import { MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const customerData = [
  { name: "New Customers", value: 80, color: "#1E3A8A" },
  { name: "Returning Customers", value: 20, color: "#F59E0B" },
]

export function TrafficAnalysis() {
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {customerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-0.5em" fontSize="14" fill="#9CA3AF">
                      By
                    </tspan>
                    <tspan x="50%" dy="1.5em" fontSize="16" fontWeight="bold" fill="white">
                      Customer
                    </tspan>
                    <tspan x="50%" dy="1.5em" fontSize="16" fontWeight="bold" fill="white">
                      Types
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {customerData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-sm">{entry.name}</span>
                <span className="text-sm font-bold">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
