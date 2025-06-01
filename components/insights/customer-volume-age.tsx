"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";

// --- Color Palette (from your code) ---
const colors = {
    background: "#1A1A1A",
    cardBorder: "rgba(255, 255, 255, 0.4)",
    textPrimary: "#F4F4F5",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",
    gridLine: "rgba(255, 255, 255, 0.08)",
    dateRangeButtonBg: "#27272A",
    dateRangeButtonBorder: "rgba(255, 255, 255, 0.15)",
    barMen: "#06B6D4",
    barWomen: "#F59E0B",
    tooltipBg: "#1C1C1E",
    tooltipBorder: "rgba(255, 255, 255, 0.15)",
    tooltipDot: "#FFFFFF", // White dot for peak bar hover indicator
    trendUp: "#34D399",
};

// --- Chart Data (from your code) ---
const chartData = [
    { age: "<18", men: 5800, women: 3800 },
    { age: "19-24", men: 8400, women: 6800 },
    { age: "25-30", men: 11200, women: 10000 },
    { age: "31-35", men: 13000, women: 12500 },
    { age: "36-40", men: 14382, women: 13000 }, // Peak data point for Men
    { age: "41-45", men: 10800, women: 7000 },
    { age: "45-50", men: 7800, women: 9200 },
    { age: "51-55", men: 5200, women: 6500 },
    { age: ">55", men: 8200, women: 6200 },
];

// --- Peak Bar Configuration (for special tooltip and dot) ---
const peakAgeGroup = "36-40";
const peakBarMenValue = 14382; // The value of the men's bar in the peak age group
const peakBarDetails = { // Data for the special tooltip for the peak bar
    trend: 6,
    averageSpend: 3481,
};

// --- Custom Tooltip Content ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const menData = payload.find((p: any) => p.dataKey === 'men');
        const womenData = payload.find((p: any) => p.dataKey === 'women');

        // Check if the current hovered bar is the designated peak bar for men
        const isPeakMenBarHovered = label === peakAgeGroup && menData?.value === peakBarMenValue;

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="rounded-md border shadow-lg p-3"
                style={{
                    backgroundColor: colors.tooltipBg,
                    borderColor: colors.tooltipBorder,
                    color: colors.textPrimary,
                    minWidth: isPeakMenBarHovered ? '180px' : 'auto',
                }}
            >
                {isPeakMenBarHovered ? (
                    <> {/* Special content for the peak bar */}
                        <div className="flex items-baseline gap-1.5 mb-0.5">
                            <p className="text-base font-semibold">{peakBarMenValue.toLocaleString()}</p>
                            <div className="flex items-center text-xs" style={{ color: colors.trendUp }}>
                                <ArrowUp size={10} className="mr-0.5" /> {peakBarDetails.trend}%
                                <span className="ml-1 text-[10px]" style={{ color: colors.textMuted }}>over last week</span>
                            </div>
                        </div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                            Average Spend: INR {peakBarDetails.averageSpend.toLocaleString('en-IN')}
                        </p>
                    </>
                ) : (
                    <> {/* Generic content for all other bars */}
                        <p className="text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>{label}</p>
                        {menData && (
                            <div className="flex items-center text-xs">
                                <span className="w-2 h-2 rounded-full mr-1.5" style={{backgroundColor: menData.color || colors.barMen}}></span>
                                Men: <span className="font-medium ml-1">{menData.value.toLocaleString()}</span>
                            </div>
                        )}
                        {womenData && (
                            <div className="flex items-center text-xs mt-1">
                                <span className="w-2 h-2 rounded-full mr-1.5" style={{backgroundColor: womenData.color || colors.barWomen}}></span>
                                Women: <span className="font-medium ml-1">{womenData.value.toLocaleString()}</span>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        );
    }
    return null;
};


export function CustomerVolumeAge() {
    const [dateRange] = useState({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 7) });
    // State for custom positioning of peak bar tooltip and showing dot
    const [peakBarHoverState, setPeakBarHoverState] = useState<{ x: number; y: number; active: boolean } | null>(null);
    // State for legend interaction
    const [activeLegend, setActiveLegend] = useState<string | null>(null);

    const handleLegendClick = (dataKey: string) => {
        setActiveLegend(prev => prev === dataKey ? null : dataKey);
    };

    return (
        <Card
            className="rounded-2xl border p-6 shadow-lg h-full flex flex-col font-[Inter,ui-sans-serif,system-ui]"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
        >
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

            <CardContent className="p-0 flex-grow flex flex-col">
                <div className="h-[320px] relative">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                // 2. Fix y-axis labels cropping: Increased left margin
                                margin={{ top: 20, right: 5, left: 15, bottom: 5 }} // Increased top margin for potential dot, increased left margin
                                barGap={4}
                                barCategoryGap="35%"
                                onMouseMove={(state) => {
                                    if (state.isTooltipActive && state.activePayload && state.activeLabel === peakAgeGroup) {
                                        const menBarPayload = state.activePayload.find(p => p.dataKey === 'men');
                                        if (menBarPayload && menBarPayload.value === peakBarMenValue) {
                                            // @ts-ignore // Recharts payload type can be complex
                                            const barX = menBarPayload.payload.x + menBarPayload.payload.width / 2;
                                            // @ts-ignore
                                            const barY = menBarPayload.payload.y;
                                            setPeakBarHoverState({ x: barX, y: barY, active: true });
                                            return;
                                        }
                                    }
                                    setPeakBarHoverState(prev => prev && prev.active ? { ...prev, active: false } : null);
                                }}
                                onMouseLeave={() => setPeakBarHoverState(null)}
                            >
                                <CartesianGrid strokeDasharray="3 0" stroke={colors.gridLine} vertical={false} />
                                <XAxis
                                    dataKey="age"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: colors.textSecondary, fontSize: 11, fontWeight: 400 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: colors.textSecondary, fontSize: 11, fontWeight: 400 }}
                                    domain={[0, 16000]}
                                    ticks={[0, 4000, 8000, 12000, 16000]}
                                    tickFormatter={(value) => (value === 0 ? "0" : `${value / 1000}k`)} // Changed "0s" to "0"
                                    width={40} // Ensure enough width for Y-axis labels
                                />
                                <Tooltip
                                    // 1. Tooltip functional for every bar:
                                    //    - CustomTooltip handles content for all bars.
                                    //    - Conditional positioning for the peak bar's special tooltip.
                                    cursor={{ fill: 'transparent' }} // Make cursor area invisible
                                    wrapperStyle={{ zIndex: 50, outline: 'none' }}
                                    content={<CustomTooltip />}
                                    position={peakBarHoverState?.active ? { x: peakBarHoverState.x - 90, y: peakBarHoverState.y - 95 } : undefined}
                                    isAnimationActive={false}
                                />
                                <Bar dataKey="men" name="Men" radius={[4, 4, 0, 0]} barSize={8}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-men-${index}`}
                                            fill={colors.barMen}
                                            // 3. Highlight on legend interaction
                                            opacity={activeLegend === null || activeLegend === "men" ? 1 : 0.3}
                                        />
                                    ))}
                                    {/* Dot for peak bar, visible on hover */}
                                    {peakBarHoverState?.active && chartData.find(entry => entry.age === peakAgeGroup)?.men === peakBarMenValue && (
                                        <LabelList
                                            dataKey="men"
                                            position="top"
                                            content={(props) => {
                                                const { x, y, width } = props as any;
                                                // Only render for the peak bar
                                                if (chartData[props.index as number]?.age === peakAgeGroup) {
                                                    return <circle cx={x + width / 2} cy={y - 5} r={3.5} fill={colors.tooltipDot} />;
                                                }
                                                return null;
                                            }}
                                        />
                                    )}
                                </Bar>
                                <Bar dataKey="women" name="Women" radius={[4, 4, 0, 0]} barSize={8}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-women-${index}`}
                                            fill={colors.barWomen}
                                            // 3. Highlight on legend interaction
                                            opacity={activeLegend === null || activeLegend === "women" ? 1 : 0.3}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                <div className="flex justify-center items-center gap-6 mt-4 pt-2">
                    {/* 3. Legend interaction */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1.5 p-1 h-auto rounded-md ${activeLegend === "men" ? "bg-gray-700/50" : ""}`}
                        onClick={() => handleLegendClick("men")}
                        style={{ opacity: activeLegend === null || activeLegend === "men" ? 1 : 0.5 }}
                    >
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.barMen }}></span>
                        <span className="text-xs" style={{ color: colors.textSecondary }}>Men</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1.5 p-1 h-auto rounded-md ${activeLegend === "women" ? "bg-gray-700/50" : ""}`}
                        onClick={() => handleLegendClick("women")}
                        style={{ opacity: activeLegend === null || activeLegend === "women" ? 1 : 0.5 }}
                    >
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.barWomen }}></span>
                        <span className="text-xs" style={{ color: colors.textSecondary }}>Women</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}