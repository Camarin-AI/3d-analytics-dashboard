"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";
import { useApiData } from "@/hooks/use-api-data";

// --- Data Type Definitions ---
// This makes our component ready to handle dynamic peak information from the API.
interface PeakDetails {
    ageGroup: string;
    gender: 'men' | 'women';
    value: number;
    trend: number;
    averageSpend: number;
}
interface ChartEntry {
    age: string;
    men: number;
    women: number;
}
export interface CustomerVolumeData {
    chartData: ChartEntry[];
    peakDetails?: PeakDetails;
}

interface CustomerVolumeAgeProps {
    dateRange: {
        from: Date;
        to: Date;
    };
}

// Color Palette
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
    tooltipDot: "#FFFFFF",
    trendUp: "#34D399",
};


// Updated Fallback Data to match the new dynamic structure
const FALLBACK_DATA: CustomerVolumeData = {
    chartData: [
        { age: "<18", men: 5800, women: 3800 },
        { age: "19-24", men: 8400, women: 6800 },
        { age: "25-30", men: 11200, women: 10000 },
        { age: "31-35", men: 13000, women: 12500 },
        { age: "36-40", men: 14382, women: 13000 },
        { age: "41-45", men: 10800, women: 7000 },
        { age: "45-50", men: 7800, women: 9200 },
        { age: "51-55", men: 5200, women: 6500 },
        { age: ">55", men: 8200, women: 6200 },
    ],
    // The peak details are now part of the data object.
    peakDetails: {
        ageGroup: "36-40",
        gender: "men",
        value: 14382,
        trend: 6,
        averageSpend: 3481,
    }
};

// Helper function to calculate Y-axis properties dynamically
const calculateYAxisConfig = (data: ChartEntry[]) => {
    if (!data || data.length === 0) {
        return { yAxisMax: 1000, ticks: [0, 250, 500, 750, 1000] };
    }

    // Find the absolute maximum value in the dataset
    const maxValue = Math.max(...data.map(d => Math.max(d.men, d.women)), 0);

    // Calculate a "nice" upper limit for the axis by adding ~10% padding
    // and rounding up to a sensible number.
    const getNiceUpperLimit = (num: number) => {
        if (num === 0) return 100;
        const paddedNum = num * 1.1; // Add 10% padding
        const exponent = Math.floor(Math.log10(paddedNum));
        const powerOf10 = Math.pow(10, exponent);
        const firstDigit = Math.ceil(paddedNum / powerOf10);
        return firstDigit * powerOf10;
    };
    
    const finalYAxisMax = getNiceUpperLimit(maxValue);

    // Generate 5 evenly spaced ticks, including 0
    const tickCount = 5;
    const ticks = Array.from({ length: tickCount }, (_, i) =>
        Math.round((finalYAxisMax / (tickCount - 1)) * i)
    );

    return { yAxisMax: finalYAxisMax, ticks };
};


// Custom Tooltip now accepts dynamic peak details
const CustomTooltip = ({ active, payload, label, peakDetails }: any) => {
    if (active && payload && payload.length) {
        const menData = payload.find((p: any) => p.dataKey === 'men');
        const womenData = payload.find((p: any) => p.dataKey === 'women');

        // Check if the hovered bar is the designated peak bar.
        const isPeakBarHovered = peakDetails &&
            label === peakDetails.ageGroup &&
            payload.some((p: any) => p.dataKey === peakDetails.gender && p.value === peakDetails.value);

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
                    minWidth: isPeakBarHovered ? '180px' : 'auto',
                }}
            >
                {isPeakBarHovered ? (
                    <>
                        <div className="flex items-baseline gap-1.5 mb-0.5">
                            <p className="text-base font-semibold">{peakDetails.value.toLocaleString()}</p>
                            <div className="flex items-center text-xs" style={{ color: colors.trendUp }}>
                                <ArrowUp size={10} className="mr-0.5" /> {peakDetails.trend}%
                                <span className="ml-1 text-[10px]" style={{ color: colors.textMuted }}>over last week</span>
                            </div>
                        </div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                            Average Spend: INR {peakDetails.averageSpend.toLocaleString('en-IN')}
                        </p>
                    </>
                ) : (
                    <>
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

export function CustomerVolumeAge({ dateRange }: CustomerVolumeAgeProps) {
    const { data: customerVolumeData, loading, error } = useApiData<CustomerVolumeData>({
        endpoint: 'customer-volume',
        dateRange
    });

    const [peakBarHoverState, setPeakBarHoverState] = useState<{ x: number; y: number; active: boolean } | null>(null);
    const [activeLegend, setActiveLegend] = useState<string | null>(null);

    // Use API data or fallback
    const data = customerVolumeData || FALLBACK_DATA;

    // Use `useMemo` for efficient, dynamic calculations that only run when data changes
    const { yAxisMax, ticks } = useMemo(() => calculateYAxisConfig(data.chartData), [data.chartData]);
    const peakDetails = useMemo(() => data.peakDetails, [data.peakDetails]);

    const handleLegendClick = (dataKey: string) => {
        setActiveLegend(prev => prev === dataKey ? null : dataKey);
    };

    // Loading state component
    if (loading) {
        return (
            <Card className="rounded-2xl border p-6 shadow-lg h-full flex flex-col" style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}>
                <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                    <div className="h-6 bg-gray-700 rounded w-48 animate-pulse"></div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                        <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="h-[320px] bg-gray-700 rounded animate-pulse mb-4"></div>
                    <div className="flex justify-center gap-6">
                        <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className="rounded-2xl border p-6 shadow-lg h-full flex flex-col font-[Inter,ui-sans-serif,system-ui]"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
        >
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <CardTitle className="text-xl font-light font-sans tracking-wide" style={{ color: colors.textPrimary }}>
                    Customer Volume with Age {error && <span className="text-xs text-yellow-500 ml-2">(Offline Mode)</span>}
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
                                data={data.chartData}
                                margin={{ top: 20, right: 5, left: 15, bottom: 5 }}
                                barGap={4}
                                barCategoryGap="35%"
                                onMouseMove={(state) => {
                                    // Dynamic peak hover logic based on peakDetails
                                    if (state.isTooltipActive && state.activePayload && peakDetails && state.activeLabel === peakDetails.ageGroup) {
                                        const peakBarPayload = state.activePayload.find(p => p.dataKey === peakDetails.gender && p.value === peakDetails.value);
                                        if (peakBarPayload) {
                                            const barPayload = peakBarPayload.payload as any;
                                            const barX = barPayload.x + barPayload.width / 2;
                                            const barY = barPayload.y;
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
                                    interval={0}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: colors.textSecondary, fontSize: 11, fontWeight: 400 }}
                                    domain={[0, yAxisMax]}
                                    ticks={ticks}
                                    tickFormatter={(value) => (value === 0 ? "0" : `${value / 1000}k`)}
                                    width={40}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    wrapperStyle={{ zIndex: 50, outline: 'none' }}
                                    content={<CustomTooltip peakDetails={peakDetails} />}
                                    position={peakBarHoverState?.active ? { x: peakBarHoverState.x - 90, y: peakBarHoverState.y - 95 } : undefined}
                                    isAnimationActive={false}
                                />
                                <Bar dataKey="men" name="Men" radius={[4, 4, 0, 0]} barSize={8}>
                                    {data.chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-men-${index}`}
                                            fill={colors.barMen}
                                            opacity={activeLegend === null || activeLegend === "men" ? 1 : 0.3}
                                        />
                                    ))}
                                    {/* Dot for peak bar, visible on hover (dynamic check for 'men') */}
                                    {peakBarHoverState?.active && peakDetails?.gender === 'men' && (
                                        <LabelList
                                            dataKey="men"
                                            position="top"
                                            content={(props) => {
                                                const { x, y, width, index } = props as any;
                                                // Only render for the peak bar
                                                if (data.chartData[index]?.age === peakDetails.ageGroup) {
                                                    return <circle cx={x + width / 2} cy={y - 5} r={3.5} fill={colors.tooltipDot} />;
                                                }
                                                return null;
                                            }}
                                        />
                                    )}
                                </Bar>
                                <Bar dataKey="women" name="Women" radius={[4, 4, 0, 0]} barSize={8}>
                                    {data.chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-women-${index}`}
                                            fill={colors.barWomen}
                                            opacity={activeLegend === null || activeLegend === "women" ? 1 : 0.3}
                                        />
                                    ))}
                                     {/* Dot for peak bar, visible on hover (dynamic check for 'women') */}
                                     {peakBarHoverState?.active && peakDetails?.gender === 'women' && (
                                        <LabelList
                                            dataKey="women"
                                            position="top"
                                            content={(props) => {
                                                const { x, y, width, index } = props as any;
                                                // Only render for the peak bar
                                                if (data.chartData[index]?.age === peakDetails.ageGroup) {
                                                    return <circle cx={x + width / 2} cy={y - 5} r={3.5} fill={colors.tooltipDot} />;
                                                }
                                                return null;
                                            }}
                                        />
                                    )}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                <div className="flex justify-center items-center gap-6 mt-4 pt-2">
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