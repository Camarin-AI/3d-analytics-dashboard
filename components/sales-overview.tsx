"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false })

// Data keys and labels
const KEYS = ["social", "redirect", "direct"] as const
type Key = typeof KEYS[number]

const COLORS: Record<Key, string> = {
  social: "#6D28D9",
  redirect: "#7DD3FC",
  direct: "#3B82F6",
}
const LABELS: Record<Key, string> = {
  social: "Social Media",
  redirect: "Redirect Links",
  direct: "Direct Login",
}

const rawData = [
  { name: '1', social: 34000, redirect: 12000, direct: 10000 },
  { name: '2', social: 28000, redirect: 11000, direct: 8000 },
  { name: '3', social: 25000, redirect: 15000, direct: 9000 },
  { name: '4', social: 22000, redirect: 18000, direct: 12000 },
  { name: '5', social: 29000, redirect: 16000, direct: 10000 },
  { name: '6', social: 35000, redirect: 14000, direct: 9000 },
  { name: '7', social: 32000, redirect: 12000, direct: 11000 },
]

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`
}

export function SalesOverview() {
  const [active, setActive] = useState<Key | null>(null)

  // prepare series data
  const categories = rawData.map(d => d.name)
  const seriesData = useMemo(() => KEYS.map(key => rawData.map(d => key === 'social' ? -d[key] : d[key])), [])

  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    grid: { left: 60, right: 60, top: 60, bottom: 80 },
    xAxis: { type: 'category', data: categories, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false } },
    yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
    series: KEYS.map((k, i) => {
      const isActive = !active || active === k
      return {
        name: LABELS[k],
        type: 'line', smooth: true, stack: k === 'social' ? 'neg' : 'pos',
        data: seriesData[i],
        lineStyle: { width: 0, opacity: isActive ? 1 : 0.2 },
        areaStyle: { color: COLORS[k], opacity: isActive ? 0.8 : 0.1 },
        showSymbol: false,
      }
    }),
    markLine: {
      symbol: 'none', lineStyle: { color: '#fff', width: 2 },
      data: [
        { xAxis: categories[Math.floor(categories.length/3)] },
        { xAxis: categories[Math.floor(2*categories.length/3)] }
      ]
    },
    graphic: [
      { type: 'text', left: '40%', bottom: 40, style: { text: 'Lead to Opportunity Conversion', fill: '#9CA3AF', fontSize: 12, fontFamily: 'Inter, sans-serif', align: 'center' } },
      { type: 'text', left: '70%', bottom: 40, style: { text: 'Opportunity to Win Conversion', fill: '#9CA3AF', fontSize: 12, fontFamily: 'Inter, sans-serif', align: 'center' } }
    ],
    tooltip: { trigger: 'item', backgroundColor: 'rgba(0,0,0,0.7)', textStyle: { color: '#fff' }, formatter: (p: any) => {
      const v = Math.abs(p.value)
      return `<div style="padding:4px;color:#fff"><strong>${p.seriesName}</strong><br/>${p.name}: ${v.toLocaleString()}</div>`
    } },
  }), [active, categories, seriesData])

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>

      <CardContent className="relative p-0 h-[340px]">
        {/* Separator lines */}
        <div className="absolute inset-y-0 left-[33.33%] w-[2px] bg-white/40" />
        <div className="absolute inset-y-0 left-[66.66%] w-[2px] bg-white/40" />

        {/* Value badges */}
        <div className="absolute top-[25%] left-10 flex flex-col space-y-6 z-10">
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{fmtK(rawData[0].direct)}</span>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{fmtK(rawData[0].redirect)}</span>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{fmtK(rawData[0].social)}</span>
        </div>

        {/* KPIs */}
    <div className="absolute top-[5%] left-1/3 w-[33.33%] text-center z-10">
      <div className="flex justify-center items-center space-x-2">
        <div className="text-3xl font-semibold">64%</div>
        <div className="text-left">
          <div className="text-sm font-medium text-green-400">+8%</div>
          <div className="text-xs text-[#9CA3AF]">over last week</div>
        </div>
      </div>
    </div>
        
    <div className="absolute top-[5%] left-[66.66%] w-[33.33%] text-center z-10">
  <div className="flex justify-center items-center space-x-2">
    <div className="text-3xl font-semibold">18%</div>
    <div className="text-left">
      <div className="text-sm font-medium text-green-400">+2%</div>
      <div className="text-xs text-[#9CA3AF]">over last week</div>
    </div>
  </div>
</div>

      

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-full">
          <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
        </motion.div>
      </CardContent>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 p-4 border-t border-[#3C3C3C]">
        {KEYS.map(k => (
          <button key={k} onClick={() => setActive(prev => prev === k ? null : k)} className={`flex items-center gap-2 text-sm transition-opacity ${!active || active === k ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[k] }} />
            <span>{LABELS[k]}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
