// src/components/dashboard/CustomerVolumeAgeRefined.tsx (Example Path)

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, ArrowUp } from "lucide-react"; // Using ArrowUp for trend
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";


// --- Color Palette (Sampled from Image) ---
const colors = {
    background: "#1A1A1A", // Main card background
    cardBorder: "rgba(255, 255, 255, 0.4)",
    textPrimary: "#F4F4F5", // Brightest text (values)
    textSecondary: "#A1A1AA", // Subtitles, axis labels, legend
    textMuted: "#71717A", // Dimmer text ('over last week')
    gridLine: "rgba(255, 255, 255, 0.08)", // Faint grid lines

    dateRangeButtonBg: "#27272A",
    dateRangeButtonBorder: "rgba(255, 255, 255, 0.15)",

    barMen: "#06B6D4", // Cyan/Teal
    barWomen: "#F59E0B", // Orange/Amber

    tooltipBg: "#1C1C1E", // Dark background for tooltip
    tooltipBorder: "rgba(255, 255, 255, 0.15)",
    tooltipDot: "#FFFFFF", // White dot for hover indicator
    trendUp: "#34D399", // Green for trend
};

// --- Chart Data (Adjust values to match image proportions) ---
const chartData = [
    { age: "<18", men: 5800, women: 3800 },
    { age: "19-24", men: 8400, women: 6800 },
    { age: "25-30", men: 11200, women: 10000 },
    { age: "31-35", men: 13000, women: 12500 },
    { age: "36-40", men: 14382, women: 13000 }, // Peak data point
    { age: "41-45", men: 10800, women: 7000 },
    { age: "45-50", men: 7800, women: 9200 },
    { age: "51-55", men: 5200, women: 6500 },
    { age: ">55", men: 8200, women: 6200 },
];

// --- Custom Tooltip Content ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // The image tooltip only shows info for the PEAK bar.
        // Here, we'll check if the current hovered bar is the peak for Men.
        // In a real scenario, you'd identify the peak based on your data logic.
        // For this replication, let's assume the 36-40 age group is the designated peak.
        const isPeak = label === "36-40"; // Assuming "36-40" is the peak data point from image
        const peakValue = 14382;
        const peakTrend = 6;
        const peakAverageSpend = 3481;

        if (isPeak) {
            return (
                <div
                    className="rounded-md border shadow-lg p-3 min-w-[180px]" // Adjusted padding and min-width
                    style={{
                        backgroundColor: colors.tooltipBg,
                        borderColor: colors.tooltipBorder,
                        color: colors.textPrimary,
                    }}
                >
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                        <p className="text-base font-semibold">{peakValue.toLocaleString()}</p>
                        <div className="flex items-center text-xs" style={{ color: colors.trendUp }}>
                            <ArrowUp size={10} className="mr-0.5" /> {peakTrend}%
                            <span className="ml-1 text-[10px]" style={{ color: colors.textMuted }}>over last week</span>
                        </div>
                    </div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Average Spend: INR {peakAverageSpend.toLocaleString('en-IN')}
                    </p>
                </div>
            );
        }
    }
    return null; // No tooltip for other bars as per image
};


// --- Component ---
export function CustomerVolumeAge() {
    const [dateRange] = useState({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 7) });
    const [activeBarData, setActiveBarData] = useState<any>(null); // To store data of hovered peak bar

    const peakAgeGroup = "36-40"; // The age group that shows the tooltip

    return (
        <Card
            className="rounded-2xl border p-6 shadow-lg h-full flex flex-col font-[Inter,ui-sans-serif,system-ui]"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
        >
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <CardTitle className="text-xl font-light font-sans tracking-wide" style={{ color: colors.textPrimary }}>
                    Customer Volume with Age
                </CardTitle>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs font-normal border focus:outline-none focus:ring-1 focus:ring-white/30 hover:bg-[#3f3f46]" style={{ backgroundColor: colors.dateRangeButtonBg, borderColor: colors.dateRangeButtonBorder, color: colors.textSecondary }} >
                        <Calendar className="mr-1.5 h-3.5 w-3.5" style={{ color: colors.textMuted }} />
                        {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
                    </Button>
                    <button className="focus:outline-none p-1 rounded-full hover:bg-[#27272A]" style={{ color: colors.textMuted }}>
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0 flex-grow flex flex-col">
                {/* Chart Area */}
                <div className="h-[320px] relative"> {/* Increased height for chart */}
                    {/* Tooltip will be rendered by Recharts, but we'll style its content */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 10, right: 5, left: -25, bottom: 0 }} // Adjust margins
                                barGap={4} // Space between bars of the same group
                                barCategoryGap="35%" // Space between age groups
                                onMouseMove={(state) => {
                                    if (state.isTooltipActive && state.activePayload && state.activeLabel === peakAgeGroup) {
                                        // Only activate for the peak bar
                                        const barData = state.activePayload[0]; // Assuming Men bar is first for peak
                                        const barX = barData.payload.x + barData.payload.width / 2; // Center of the bar
                                        const barY = barData.payload.y; // Top of the bar
                                        setActiveBarData({ x: barX, y: barY, data: chartData.find(d => d.age === peakAgeGroup) });
                                    } else {
                                        setActiveBarData(null);
                                    }
                                }}
                                onMouseLeave={() => setActiveBarData(null)}
                            >
                                <defs>
                                    {/* You can define gradients here if bars need them, image looks solid */}
                                </defs>
                                <CartesianGrid strokeDasharray="3 0" stroke={colors.gridLine} vertical={false} />
                                <XAxis
                                    dataKey="age"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: colors.textSecondary, fontSize: 11, fontWeight: 400 }}
                                    dy={10} // Offset X-axis labels down
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: colors.textSecondary, fontSize: 11, fontWeight: 400 }}
                                    domain={[0, 16000]}
                                    ticks={[0, 4000, 8000, 12000, 16000]}
                                    tickFormatter={(value) => (value === 0 ? "0s" : `${value / 1000}k`)}
                                    width={35} // Give Y-axis some space
                                />
                                <Tooltip
                                    cursor={false} // Disable default Recharts cursor
                                    wrapperStyle={{ zIndex: 50, outline: 'none' }}
                                    content={<CustomTooltip />} // Use custom content
                                    position={activeBarData ? { x: activeBarData.x - 90, y: activeBarData.y - 85 } : undefined} // Adjust position relative to bar
                                    isAnimationActive={false} // Disable default tooltip animation
                                />
                                <Bar dataKey="men" name="Men" fill={colors.barMen} radius={[4, 4, 0, 0]} barSize={8}>
                                    {/* Custom dot for peak bar - only one dot should appear */}
                                    {chartData.map((entry, index) => (
                                        entry.age === peakAgeGroup ?
                                        <Cell key={`cell-men-${index}`}>
                                            {activeBarData && activeBarData.data.age === peakAgeGroup && (
                                                <LabelList
                                                    dataKey="men" // Not actually used for value
                                                    position="top"
                                                    content={() => (
                                                        <circle cx={0} cy={-5} r={4} fill={colors.tooltipDot} />
                                                    )}
                                                />
                                            )}
                                        </Cell> : <Cell key={`cell-men-${index}`} fill={colors.barMen} />
                                    ))}
                                </Bar>
                                <Bar dataKey="women" name="Women" fill={colors.barWomen} radius={[4, 4, 0, 0]} barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Legend */}
                <div className="flex justify-center items-center gap-6 mt-4 pt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.barMen }}></span>
                            <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.barMen }}></span>
                        </span>
                        <span className="text-xs" style={{ color: colors.textSecondary }}>Men</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.barWomen }}></span>
                            <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.barWomen }}></span>
                        </span>
                        <span className="text-xs" style={{ color: colors.textSecondary }}>Women</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}