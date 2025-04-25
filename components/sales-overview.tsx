"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// dynamically import so SSR doesn't break
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false })

// ordering bottom→middle→top
const keys = ['social', 'redirect', 'direct'] as const
type Source = typeof keys[number]

function formatK(num: number): string {
  return num >= 1000 ? `${(num/1000).toFixed(0)}k` : `${num}`
}

// sample
const rawData = [
  { name: '1', social: 34000, redirect: 12000, direct: 10000 },
  { name: '2', social: 28000, redirect: 11000, direct: 8000 },
  { name: '3', social: 25000, redirect: 15000, direct: 9000 },
  { name: '4', social: 22000, redirect: 18000, direct: 12000 },
  { name: '5', social: 29000, redirect: 16000, direct: 10000 },
  { name: '6', social: 35000, redirect: 14000, direct: 9000 },
  { name: '7', social: 32000, redirect: 12000, direct: 11000 },
]

export function SalesOverview() {
  const [activeSource, setActiveSource] = useState<Source | null>(null)

  const categories   = rawData.map(d => d.name)
  const socialData   = rawData.map(d => -d.social)
  const redirectData = rawData.map(d => d.redirect)
  const directData   = rawData.map(d => d.direct)

  const colorMap = {
    social:   "#6D28D9",
    redirect: "#7DD3FC",
    direct:   "#3B82F6",
  } as const

  const labelMap = {
    social:   "Social Media",
    redirect: "Redirect Links",
    direct:   "Direct Login",
  } as const

  const option = useMemo(() => {
    return {
      backgroundColor: "transparent",
      grid: { left: 50, right: 50, top: 50, bottom: 80 },
      xAxis: {
        type: "category",
        data: categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      series: keys.map((k) => {
        const data = k === "social" ? socialData
                   : k === "redirect" ? redirectData
                   : directData

        const isActive = !activeSource || activeSource === k

        return {
          name: labelMap[k],
          type: "line",
          smooth: true,
          stack: k === "social" ? "neg" : "pos",
          data,
          lineStyle: { opacity: isActive ? 1 : 0.2 },
          areaStyle: { opacity: isActive ? 0.7 : 0.1 },
          showSymbol: true,
          symbolSize: 4,
          itemStyle: { opacity: isActive ? 1 : 0.2 },
          color: colorMap[k],
        }
      }),
      markLine: {
        symbol: "none",
        lineStyle: { color: "#555", width: 1 },
        data: [
          { xAxis: categories[Math.floor(categories.length/3)] },
          { xAxis: categories[Math.floor(2*categories.length/3)] },
        ]
      },
      graphic: [
        {
          type: "text",
          left: "33%",
          bottom: 20,
          style: { text: "Lead to Opportunity Conversion", fill: "#777", fontSize: 12, align: "center" }
        },
        {
          type: "text",
          left: "66%",
          bottom: 20,
          style: { text: "Opportunity to Win Conversion", fill: "#777", fontSize: 12, align: "center" }
        }
      ],
      tooltip: {
        trigger: "item",
        formatter: (p: any) => {
          const val = Math.abs(p.value as number)
          return `<div style="color:white;padding:4px">
            <strong>${p.seriesName}</strong><br/>${p.name}: ${val.toLocaleString()}
          </div>`
        },
        backgroundColor: "rgba(42,42,42,0.9)",
        textStyle: { color: "#fff" }
      },
    }
  }, [categories, socialData, redirectData, directData, activeSource])

  return (
    <Card className="bg-[#1A1A1A] border border-[#3C3C3C] rounded-xl text-white overflow-hidden">
      <CardHeader className="flex items-center justify-between px-6 pt-4 pb-2">
        <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
        <button className="text-gray-500 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>

      <CardContent className="relative p-0 h-[320px]">
        {/* KPI Overlay */}
        <div className="absolute inset-0 z-10 flex items-start justify-around px-8 pt-8 pointer-events-none">
          <div className="flex flex-col items-center w-1/2 text-center pr-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">64%</span>
              <span className="text-sm text-gray-400">+8% over last week</span>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/2 text-center pl-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">18%</span>
              <span className="text-sm text-gray-400">+2% over last week</span>
            </div>
          </div>
        </div>

        {/* Left Badges */}
        <div className="absolute top-[15%] left-8 z-10">
          <div className="text-xs bg-[#3B82F6] text-white px-2 py-0.5 rounded mb-1">{formatK(rawData[0].direct)}</div>
          <div className="text-xs bg-[#7DD3FC] text-gray-900 px-2 py-0.5 rounded mb-1">{formatK(rawData[0].redirect)}</div>
          <div className="text-xs bg-[#6D28D9] text-white px-2 py-0.5 rounded">{formatK(rawData[0].social)}</div>
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-full">
          <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
        </motion.div>
      </CardContent>

      {/* Custom Legend / Buttons */}
      <div className="flex items-center justify-center gap-8 p-4 border-t border-[#3C3C3C]">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => setActiveSource(prev => prev === k ? null : k)}
            className={`flex items-center gap-2 text-sm transition-opacity ${
              !activeSource || activeSource === k
                ? "opacity-100"
                : "opacity-30 hover:opacity-60"
            }`}
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap[k] }} />
            {labelMap[k]}
          </button>
        ))}
      </div>
    </Card>
  )
}
