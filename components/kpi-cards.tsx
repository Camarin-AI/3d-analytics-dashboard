"use client"

import { ArrowUp, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

export function KpiCards() {
  const kpis = [
    {
      title: "Total Visits",
      value: "54,081",
      change: 2,
      trend: "up",
      sparkline: generateSparklineData(30, "up", 0.4),
    },
    {
      title: "Conversions",
      value: "68%",
      change: 6,
      trend: "up",
      sparkline: generateSparklineData(30, "up", 0.6),
    },
    {
      title: "Bounce Rate",
      value: "36%",
      change: 6,
      trend: "down",
      sparkline: generateSparklineData(30, "down", 0.6),
    },
    {
      title: "Visit Duration",
      value: "1m 2s",
      change: 6,
      trend: "up",
      sparkline: generateSparklineData(30, "up", 0.5),
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
      {kpis.map((kpi, index) => (
        <KpiCard key={index} kpi={kpi} />
      ))}
    </div>
  )
}

interface KpiCardProps {
  kpi: {
    title: string
    value: string
    change: number
    trend: "up" | "down"
    sparkline: number[]
  }
}

function KpiCard({ kpi }: KpiCardProps) {
  const trendColor = kpi.trend === "up" ? "text-green-400" : "text-red-400"
  const trendBg = kpi.trend === "up" ? "bg-[#10B981]/10" : "bg-[#F43F5E]/10"

  return (
    <div className="bg-[#1C1C1C] rounded-lg p-5 flex flex-col border border-[#2A2A2A]">
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm text-gray-400">{kpi.title}</p>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor} px-2 py-1 rounded-md ${trendBg}`}>
          {kpi.trend === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {kpi.change}%<span className="text-[11px] text-gray-500 ml-1">last week</span>
        </div>
      </div>

      <p className="text-3xl font-medium mb-3">{kpi.value}</p>

      <div className="h-12 mt-auto">
        <SparklineChart data={kpi.sparkline} trend={kpi.trend} />
      </div>
    </div>
  )
}

function SparklineChart({ data, trend }: { data: number[]; trend: "up" | "down" }) {
  const color = trend === "up" ? "#10B981" : "#F43F5E"
  const gradientId = `sparkline-gradient-${trend}`
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((d, i) => [
    (i / (data.length - 1)) * 100,
    30 - ((d - min) / range) * 30
  ]);

  const linePathData = `M ${points[0][0]},${points[0][1]} ${points.slice(1).map(p => `L ${p[0]},${p[1]}`).join(" ")}`;

  const areaPathData = `${linePathData} L ${points[points.length-1][0]},30 L ${points[0][0]},30 Z`;

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d={areaPathData}
        fill={`url(#${gradientId})`}
        stroke="none"
      />
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d={linePathData}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function generateSparklineData(length: number, trend: "up" | "down", volatility: number = 0.5) {
  const data = []
  let value = 50
  const trendFactor = trend === "up" ? 0.5 : -0.5

  for (let i = 0; i < length; i++) {
    const randomChange = (Math.random() - 0.5) * 10 * volatility
    value += trendFactor + randomChange
    value = Math.max(10, Math.min(90, value))
    data.push(value)
  }

  return data
}
