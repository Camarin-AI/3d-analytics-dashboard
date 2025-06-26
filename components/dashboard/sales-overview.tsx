"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useApiData } from "@/hooks/use-api-data";
import { SalesOverviewData } from "@/lib/data-service";
import logger from "@/lib/logger";
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

interface SalesOverviewProps {
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
    divider: "rgba(255, 255, 255, 0.65)",
    trendUp: "#34D399",
    trendDown: "#F87171",
    social: "#6D28D9",
    redirect: "#7DD3FC",
    direct: "#3B82F6",
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

// Fallback data for when API fails
const FALLBACK_DATA = {
    chartData: [
        { name: 'Mon', social: 34000, redirect: 12000, direct: 10000 },
        { name: 'Tue', social: 28000, redirect: 11000, direct: 8000 },
        { name: 'Wed', social: 25000, redirect: 15000, direct: 9000 },
        { name: 'Thu', social: 22000, redirect: 18000, direct: 12000 },
        { name: 'Fri', social: 29000, redirect: 16000, direct: 10000 },
        { name: 'Sat', social: 35000, redirect: 14000, direct: 9000 },
        { name: 'Sun', social: 32000, redirect: 12000, direct: 11000 },
    ],
    loadToOpportunity: 64,
    opportunityToWin: 18,
};

export function SalesOverview({ dateRange }: SalesOverviewProps) {
    const { data: salesOverviewData, loading, error } = useApiData<SalesOverviewData>({
        endpoint: 'sales-overview',
        dateRange
    });

    const [activeSeriesKey, setActiveSeriesKey] = useState<Key | null>(null);

    // Use API data or fallback
    const data = salesOverviewData || FALLBACK_DATA;
    const categories = data?.chartData?.map(d => d.name) || [];

    // KPI data derived from API response
    const kpiData = [
        {
            kpiValue: `${data.loadToOpportunity}%`,
            trend: Math.abs(data.loadToOpportunity - 58), // Compare to baseline
            trendDirection: data.loadToOpportunity > 58 ? "up" as const : "down" as const,
            trendLabel: "over last week",
            sectionLabel: "Load to Opportunity Conversion",
        },
        {
            kpiValue: `${data.opportunityToWin}%`,
            trend: Math.abs(data.opportunityToWin - 16), // Compare to baseline
            trendDirection: data.opportunityToWin > 16 ? "up" as const : "down" as const,
            trendLabel: "over last week",
            sectionLabel: "Opportunity to Win Conversion",
        },
    ];

    const option = useMemo(() => ({
        backgroundColor: 'transparent',
        grid: { left: 50, right: 15, top: 10, bottom: 10 },
        xAxis: { type: 'category', data: categories, show: false, boundaryGap: false },
        yAxis: { type: 'value', show: false, splitLine: { show: false }, min: 0 },
        series: KEYS.map((key, index) => {
            const isActive = !activeSeriesKey || activeSeriesKey === key;
            let zLevel;
            if (key === 'social') zLevel = 1;
            else if (key === 'redirect') zLevel = 2;
            else zLevel = 3;

            return {
                name: LABELS[key], 
                type: 'line', 
                smooth: 0.65,
                stack: 'total', 
                symbol: 'none', 
                data: data.chartData?.map(d => d[key]),
                lineStyle: { width: 0 },
                areaStyle: {
                    color: SERIES_COLORS[key], 
                    opacity: isActive ? 0.85 : 0.2,
                    shadowBlur: isActive ? 10 : 0, 
                    shadowColor: isActive ? SERIES_COLORS[key] : 'transparent',
                },
                emphasis: { focus: 'series', areaStyle: { opacity: 1, shadowBlur: 15 } },
                z: zLevel,
            };
        }),
        tooltip: {
            trigger: 'axis', 
            backgroundColor: 'rgba(30, 30, 32, 0.9)',
            borderColor: colors.cardBorder, 
            borderWidth: 1,
            textStyle: { color: colors.textPrimary, fontSize: 11, fontFamily: 'Inter, sans-serif' },
            padding: [6, 10],
            formatter: (params: any) => {
                let tooltipHtml = `<div style="font-weight:500; margin-bottom:4px; color:${colors.textSecondary}; font-size:10px;">${params[0].axisValueLabel}</div>`;
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
    }), [activeSeriesKey, categories, data.chartData]);

    // Loading state
    if (loading) {
        return (
            <Card className="border p-6 shadow-lg h-full flex flex-col" style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}>
                <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
                    <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
                    <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
                </CardHeader>
                <div className="flex-grow">
                    <div className="h-8 bg-gray-700 rounded w-full mb-4 animate-pulse"></div>
                    <div className="h-[280px] bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-center gap-8 mt-4 pt-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                    ))}
                </div>
            </Card>
        );
    }

    // Error state with fallback data
    if (error) {
        logger.warn('Sales Overview API error, using fallback data:');
    }

    return (
        <Card
            className="border p-6 shadow-lg h-full flex flex-col font-[Inter,ui-sans-serif,system-ui]"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
        >
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
                <CardTitle className="text-xl font-light font-sans" style={{ color: colors.textPrimary }}>
                    Sales Overview {error && <span className="text-xs text-yellow-500 ml-2">(Offline Mode)</span>}
                </CardTitle>
                <button className="focus:outline-none p-1 rounded-full hover:bg-[#27272A]" style={{ color: colors.textMuted }}>
                    <MoreHorizontal size={18} />
                </button>
            </CardHeader>

            <div className="relative flex-grow flex flex-col">
                {/* Top Row for KPIs */}
                <div className="relative grid grid-cols-3 h-12 mb-2 z-10 pointer-events-none">
                    <div></div>
                    {kpiData.map((kpi, index) => (
                        <div key={index} className="flex flex-row items-center justify-center pointer-events-auto">
                            <span className="text-xl font-semibold font-light font-sans mr-1.5" style={{ color: colors.textPrimary }}>
                                {kpi.kpiValue}
                            </span>
                            <div className="flex flex-col items-start text-[10px] leading-tight">
                                <div className="flex items-center font-medium" style={{ color: kpi.trendDirection === "up" ? colors.trendUp : colors.trendDown }}>
                                    <Image 
                                        src={kpi.trendDirection === "up" ? "/upArrow.png" : "/downArrow.png"} 
                                        alt="Trend" 
                                        width={8} 
                                        height={8} 
                                        className="mr-0.5"
                                    />
                                    +{kpi.trend}%
                                </div>
                                <span style={{ color: colors.textMuted }}>{kpi.trendLabel}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart Area */}
                <div className="relative flex-grow h-[220px]">
                    {/* Y-Axis Badges */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-around py-[10%] z-10 pointer-events-none">
                        {["34k", "12k", "10k"].reverse().map((label, idx) => (
                            <span key={idx} className="bg-white/10 text-white text-[9px] font-medium px-1.5 py-[1px] rounded-full self-start mb-1">
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* ECharts Chart */}
                    <div className="absolute inset-0 h-full w-full">
                        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} />
                    </div>

                    {/* Vertical Divider Lines and Labels */}
                    <div className="absolute inset-0 grid grid-cols-3 pointer-events-none z-20">
                        <div></div>
                        {kpiData.map((kpi, index) => (
                            <div key={index} className="relative flex justify-center items-end">
                                <div className="absolute left-0 top-[10%] bottom-[15%] w-px" style={{backgroundColor: colors.divider}}></div>
                                <div className="pb-2 text-center pointer-events-auto">
                                    <span className="text-[11px] font-normal" style={{ color: colors.textSecondary }}>
                                        {kpi.sectionLabel}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-8 px-4 pt-5 border-t" style={{ borderColor: colors.divider }}>
                {KEYS.map((k) => (
                    <button
                        key={k}
                        onClick={() => setActiveSeriesKey((prev) => (prev === k ? null : k))}
                        className={`flex items-center space-x-2 text-xs transition-opacity duration-200 ${
                            !activeSeriesKey || activeSeriesKey === k ? "opacity-100" : "opacity-40 hover:opacity-70"
                        }`}
                        style={{ color: colors.textSecondary }}
                    >
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