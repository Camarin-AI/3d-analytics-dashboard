"use client"

import dynamic from "next/dynamic"
import { ArrowUp, ArrowDown } from "lucide-react"

// load ApexCharts only on the client
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function KpiCards() {
  const kpis = [
    {
      title: "Total Visits",
      value: "54,081",
      change: 2,
      trend: "up",
      data: generateSparklineData(30, 0.4),
    },
    {
      title: "Conversions",
      value: "68%",
      change: 6,
      trend: "up",
      data: generateSparklineData(30, 0.6),
    },
    {
      title: "Bounce Rate",
      value: "36%",
      change: 6,
      trend: "down",
      data: generateSparklineData(30, 0.6),
    },
    {
      title: "Visit Duration",
      value: "1m 2s",
      change: 6,
      trend: "up",
      data: generateSparklineData(30, 0.5),
    },
  ] as const

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {kpis.map((kpi, i) => (
        <KpiCard key={i} {...kpi} />
      ))}
    </div>
  )
}

interface KpiCardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
  data: number[]
}

function KpiCard({ title, value, change, trend, data }: KpiCardProps) {
  const isUp = trend === "up"
  const ArrowIcon = isUp ? ArrowUp : ArrowDown
  const badgeTextColor = isUp ? "text-green-400" : "text-red-400"
  const badgeBg = isUp ? "bg-green-500/10" : "bg-red-500/10"

  return (
    <div className="relative bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg p-5 flex items-center overflow-hidden">
      {/* Left: Title & Value */}
      <div className="flex-shrink-0 min-w-0">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-3xl font-medium">{value}</p>
      </div>

      {/* Middle: Sparkline */}
      <div className="w-24 flex-shrink-0 mx-4 overflow-hidden">
        <SparklineChart data={data} trend={trend} />
      </div>

      {/* Right: Badge */}
      <div className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${badgeTextColor} ${badgeBg}`}>
        <ArrowIcon size={12} />
        {change}%
        <span className="text-[11px] text-gray-500">last week</span>
      </div>
    </div>
  )
}

function SparklineChart({ data, trend }: { data: number[]; trend: "up" | "down" }) {
  const isUp = trend === "up"
  // purple for up, red for down
  const primary = isUp ? "#7C3AED" : "#EF4444"
  const secondary = isUp ? "#D8B4FE" : "#FECACA"

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      animations: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: [secondary],
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    colors: [primary],
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    tooltip: { enabled: false },
  }

  return (
    <Chart
      options={options}
      series={[{ data }]}
      type="area"
      height={50}
      width="100%"
    />
  )
}

function generateSparklineData(points: number, volatility: number) {
  let v = 50
  const out: number[] = []
  for (let i = 0; i < points; i++) {
    v += (Math.random() - 0.5) * volatility * 20
    v = Math.max(0, Math.min(100, v))
    out.push(v)
  }
  return out
}
