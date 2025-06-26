// src/components/dashboard/SalesFunnelAnalysisRefined.tsx (Example Path)

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal } from "lucide-react"; // Keep MoreHorizontal
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image"; // Import Image for trend arrows
import { useApiData } from "@/hooks/use-api-data";
import type { SalesFunnelData } from '@/lib/data-service';

// --- Color Palette (Based on Target Image Analysis) ---
const colors = {
    background: "#1A1A1A", // Main card background
    cardBorder: "rgba(255, 255, 255, 0.4)",
    textPrimary: "#F4F4F5", // Brightest text (values, main revenue)
    textSecondary: "#A1A1AA", // Subtitles, button text, inactive labels
    textMuted: "#71717A", // Dimmer text ('last week', 'Weekly Revenue')
    divider: "rgba(255, 255, 255, 0.6)", // White divider lines (more opaque)

    dateRangeButtonBg: "#27272A",
    dateRangeButtonBorder: "rgba(255, 255, 255, 0.15)",

    trendUp: "#34D399", // Green
    trendDown: "#F87171", // Red

    // Funnel stage colors from target image
    funnelStage1: "#0090FF", // Bright Blue
    funnelStage2: "#4DD7FE", // Lighter Cyan/Blue
    funnelStage3: "#16A085", // Teal Green 1
    funnelStage4: "#0D8072", // Teal Green 2 (Slightly darker)
    funnelStage5: "#065F46", // Darkest Teal Green

    percentLabelBg: "rgba(0, 0, 0, 0.3)", // Darker transparent bg for %
    percentLabelBorder: "rgba(255, 255, 255, 0.15)", // Fainter border for % label

    stageButtonBg: "#27272A",
    stageButtonBorder: "rgba(255, 255, 255, 0.15)",
    stageButtonText: "#A1A1AA", // Secondary color matches other labels
};

// --- Funnel Data (Matching the 5 visual stages) ---
const funnelData = [
    { value: "6.80k", percent: 100, change: null, color: colors.funnelStage1 },
    { value: "6.80k", percent: 71, change: -6, color: colors.funnelStage2 },
    { value: "5.75k", percent: 43, change: 2, color: colors.funnelStage3 },
    { value: "4.5k", percent: 27, change: 3, color: colors.funnelStage4 },
    { value: "3.5k", percent: 10, change: 3, color: colors.funnelStage5 }
];

// --- Bottom Stage Labels (4 labels for 5 stages) ---
const stageLabels = ["Impressions", "Interactions", "Add to Cart", "Conversions"];

const fallbackData: SalesFunnelData = {
  weeklyRevenue: 8459,
  stages: [
    { value: "6.80k", percent: 100, change: null, color: colors.funnelStage1 },
    { value: "6.80k", percent: 71, change: -6, color: colors.funnelStage2 },
    { value: "5.75k", percent: 43, change: 2, color: colors.funnelStage3 },
    { value: "4.5k", percent: 27, change: 3, color: colors.funnelStage4 },
    { value: "3.5k", percent: 10, change: 3, color: colors.funnelStage5 }
  ],
  unitsSold: 500,
};

// --- Component ---
export function SalesFunnelAnalysis() {
    const [dateRange] = useState({
        from: new Date(2025, 0, 1),
        to: new Date(2025, 0, 7),
    });
    const { data, loading, error } = useApiData<SalesFunnelData>({ endpoint: 'sales-funnel', dateRange });
    const d: SalesFunnelData = (error ? fallbackData : (data || fallbackData));
    const isFallback = error;

    // --- SVG Funnel Path Calculations ---
    const svgWidth = 1000;
    const svgHeight = 150; // Adjusted height for better vertical proportion
    const numStages = d.stages.length;
    const stageWidth = svgWidth / numStages;
    const maxStageHeight = 130; // Max height within SVG viewbox
    const topPadding = 10;
    const curveFactor = 0.45; // Fine-tuned curve factor

    const getPathData = (index: number) => {
        const stage = d.stages[index];
        const prevStagePercent = index === 0 ? 100 : d.stages[index - 1].percent;

        // Use percentages directly relative to max height for visual accuracy
        const currentHeight = maxStageHeight * (stage.percent / 100);
        const prevHeight = maxStageHeight * (prevStagePercent / 100);

        const startX = index * stageWidth;
        const endX = (index + 1) * stageWidth;

        const startYTop = topPadding + (maxStageHeight - prevHeight) / 2;
        const startYBottom = startYTop + prevHeight;
        const endYTop = topPadding + (maxStageHeight - currentHeight) / 2;
        const endYBottom = endYTop + currentHeight;

        const cp1X = startX + stageWidth * curveFactor;
        const cp2X = endX - stageWidth * curveFactor;

        // First stage is rectangular
        if (index === 0) {
            return `M ${startX},${startYTop} L ${endX},${endYTop} L ${endX},${endYBottom} L ${startX},${startYBottom} Z`;
        }

        // Subsequent stages use curves
        const dPath = `M ${startX},${startYTop}` +
                  ` C ${cp1X},${startYTop} ${cp2X},${endYTop} ${endX},${endYTop}` +
                  ` L ${endX},${endYBottom}` +
                  ` C ${cp2X},${endYBottom} ${cp1X},${startYBottom} ${startX},${startYBottom}` +
                  ` Z`;
        return dPath;
    };

    if (loading) return <div className="text-gray-400">Loading sales funnel analysis...</div>;

    return (
        <Card
            className="rounded-2xl border p-6 shadow-xl h-full flex flex-col font-[Inter,ui-sans-serif,system-ui]"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
        >
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
                <CardTitle className="text-xl font-light font-sans tracking-wide" style={{ color: colors.textPrimary }}>
                    Sales Funnel Analysis
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

            {/* Subtle warning if fallback is used */}
            {isFallback && (
              <div className="mb-2 flex items-center gap-2 text-xs text-yellow-400">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                Offline mode: showing fallback data
              </div>
            )}

            {/* Content */}
            <CardContent className="p-0 flex-grow flex flex-col">
                {/* Weekly Revenue */}
                <div className="mb-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Weekly Revenue</p>
                    <p className="text-xl font-semibold" style={{ color: colors.textPrimary }}>INR {d.weeklyRevenue.toLocaleString("en-IN")}</p>
                </div>

                {/* Funnel Area */}
                <div className="relative flex-grow min-h-[240px] mb-4"> {/* Increased min-height slightly */}

                    {/* Top Labels (Values & Trends) - Refined Positioning */}
                    <div className="absolute top-0 left-0 right-0 flex items-start h-8 z-20 px-[1%]"> {/* Add slight horizontal padding */}
                        {d.stages.map((stage, index) => (
                            <div key={`label-group-${index}`}
                                 className="absolute top-0 flex items-center"
                                 // Position each group starting slightly before its stage visually
                                 style={{ left: `${(index * (100 / numStages)) + (index === 0 ? 1 : 2)}%`}} // Offset starting position
                                >
                                {/* Value */}
                                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                                    {stage.value}
                                </span>
                                {/* Trend (Positioned next to value, only if change exists) */}
                                {stage.change !== null && (
                                    <div className={`flex items-center gap-0.5 text-[10px] font-medium whitespace-nowrap ml-1.5`} // Added margin-left
                                         style={{ color: stage.change > 0 ? colors.trendUp : colors.trendDown }}>
                                        {/* Use Image component for arrows */}
                                        <Image
                                            src={stage.change > 0 ? "/upArrow.png" : "/downArrow.png"}
                                            alt={stage.change > 0 ? "Up Arrow" : "Down Arrow"}
                                            width={8} // Adjust size as needed
                                            height={8}
                                            className="flex-shrink-0"
                                        />
                                        {Math.abs(stage.change)}%
                                        <span className="ml-1 font-normal text-[9px]" style={{ color: colors.textMuted }}>last week</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* SVG Funnel Shapes */}
                    <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight + topPadding * 2}`}
                        className="absolute inset-0 top-8 w-full h-[calc(100%-6rem)]" // Adjusted height calculation
                        preserveAspectRatio="none"
                    >
                        {/* Render Funnel Stages */}
                        {d.stages.map((stage, index) => (
                            <motion.path
                                key={`path-${index}`}
                                d={getPathData(index)}
                                fill={stage.color}
                                initial={{ opacity: 0 }} // Simpler initial state
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }} // Faster, subtle delay
                            />
                        ))}

                        {/* Vertical Divider Lines (Positioned at the end of each stage except last) */}
                        {d.stages.slice(0, numStages - 1).map((_, index) => {
                            const x = (index + 1) * stageWidth;
                             // Extend slightly beyond SVG viewbox for visual effect if needed, or use container height
                            const y1 = -5; // Start slightly above
                            const y2 = svgHeight + topPadding * 2 + 5; // End slightly below
                            return (
                                 <motion.line
                                    key={`divider-${index}`}
                                    x1={x} y1={y1} x2={x} y2={y2}
                                    stroke={colors.divider} strokeWidth="1" // Thinner divider
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                 />
                            );
                        })}

                         {/* Percentage Labels Inside Funnel */}
                         {d.stages.map((stage, index) => {
                             const stageHeight = maxStageHeight * (stage.percent / 100);
                             const stageCenterY = topPadding + (maxStageHeight - stageHeight) / 2 + stageHeight / 2;
                             const stageCenterX = (index + 0.5) * stageWidth;
                             const labelWidth = 32; const labelHeight = 16; // Adjusted size

                             return (
                                <g key={`percent-label-${index}`}>
                                     <motion.rect
                                         x={stageCenterX - labelWidth / 2} y={stageCenterY - labelHeight / 2}
                                         width={labelWidth} height={labelHeight} rx="8" ry="8" // Fully rounded
                                         fill={colors.percentLabelBg} stroke={colors.percentLabelBorder} strokeWidth="0.5"
                                         initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }} />
                                     <motion.text
                                         x={stageCenterX} y={stageCenterY + 0.5} // Slight Y adjustment for baseline
                                         fill={colors.textPrimary} fontSize="8" fontWeight="medium" textAnchor="middle" dominantBaseline="middle"
                                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }} >
                                         {stage.percent}%
                                     </motion.text>
                                 </g> );
                         })}
                    </svg>

                    {/* Bottom Right: # Units Sold */}
                    <div className="absolute bottom-1 right-4 text-right z-10"> {/* Position lower */}
                        <p className="text-[11px]" style={{ color: colors.textMuted }}># Units Sold</p>
                        <p className="text-base font-semibold" style={{ color: colors.textPrimary }}>{d.unitsSold}</p>
                    </div>
                </div>

                {/* Stage Labels (Bottom) - Positioned under dividers */}
                 <div className="relative h-7 -mt-4"> {/* Container for bottom labels, slight negative margin */}
                    {stageLabels.map((label, index) => {
                         // Calculate center X position under the divider line
                         const dividerXPercent = ((index + 1) / numStages) * 100;
                         return (
                            <div key={label} className="absolute top-0 transform -translate-x-1/2"
                                 style={{ left: `${dividerXPercent}%` }}>
                                 <Button
                                     variant="outline" size="sm"
                                     className="h-6 px-3 rounded-full text-[11px] font-normal border hover:bg-[#3f3f46] focus:outline-none focus:ring-1 focus:ring-white/30"
                                     style={{ backgroundColor: colors.stageButtonBg, borderColor: colors.stageButtonBorder, color: colors.stageButtonText, }} >
                                     {label}
                                 </Button>
                             </div>
                         );
                     })}
                 </div>
            </CardContent>
        </Card>
    );
}