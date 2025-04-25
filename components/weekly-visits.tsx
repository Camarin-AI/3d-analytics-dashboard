"use client"

import { useState } from "react"
import { Calendar, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const data = [
  { day: 1, uniqueVisits: 40000, totalVisits: 60000 },
  { day: 2, uniqueVisits: 60000, totalVisits: 80000 },
  { day: 3, uniqueVisits: 45000, totalVisits: 65000 },
  { day: 4, uniqueVisits: 70000, totalVisits: 90000 },
  { day: 5, uniqueVisits: 55000, totalVisits: 75000 },
  { day: 6, uniqueVisits: 40000, totalVisits: 60000 },
  { day: 7, uniqueVisits: 30000, totalVisits: 50000 },
]

export function WeeklyVisits() {
  const [dateRange] = useState({
    from: new Date(2025, 0, 1), // Jan 1, 2025
    to: new Date(2025, 0, 7), // Jan 7, 2025
  })

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Weekly Visits</CardTitle>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#2A2A2A] text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-[#2A2A2A]" align="end">
              {/* Calendar would go here */}
            </PopoverContent>
          </Popover>
          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px]">
          <div className="absolute top-12 left-[25%] z-10 flex flex-col items-start gap-0.5 p-2 bg-[#111] bg-opacity-50 rounded">
            <div className="text-lg font-semibold text-white">63,480</div>
            <div className="text-xs text-green-400">+5% over last week</div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 50, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF" }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                  domain={[0, 100000]}
                  ticks={[0, 20000, 40000, 60000, 80000, 100000]}
                  tickFormatter={(value) => (value === 0 ? "0k" : `${value / 1000}k`)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2A2A2A",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()}`, ""]}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="uniqueVisits"
                  stroke="#4AE3F8"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: "#4AE3F8" }}
                />
                <Line
                  type="monotone"
                  dataKey="totalVisits"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#4AE3F8]"></span>
            <span className="text-sm">Total Unique Visits</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
            <span className="text-sm">Total Visits</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
