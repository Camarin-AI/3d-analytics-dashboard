"use client";

import React, { useState } from "react";
import { Calendar, MoreHorizontal, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  DotProps,
} from "recharts";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useApiData } from "@/hooks/use-api-data";
import type { InteractionDurationData } from '@/lib/data-service';

// --- Color Palette (Based on Target Image) ---
const colors = {
    background: "#161618",
    cardBorder: "rgba(255, 255, 255, 0.4)",
    textPrimary: "#F4F4F5", // For main values in tooltip and title
    textSecondary: "#A1A1AA", // For axis labels, legend, "over last week"
    textMuted: "#71717A", // For date range button text
    gridLine: "rgba(255, 255, 255, 0.08)",

    dateRangeButtonBg: "#27272A",
    dateRangeButtonBorder: "rgba(255, 255, 255, 0.15)",

    // Line colors from the target image
    lineSkuInteraction: "#22D3EE", // Bright Cyan
    lineSiteAverage: "#0D9488",   // Darker Teal/Green

    tooltipBg: "#1C1C1E", // Dark, slightly desaturated background
    tooltipBorder: "rgba(255, 255, 255, 0.1)", // Fainter border for tooltip
    trendUp: "#34D399",
    trendDown: "#EF4444", // Red for trend
    activeDotFill: "#FFFFFF", // White fill for the inner part of the active dot
    // activeDotBorder will be the line color itself
};

const fallbackData: InteractionDurationData = {
  data: [
    { day: "1", unique: 50, total: 20, prevUnique: 45, prevTotal: 18 },
    { day: "2", unique: 100, total: 95, prevUnique: 48, prevTotal: 90 },
    { day: "3", unique: 30, total: 20, prevUnique: 105, prevTotal: 22 },
    { day: "4", unique: 20, total: 90, prevUnique: 28, prevTotal: 85 },
    { day: "5", unique: 120, total: 110, prevUnique: 18, prevTotal: 105 },
    { day: "6", unique: 70, total: 60, prevUnique: 115, prevTotal: 65 },
    { day: "7", unique: 10, total: 75, prevUnique: 75, prevTotal: 70 },
  ]
};

// --- Custom Tooltip Content (Top Tooltip) ---
type TooltipProps = { active?: boolean; payload?: any[]; label?: string; data: InteractionDurationData['data'] };
const CustomInteractionTooltip = ({ active, payload, label, data }: TooltipProps) => {
  if (active && payload && payload.length && label) {
    const dataPoint = payload[0];
    const currentValue = dataPoint.value;
    const seriesNameKey = dataPoint.dataKey as "unique" | "total";
    const originalDataPoint = data.find((row) => row.day === label);
    let trendPercent = 0;
    if (originalDataPoint) {
      const prevValue = seriesNameKey === 'unique' ? originalDataPoint.prevUnique : originalDataPoint.prevTotal;
      if (prevValue && prevValue !== 0) {
        trendPercent = Math.round(((currentValue - prevValue) / prevValue) * 100);
      }
    }
    return (
      <div
        className="rounded-md border shadow-lg p-2 min-w-[130px]"
        style={{
          backgroundColor: colors.tooltipBg,
          borderColor: colors.tooltipBorder,
          color: colors.textPrimary,
        }}
      >
        <p className="text-base font-semibold mb-0.5">{currentValue.toLocaleString()} seconds</p>
        {trendPercent !== 0 && (
            <div className="flex items-center text-[11px]" style={{ color: trendPercent > 0 ? colors.trendUp : colors.trendDown }}>
                {trendPercent > 0 ? <ArrowUp size={9} className="mr-0.5" /> : <ArrowUp size={9} className="mr-0.5 transform rotate-180" />}
                {Math.abs(trendPercent)}%
                <span className="ml-1 text-[9px]" style={{ color: colors.textSecondary }}>over last week</span>
            </div>
        )}
      </div>
    );
  }
  return null;
};

// --- Custom Active Dot ---
const CustomActiveDot = (props: DotProps & { stroke?: string, dataKey?: string }) => {
    const { cx, cy, stroke, dataKey } = props;
    // The outer ring of the dot takes the color of the line
    const dotStrokeColor = stroke || (dataKey === 'unique' ? colors.lineSkuInteraction : colors.lineSiteAverage);

    if (cx == null || cy == null) return null; // Guard against undefined coords

    return (
        <g>
            {/* Outer colored ring */}
            <circle cx={cx} cy={cy} r={5} fill={dotStrokeColor} stroke="none" />
            {/* Inner white dot */}
            <circle cx={cx} cy={cy} r={2.5} fill={colors.activeDotFill} stroke="none" />
        </g>
    );
};


export function InteractionDuration() {
  const [range, setRange] = useState({
    from: new Date(2025, 0, 1),
    to:   new Date(2025, 0, 7),
  });
  const [activeKey, setActiveKey] = useState<"unique" | "total" | null>("unique");
  const { data, loading, error } = useApiData<InteractionDurationData>({ endpoint: 'interaction-duration', dateRange: range });
  const d: InteractionDurationData = (error ? fallbackData : (data || fallbackData));
  const isFallback = error;

  if (loading) return <div className="text-gray-400">Loading interaction duration...</div>;

  return (
    <Card
        className="rounded-2xl border p-6 shadow-xl h-full flex flex-col font-[Inter,ui-sans-serif,system-ui]"
        style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-5"> {/* Adjusted mb */}
        <CardTitle className="text-xl font-light font-sans tracking-normal" style={{ color: colors.textPrimary }}> {/* Adjusted font */}
            Interaction Session Duration
        </CardTitle>
        <div className="flex items-center gap-2.5">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs font-normal border focus:outline-none focus:ring-1 focus:ring-white/30 hover:bg-[#3f3f46]" style={{ backgroundColor: colors.dateRangeButtonBg, borderColor: colors.dateRangeButtonBorder, color: colors.textMuted }} >
                <Calendar className="mr-1.5 h-3.5 w-3.5" style={{ color: colors.textSecondary }} />
                {format(range.from, "d MMM, yyyy")} – {format(range.to, "d MMM, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#1C1C1E] border-[#3A3A3A] rounded-lg shadow-xl" align="end">
              <div className="p-2 text-xs">Date Picker Placeholder</div>
              {/* <DateRangePicker date={range} onDateChange={setRange} /> */}
            </PopoverContent>
          </Popover>
          <button className="focus:outline-none p-1 rounded-full hover:bg-[#27272A]" style={{ color: colors.textMuted }}>
            <MoreHorizontal size={18} />
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

      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="relative h-[280px]"> {/* Adjusted height */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "circOut", delay: 0.1 }} className="h-full" >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.data} margin={{ top: 40, right: 10, left: 5, bottom: 5 }}> {/* More top margin, less right/bottom */}
                <CartesianGrid stroke={colors.gridLine} strokeDasharray="0" horizontal={true} vertical={false} /> {/* Solid horizontal lines */}
                <XAxis
                  dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fill: colors.textSecondary, fontSize: 10, fontWeight: 400 }} dy={10}
                  interval="preserveStartEnd" // Ensure first and last ticks are shown
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fill: colors.textSecondary, fontSize: 10, fontWeight: 400 }}
                  domain={[0, 160]} ticks={[0, 40, 80, 120, 160]} // Match Y-axis from image
                  tickFormatter={v => `${v}s`} width={35}
                />
                <Tooltip
                  position={{ y: -55 }}
                  cursor={{ stroke: colors.textPrimary, strokeWidth: 0.5, strokeDasharray: '0' }}
                  content={(props) => <CustomInteractionTooltip {...props} data={d.data} />}
                  wrapperStyle={{ zIndex: 50, outline: 'none' }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone" dataKey="unique" stroke={colors.lineSkuInteraction}
                  strokeWidth={ activeKey === "unique" || activeKey === null ? 2.5 : 1.5 }
                  dot={false} activeDot={(props: DotProps & { stroke?: string, dataKey?: string }) => <CustomActiveDot {...props} stroke={colors.lineSkuInteraction} dataKey="unique" />}
                  style={{ opacity: activeKey === "total" ? 0.4 : 1, filter: activeKey === "unique" ? `drop-shadow(0px 0px 6px ${colors.lineSkuInteraction}99)` : "none" }} // Adjusted shadow
                  animationEasing="ease-out" animationDuration={800}
                />
                <Line
                  type="monotone" dataKey="total" stroke={colors.lineSiteAverage}
                  strokeWidth={ activeKey === "total" || activeKey === null ? 2.5 : 1.5 }
                  dot={false} activeDot={(props: DotProps & { stroke?: string, dataKey?: string }) => <CustomActiveDot {...props} stroke={colors.lineSiteAverage} dataKey="total"/>}
                  style={{ opacity: activeKey === "unique" ? 0.4 : 1, filter: activeKey === "total" ? `drop-shadow(0px 0px 6px ${colors.lineSiteAverage}99)` : "none" }} // Adjusted shadow
                  animationEasing="ease-out" animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-5 mt-4 pt-1"> {/* Adjusted gap/margin */}
          {[
            { key: "unique", label: "Interaction with SKU", color: colors.lineSkuInteraction },
            { key: "total",  label: "Site Average",  color: colors.lineSiteAverage },
          ].map(series => {
            const isFaded = activeKey !== null && activeKey !== series.key;
            return (
              <button key={series.key} onClick={() => setActiveKey(prev => prev === series.key ? null : (series.key as any))}
                className={`flex items-center gap-1.5 text-xs transition-opacity duration-200 ${isFaded ? "opacity-50 hover:opacity-75" : "opacity-100"}`} // Adjusted opacity
                style={{ color: colors.textSecondary }} >
                <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: series.color, borderColor: series.color }} /> {/* Border matches bg */}
                <span>{series.label}</span>
              </button> );
          })}
        </div>
      </CardContent>
    </Card>
  );
}