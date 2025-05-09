"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image"; // For up/down arrow images

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

// --- Color Palette (Based on Target Wireframe) ---
const colors = {
    background: "#1A1A1A",
    cardBorder: "rgba(255, 255, 255, 0.4)",
    textPrimary: "#F4F4F5", // Brightest text (KPIs, main title)
    textSecondary: "#A1A1AA", // Subtitles, legend text, bottom section labels
    textMuted: "#71717A", // Dimmer text ('over last week')
    divider: "rgba(255, 255, 255, 0.65)", // White divider lines for sections (more opaque)

    trendUp: "#34D399", // Green
    trendDown: "#F87171", // Red

    social: "#6D28D9",    // Purple (bottom layer)
    redirect: "#7DD3FC",  // Light Blue (middle layer)
    direct: "#3B82F6",    // Darker Blue (top layer)
};

const KEYS = ["social", "redirect", "direct"] as const;
type Key = typeof KEYS[number];

const SERIES_COLORS: Record<Key, string> = {
    social: colors.social,
    redirect: colors.redirect,
    direct: colors.direct,
};
const LABELS: Record<Key, string> = {
    social: "Social Media",
    redirect: "Redirect Links",
    direct: "Direct Login",
};

// Data represents the *individual contribution* of each band.
// Order in KEYS and z-index in series will determine visual stacking.
const rawData = [
    { name: 'Mon', social: 34000, redirect: 12000, direct: 10000 },
    { name: 'Tue', social: 28000, redirect: 11000, direct: 8000 },
    { name: 'Wed', social: 25000, redirect: 15000, direct: 9000 },
    { name: 'Thu', social: 22000, redirect: 18000, direct: 12000 },
    { name: 'Fri', social: 29000, redirect: 16000, direct: 10000 },
    { name: 'Sat', social: 35000, redirect: 14000, direct: 9000 },
    { name: 'Sun', social: 32000, redirect: 12000, direct: 11000 },
];

const kpiData = [
    // First section (left of first divider) has no KPI displayed on top in the mockup.
    { // This KPI is for the *second* visual section (middle one)
        kpiValue: "64%",
        trend: 8,
        trendDirection: "up" as const,
        trendLabel: "over last week",
        sectionLabel: "Load to Opportunity Conversion",
    },
    { // This KPI is for the *third* visual section (right one)
        kpiValue: "18%",
        trend: 2,
        trendDirection: "up" as const,
        trendLabel: "over last week",
        sectionLabel: "Opportunity to Win Conversion",
    },
];

export function SalesOverview() {
    const [activeSeriesKey, setActiveSeriesKey] = useState<Key | null>(null);
    const categories = rawData.map(d => d.name);

    const option = useMemo(() => ({
        backgroundColor: 'transparent',
        // Grid adjusted to give space for HTML overlays (KPIs at top, labels at bottom)
        // and Y-axis badges on the left.
        grid: { left: 50, right: 15, top: 10, bottom: 10 }, // Minimal grid padding
        xAxis: { type: 'category', data: categories, show: false, boundaryGap: false },
        yAxis: { type: 'value', show: false, splitLine: { show: false }, min: 0 }, // Ensure Y starts at 0
        series: KEYS.map((key, index) => { // Define Z-index explicitly for stacking
            const isActive = !activeSeriesKey || activeSeriesKey === key;
            let zLevel;
            if (key === 'social') zLevel = 1;      // Bottom
            else if (key === 'redirect') zLevel = 2; // Middle
            else zLevel = 3;                       // Top

            return {
                name: LABELS[key], type: 'line', smooth: 0.65, // Smoother curve
                stack: 'total', symbol: 'none', data: rawData.map(d => d[key]),
                lineStyle: { width: 0 },
                areaStyle: {
                    color: SERIES_COLORS[key], opacity: isActive ? 0.85 : 0.2, // Adjusted opacity
                    shadowBlur: isActive ? 10 : 0, shadowColor: isActive ? SERIES_COLORS[key] : 'transparent',
                },
                emphasis: { focus: 'series', areaStyle: { opacity: 1, shadowBlur: 15 } },
                z: zLevel,
            };
        }),
        tooltip: {
            trigger: 'axis', backgroundColor: 'rgba(30, 30, 32, 0.9)',
            borderColor: colors.cardBorder, borderWidth: 1,
            textStyle: { color: colors.textPrimary, fontSize: 11, fontFamily: 'Inter, sans-serif' },
            padding: [6, 10],
            formatter: (params: any) => {
                let tooltipHtml = `<div style="font-weight:500; margin-bottom:4px; color:${colors.textSecondary}; font-size:10px;">${params[0].axisValueLabel}</div>`;
                // Params are ordered by stack, reverse to match visual (top layer first in tooltip)
                params.slice().reverse().forEach((item: any) => {
                    const value = Math.abs(item.value);
                    tooltipHtml += `
                        <div style="display:flex; align-items:center; margin-top:3px;">
                            <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background-color:${item.color}; margin-right:5px;"></span>
                            <span style="color:${colors.textSecondary}; font-size:10px;">${item.seriesName}:</span>
                            <span style="font-weight:600; margin-left:auto; color:${colors.textPrimary}; font-size:10px;">${value.toLocaleString()}</span>
                        </div>`;
                });
                return tooltipHtml;
            }
        },
        // No ECharts markLines or graphic text for overlays
    }), [activeSeriesKey, categories]);

    return (
        <Card
            className="border p-6 shadow-lg h-full flex flex-col font-[Inter,ui-sans-serif,system-ui]"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
        >
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
                <CardTitle className="text-xl font-light font-sans" style={{ color: colors.textPrimary }}>
                    Sales Overview
                </CardTitle>
                <button className="focus:outline-none p-1 rounded-full hover:bg-[#27272A]" style={{ color: colors.textMuted }}>
                    <MoreHorizontal size={18} />
                </button>
            </CardHeader>

            {/* Container for Chart and ALL HTML Overlays */}
            <div className="relative flex-grow flex flex-col"> {/* Make this flex-col for chart and legend */}

                {/* Top Row for KPIs: Sits above the chart plotting area */}
                <div className="relative grid grid-cols-3 h-12 mb-2 z-10 pointer-events-none"> {/* KPI row */}
                    {/* First third (empty for KPI based on mockup) */}
                    <div></div>
                    {/* Second third (KPI 1) */}
                    <div className="flex flex-row items-center justify-center pointer-events-auto">
                        <span className="text-xl font-semibold font-light font-sans mr-1.5" style={{ color: colors.textPrimary }}>
                            {kpiData[0].kpiValue}
                        </span>
                        <div className="flex flex-col items-start text-[10px] leading-tight">
                            <div className="flex items-center font-medium" style={{ color: kpiData[0].trendDirection === "up" ? colors.trendUp : colors.trendDown }}>
                                <Image src={kpiData[0].trendDirection === "up" ? "/uparrow.png" : "/downarrow.png"} alt="Trend" width={8} height={8} className="mr-0.5"/>
                                +{kpiData[0].trend}%
                            </div>
                            <span style={{ color: colors.textMuted }}>{kpiData[0].trendLabel}</span>
                        </div>
                    </div>
                    {/* Third third (KPI 2) */}
                    <div className="flex flex-row items-center justify-center pointer-events-auto">
                         <span className="text-xl font-semibold font-light font-sans mr-1.5" style={{ color: colors.textPrimary }}>
                            {kpiData[1].kpiValue}
                        </span>
                        <div className="flex flex-col items-start text-[10px] leading-tight">
                            <div className="flex items-center font-medium" style={{ color: kpiData[1].trendDirection === "up" ? colors.trendUp : colors.trendDown }}>
                                 <Image src={kpiData[1].trendDirection === "up" ? "/uparrow.png" : "/downarrow.png"} alt="Trend" width={8} height={8} className="mr-0.5"/>
                                +{kpiData[1].trend}%
                            </div>
                            <span style={{ color: colors.textMuted }}>{kpiData[1].trendLabel}</span>
                        </div>
                    </div>
                </div>


                {/* Chart Area with Y-axis Badges and Section Labels */}
                <div className="relative flex-grow h-[220px]"> {/* Fixed height for chart area */}
                    {/* Y-Axis Badges (HTML) */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-around py-[10%] z-10 pointer-events-none">
                        {["34k", "12k", "10k"].reverse().map((label, idx) => ( // Reversed to match visual top-to-bottom
                            <span key={idx} className="bg-white/10 text-white text-[9px] font-medium px-1.5 py-[1px] rounded-full self-start mb-1">
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* ECharts Chart */}
                    <div className="absolute inset-0 h-full w-full">
                         <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} />
                    </div>

                    {/* Vertical Divider Lines and Bottom Section Labels (HTML) */}
                    <div className="absolute inset-0 grid grid-cols-3 pointer-events-none z-20">
                        {/* First Section (no line on left, no label) */}
                        <div></div>

                        {/* Second Section (Line on Left, Label at Bottom) */}
                        <div className="relative flex justify-center items-end">
                            <div className="absolute left-0 top-[10%] bottom-[15%] w-px" style={{backgroundColor: colors.divider}}></div> {/* Line */}
                            <div className="pb-2 text-center pointer-events-auto">
                                <span className="text-[11px] font-normal" style={{ color: colors.textSecondary }}>
                                    {kpiData[0].sectionLabel}
                                </span>
                            </div>
                        </div>

                        {/* Third Section (Line on Left, Label at Bottom) */}
                        <div className="relative flex justify-center items-end">
                            <div className="absolute left-0 top-[10%] bottom-[15%] w-px" style={{backgroundColor: colors.divider}}></div> {/* Line */}
                            <div className="pb-2 text-center pointer-events-auto">
                                <span className="text-[11px] font-normal" style={{ color: colors.textSecondary }}>
                                    {kpiData[1].sectionLabel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Legend */}
            <div
              className="flex items-center justify-center space-x-8 px-4 pt-5 border-t"
              style={{ borderColor: colors.divider }}
            >
              {KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => setActiveSeriesKey((prev) => (prev === k ? null : k))}
                  className={`
                    flex items-center 
                    space-x-2 
                    text-xs 
                    transition-opacity duration-200
                    ${!activeSeriesKey || activeSeriesKey === k
                      ? "opacity-100"
                      : "opacity-40 hover:opacity-70"}
                  `}
                  style={{ color: colors.textSecondary }}
                >
                  {/* marker: filled circle + 50%‑opaque ring */}
                  <span
                    className="w-3 h-3 flex-shrink-0 rounded-full bg-current ring-2 ring-current/50"
                    style={{ color: SERIES_COLORS[k] }}
                  />
                  <span>{LABELS[k]}</span>
                </button>
              ))}
            </div>

        </Card>
    );
}