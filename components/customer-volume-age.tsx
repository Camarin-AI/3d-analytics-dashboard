"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function CustomerVolumeAge() {
  const [dateRange] = useState({
    from: new Date(2025, 0, 1), // Jan 1, 2025
    to: new Date(2025, 0, 7), // Jan 7, 2025
  })

  // Data for the bar chart
  const data = [
    { age: "<18", men: 5000, women: 3500 },
    { age: "19-24", men: 8000, women: 6500 },
    { age: "25-30", men: 10000, women: 9000 },
    { age: "31-35", men: 14000, women: 11000 },
    { age: "36-40", men: 15000, women: 14000 },
    { age: "41-45", men: 10000, women: 7000 },
    { age: "46-50", men: 8000, women: 9000 },
    { age: "51-55", men: 6000, women: 5000 },
    { age: ">55", men: 8000, women: 6000 },
  ]

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Customer Volume with Age</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#2A2A2A] text-white"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1">
            <div className="text-xl font-semibold">14,382</div>
            <div className="text-xs text-green-400 flex items-center">+5% from last week</div>
            <div className="text-xs text-gray-400">Average Spend: INR 3,481</div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF" }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                  domain={[0, 16000]}
                  ticks={[0, 4000, 8000, 12000, 16000]}
                  tickFormatter={(value) => (value === 0 ? "0s" : `${value / 1000}k`)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2A2A2A",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()}`, ""]}
                />
                <Bar dataKey="men" name="Men" fill="#4CD8E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="women" name="Women" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#4CD8E5]"></span>
            <span className="text-sm">Men</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
            <span className="text-sm">Women</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
