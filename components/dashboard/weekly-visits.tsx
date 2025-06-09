"use client"

import React, { useState, useMemo } from "react"
import { Calendar, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { format } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { DateRangePicker } from "../date-range-picker"
import { useApiData } from "@/hooks/use-api-data"

export function WeeklyVisits() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 0, 7),
  });
  const { data: visitsData, loading, error } = useApiData<{ data: { day: number; unique: number; total: number }[] }>({
    endpoint: 'weekly-visits',
    dateRange
  });
  const fallback = {
    data: [
      { day: 1, unique: 40000, total: 60000 },
      { day: 2, unique: 63480, total: 85000 },
      { day: 3, unique: 30000, total: 58000 },
      { day: 4, unique: 72000, total: 90000 },
      { day: 5, unique: 55000, total: 88000 },
      { day: 6, unique: 48000, total: 92000 },
      { day: 7, unique: 35000, total: 65000 },
    ]
  };
  const d = (error ? fallback : (visitsData || fallback));
  const [activeKey, setActiveKey] = useState<"unique" | "total" | null>("unique")

  const peak = useMemo(() => {
    if (!d?.data || d.data.length === 0) return { entry: { day: 1, unique: 0, total: 0 }, value: 0 };
    const key = activeKey || "unique"
    let max = -Infinity, entry = d.data[0]
    d.data.forEach(d => {
      if (d[key] > max) {
        max = d[key]; entry = d
      }
    })
    return { entry, value: entry[activeKey || "unique"] }
  }, [activeKey, d])

  if (loading) {
    return <div className="text-gray-500">Loading weekly visits data...</div>;
  }
  if (!d) {
    return <div className="text-gray-500">No weekly visits data available</div>;
  }

  // Show a subtle warning if fallback data is being used due to error
  const isFallback = error;

  return (
    <Card className="bg-[#1A1A1A] border-[#FFFFFF88] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-light font-sans">Weekly Visits</CardTitle>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#2A2A2A] text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to ? `${format(dateRange.from, "d MMM, yyyy")} – ${format(dateRange.to, "d MMM, yyyy")}` : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-[#2A2A2A]" align="end">
              <div>
                <DateRangePicker date={dateRange} onDateChange={setDateRange} />
              </div>
            </PopoverContent>
          </Popover>

          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </CardHeader>

      {/* Subtle warning if fallback is used */}
      {isFallback && (
        <div className="mb-2 flex items-center gap-2 text-xs text-yellow-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          Offline mode: showing fallback data
        </div>
      )}

      <CardContent>
        <div className="relative h-[300px]">
          {/* Peak tooltip */}
          <div
            className="absolute z-10 p-2 rounded bg-[#111] bg-opacity-60"
            style={{
              // position roughly above the peak day
              left: `calc(${(peak.entry.day - 1) / 6 * 100}% - 40px)`,
              top: "3%",
            }}
          >
            <div className="text-lg font-semibold">
              {peak.value.toLocaleString()}
            </div>
            <div className="text-xs text-green-400">+5% over last week</div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.data} margin={{ top: 40, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid stroke="#2A2A2A" strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                  domain={[0, 100000]}
                  ticks={[0,20000,40000,60000,80000,100000]}
                  tickFormatter={v => v === 0 ? "0k" : `${v/1000}k`}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2A2A2A",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(val: number) => [`${val.toLocaleString()}`, ""]}
                  labelFormatter={(d: any) => `Day ${d}`}
                />

                {/** Unique Visitors line */}
                <Line
                  type="monotone"
                  dataKey="unique"
                  stroke="#4AE3F8"
                  strokeWidth={ activeKey === "unique" || activeKey === null ? 3 : 1.5 }
                  dot={false}
                  activeDot={{ r: 6, fill: "#4AE3F8" }}
                  style={{
                    opacity: activeKey === "total" ? 0.3 : 1,
                    filter: activeKey === "unique"
                      ? "drop-shadow(0px 0px 10px rgba(74,227,248,0.6))"
                      : "none"
                  }}
                />

                {/** Total Visitors line */}
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={ activeKey === "total" || activeKey === null ? 3 : 1.5 }
                  dot={false}
                  activeDot={{ r: 6, fill: "#10B981" }}
                  style={{
                    opacity: activeKey === "unique" ? 0.3 : 1,
                    filter: activeKey === "total"
                      ? "drop-shadow(0px 0px 10px rgba(16,185,129,0.6))"
                      : "none"
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Legend / toggles */}
        <div className="flex justify-center gap-8 mt-4">
          {[
            { key: "unique", label: "Unique Visitors", color: "#4AE3F8" },
            { key: "total",  label: "Total Visitors",  color: "#10B981" },
          ].map(series => {
            const isFaded = activeKey !== null && activeKey !== series.key
            return (
              <button
                key={series.key}
                onClick={() => setActiveKey(prev => prev === series.key ? null : (series.key as any))}
                className="flex items-center gap-2"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: series.color,
                    opacity: isFaded ? 0.3 : 1,
                  }}
                />
                <span className={`text-sm ${isFaded ? "text-gray-400" : "text-white"}`}>
                  {series.label}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
