"use client"

import React, { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useApiData } from "@/hooks/use-api-data";
import { TrafficAnalysisData } from "@/lib/data-service";
import logger from "@/lib/logger";
interface TrafficAnalysisProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}
const deviceData = [
  { name: "Laptop & PC",    value: 70, color: "#1E3A8A" },
  { name: "Mobile Phones",  value: 20, color: "#F59E0B" },
  { name: "Tablets & Others", value: 10, color: "#10B981" },
]

const browserData = [
  { name: "Chrome",  value: 60, color: "#1E3A8A" },
  { name: "Safari",  value: 25, color: "#F59E0B" },
  { name: "Firefox", value: 15, color: "#10B981" },
]

// helper to draw the small % labels on each slice
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) / 2
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="#E5E7EB"
      fontSize={12}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function TrafficAnalysis({ dateRange }: TrafficAnalysisProps) {
  const { data: trafficData, loading, error } = useApiData<TrafficAnalysisData>({
    endpoint: 'traffic-analysis',
    dateRange
  });
  const [activeTab, setActiveTab] = useState<"device" | "browser">("device")
  const [activeSeg, setActiveSeg] = useState<string | null>(null)

  // if (loading) {
  //   return <TrafficAnalysisSkeleton />;
  // }

  if (error) {
    logger.error('Traffic Analysis error:', error);
    return <div className="text-red-500">Error loading traffic analysis data</div>;
  }

  if (!trafficData) {
    return <div className="text-gray-500">No traffic analysis data available</div>;
  }

  const base = activeTab === "device" ? deviceData : browserData
  const pieData = activeSeg ? base.filter((d) => d.name === activeSeg) : base

  return (
    <Card className="bg-[#1A1A1A] border-[#FFFFFF88] text-white">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xl font-light font-sans">Traffic Analysis</CardTitle>
      <button className="text-gray-400 hover:text-white">
        <MoreHorizontal size={20} />
      </button>
    </CardHeader>

      <CardContent className="pt-2 px-4">
        {/* Top radio toggles */}
        <div className="flex items-center justify-center gap-6 mb-4 font-sans font-light">
          {[
            { key: "device", label: "By Device" },
            { key: "browser", label: "By Browser" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any)
                setActiveSeg(null)
              }}
              className="flex items-center gap-2"
            >
              <span
                className={`w-3 h-3 rounded-full border-2 ${
                  activeTab === tab.key
                    ? "border-blue-500"
                    : "border-gray-600"
                }`}
              />
              <span
                className={
                  activeTab === tab.key ? "text-white" : "text-gray-400"
                }
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Donut chart */}
        <div className="relative h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                label={renderCustomizedLabel}
                labelLine={false}
                isAnimationActive={true}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              {/* center label */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan
                  x="50%"
                  dy="-0.6em"
                  fontSize={14}
                  fill="#9CA3AF"
                >
                  By
                </tspan>
                <tspan
                  x="50%"
                  dy="1em"
                  fontSize={16}
                  fontWeight="bold"
                  fill="white"
                >
                  {activeTab === "device" ? "Device" : "Browser"}
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / filters */}
        <div className="flex justify-center gap-6 mt-4">
          {base.map((entry) => {
            const isFaded = activeSeg !== null && activeSeg !== entry.name
            return (
              <button
                key={entry.name}
                onClick={() =>
                  setActiveSeg((prev) =>
                    prev === entry.name ? null : entry.name
                  )
                }
                className="flex items-center gap-2 font-light font-sans"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: entry.color,
                    opacity: isFaded ? 0.3 : 1,
                  }}
                />
                <span
                  className={`text-sm ${
                    isFaded ? "text-gray-400" : "text-white"
                  }`}
                >
                  {entry.name}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
