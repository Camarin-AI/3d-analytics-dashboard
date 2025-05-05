// src/components/dashboard/RegionAnalytics.tsx (Example Path)

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import createGlobe from "cobe"; // Remove COBEInstance import since it's not exported

// --- Color Palette (Meticulously Sampled/Matched) ---
const colors = {
    background: "#111113", // Very dark background
    cardBackground: "#1C1C1E", // Background for inner cards
    cardBorder: "rgba(255, 255, 255, 0.1)", // Faint borders
    textPrimary: "#F4F4F5", // Main bright text (values)
    textSecondary: "#A1A1AA", // Subtitles, labels
    textMuted: "#71717A", // Dimmed text (e.g., "last week", table headers)
    textAccent: "#FFFFFF", // Pure white for some highlights if needed
    divider: "rgba(255, 255, 255, 0.08)", // Separator lines

    regionButtonBgActive: "#27272A",
    regionButtonBorder: "rgba(255, 255, 255, 0.2)",
    regionButtonTextActive: "#FFFFFF",
    regionButtonTextInactive: "#A1A1AA",

    trendUp: "#34D399", // Green
    trendDown: "#F87171", // Red
    trendBgUp: "rgba(52, 211, 153, 0.1)",
    trendBgDown: "rgba(248, 113, 113, 0.1)",

    sparklineSales: "#5FA8FC", // Blueish
    sparklineUnits: "#4CD8E5", // Tealish

    badgeBestSellingBg: "#27272A",
    badgeBestSellingBorder: "rgba(255, 255, 255, 0.2)",
    badgeBestSellingGlow: "rgba(255, 255, 255, 0.5)",

    skuImageBg: "#111113", // Background for SKU image circle
    skuTagBg: "#27272A",
    skuTagBorder: "rgba(255, 255, 255, 0.15)",

    globeOverlayBg: "rgba(40, 40, 42, 0.6)", // Semi-transparent dark grey
    globeOverlayBorder: "rgba(255, 255, 255, 0.15)",

    genderMale: "#4CD8E5", // Teal
    genderFemale: "#F59E0B", // Orange
    genderTrack: "rgba(255, 255, 255, 0.08)" // Faint track
};

// --- Component ---
export function RegionAnalytics() {
    const [selectedRegion, setSelectedRegion] = useState("India");
    // Add more regions as needed for the carousel
    const regions = ["India", "United States", "Europe", "Australia"]; // Example
    const currentIndex = regions.indexOf(selectedRegion);

    const handlePrevious = () => {
        const newIndex = (currentIndex - 1 + regions.length) % regions.length;
        setSelectedRegion(regions[newIndex]);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % regions.length;
        setSelectedRegion(regions[newIndex]);
    };

    // Filter displayed regions (e.g., show current + next or similar logic for limited view)
    const displayedRegions = () => {
        // Simple logic: show current and next one (or wrap around)
        const nextIndex = (currentIndex + 1) % regions.length;
        if (regions.length <= 2) return regions;
        if (currentIndex === nextIndex) return [regions[currentIndex]]; // Only one region
        return [regions[currentIndex], regions[nextIndex]];
    };


    return (
        <Card
            className="rounded-2xl border p-6 shadow-xl h-full flex flex-col font-sans"
            style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
            }}
        >
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <CardTitle className="text-xl font-normal tracking-wide" style={{ color: colors.textPrimary }}>
                    Region Analytics
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full hover:bg-[#27272A]" // Round hover effect
                        style={{ color: colors.textSecondary }}
                        onClick={handlePrevious}
                        disabled={regions.length <= 1}
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="flex gap-2">
                        {displayedRegions().map((region) => (
                            <Button
                                key={region}
                                variant="outline" // Base variant
                                size="sm"
                                className={`h-8 px-4 rounded-full border text-xs transition-colors duration-200 ${
                                    region === selectedRegion
                                        ? 'border-transparent' // Active: specific bg, white text
                                        : 'hover:bg-[#27272A] hover:border-transparent' // Inactive: hover state
                                }`}
                                style={{
                                     backgroundColor: region === selectedRegion ? colors.regionButtonBgActive : 'transparent',
                                     borderColor: region === selectedRegion ? 'transparent' : colors.regionButtonBorder,
                                     color: region === selectedRegion ? colors.regionButtonTextActive : colors.regionButtonTextInactive,
                                }}
                                onClick={() => setSelectedRegion(region)}
                            >
                                {region}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full hover:bg-[#27272A]"
                        style={{ color: colors.textSecondary }}
                        onClick={handleNext}
                        disabled={regions.length <= 1}
                    >
                         <ChevronRight size={18} />
                    </Button>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Left Column */}
                <div className="space-y-4 lg:space-y-5">
                    <TotalSalesCard />
                    <TotalUnitSoldCard />
                    <SalesMetricsCard />
                    <TopSkusCard />
                </div>

                {/* Right Area (Globe + Gender) */}
                <div className="lg:col-span-2 flex flex-col min-h-[600px] lg:min-h-0"> {/* Ensure height */}
                     {/* Globe takes most space, overlays are positioned absolutely */}
                    <div className="flex-grow relative">
                        <GlobeVisualization selectedRegion={selectedRegion} />
                    </div>
                    {/* Gender card pushed to bottom */}
                    <div className="mt-4 lg:mt-6">
                        <GenderDistributionCard region={selectedRegion} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


// --- Sub Components ---

function TotalSalesCard() {
    // Placeholder data
    const sales = 40000;
    const trend = 2; // Positive percentage
    const isTrendUp = trend > 0;

    return (
        <Card className="rounded-xl border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>Total Sales</p>
                        <p className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                            INR {sales.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div
                        className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded`}
                        style={{ backgroundColor: isTrendUp ? colors.trendBgUp : colors.trendBgDown, color: isTrendUp ? colors.trendUp : colors.trendDown }}
                    >
                        {isTrendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {Math.abs(trend)}%
                        <span className="ml-1 font-normal text-[10px]" style={{ color: colors.textMuted }}>last week</span>
                    </div>
                </div>
                {/* Sparkline SVG */}
                <div className="h-8 w-full">
                     <svg width="100%" height="100%" viewBox="0 0 100 25" preserveAspectRatio="none">
                        <motion.path
                            d="M0,15 C10,5 20,20 30,12 C40,22 50,8 60,18 C70,5 80,15 90,8 C100,20" // Smoother curve
                            fill="none"
                            stroke={colors.sparklineSales}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </svg>
                </div>
            </CardContent>
        </Card>
    );
}

function TotalUnitSoldCard() {
     // Placeholder data
    const units = 2000;
    const trend = 2; // Positive percentage
    const isTrendUp = trend > 0;

    return (
        <Card className="rounded-xl border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>Total Unit Sold</p>
                        <p className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                            {units.toLocaleString("en-IN")}
                        </p>
                    </div>
                     <div
                        className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded`}
                        style={{ backgroundColor: isTrendUp ? colors.trendBgUp : colors.trendBgDown, color: isTrendUp ? colors.trendUp : colors.trendDown }}
                    >
                        {isTrendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {Math.abs(trend)}%
                        <span className="ml-1 font-normal text-[10px]" style={{ color: colors.textMuted }}>last week</span>
                    </div>
                </div>
                 {/* Sparkline SVG */}
                <div className="h-8 w-full">
                     <svg width="100%" height="100%" viewBox="0 0 100 25" preserveAspectRatio="none">
                        <motion.path
                            d="M0,20 C10,10 20,22 30,15 C40,5 50,18 60,12 C70,25 80,10 90,15 C100,5" // Different curve
                            fill="none"
                            stroke={colors.sparklineUnits}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }} // Slight delay
                        />
                    </svg>
                </div>
            </CardContent>
        </Card>
    );
}

function SalesMetricsCard() {
    // Placeholder Data
    const metrics = [
        { name: "Avg. Order Value", value: "INR 1000", trend: 6 },
        { name: "Avg. Return Rate", value: "6.5%", trend: 6 },
        { name: "Avg. Conversion Rate", value: "5.5%", trend: -6 },
    ];

    return (
         <Card className="rounded-xl border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-4">
                 <div className="flex justify-between items-center mb-3 relative">
                    <p className="text-sm font-medium" style={{color: colors.textPrimary}}>Sales</p>
                    {/* Best Selling Badge with Glow */}
                    <div className="relative">
                        <span
                            className="absolute -inset-1.5 rounded-full opacity-50"
                            style={{
                                background: `radial-gradient(${colors.badgeBestSellingGlow}, transparent 70%)`,
                                filter: "blur(8px)",
                                zIndex: 0,
                            }}
                         />
                        <span
                           className="relative z-10 text-[10px] px-3 py-1 rounded-full border"
                           style={{
                             backgroundColor: colors.badgeBestSellingBg,
                             borderColor: colors.badgeBestSellingBorder,
                             color: colors.textSecondary
                           }}
                        >
                          Best Selling Region
                        </span>
                    </div>
                 </div>
                 {/* Table */}
                 <table className="w-full text-xs border-separate border-spacing-y-2"> {/* Use border-spacing */}
                     <thead>
                         {/* Optional Header - Image doesn't explicitly show one, but could be added */}
                         {/* <tr style={{ color: colors.textMuted }}>
                             <th className="text-left font-normal pb-1">Metric</th>
                             <th className="text-left font-normal pb-1">Current Value</th>
                         </tr> */}
                     </thead>
                     <tbody>
                         {metrics.map(metric => {
                             const isTrendUp = metric.trend > 0;
                             return (
                                 <tr key={metric.name}>
                                     <td className="py-1 font-medium" style={{color: colors.textSecondary}}>{metric.name}</td>
                                     <td className="py-1 text-right font-medium" style={{color: colors.textPrimary}}>{metric.value}</td>
                                     <td className="py-1 text-right w-[80px]"> {/* Fixed width for trend */}
                                          <div
                                            className={`inline-flex items-center justify-end gap-1 text-[10px] font-medium`}
                                            style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }}
                                        >
                                            {isTrendUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                            {Math.abs(metric.trend)}%
                                            <span className="ml-1 font-normal" style={{ color: colors.textMuted }}>last week</span>
                                        </div>
                                     </td>
                                 </tr>
                             );
                         })}
                     </tbody>
                 </table>
            </CardContent>
         </Card>
    );
}

function TopSkusCard() {
    // Placeholder Data
    const skus = [
        { id: "ID140001", name: "Diamond Cut Earrings", image: "/diamond-earrings.png", dailyAvg: 1650, trend: 6, interaction: 71, tag: "Most Interacted With" },
        { id: "ID140001", name: "Diamond Cut Earrings", image: "/diamond-earrings.png", dailyAvg: 1650, trend: 6, interaction: 71, tag: "Most Purchased" }, // Reusing data for example
    ];

    return (
        <Card className="rounded-xl border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-4">
                <p className="text-sm font-medium mb-4" style={{color: colors.textPrimary}}>Top SKUs in the Region</p>
                <div className="space-y-4">
                    {skus.map((sku, index) => {
                         const isTrendUp = sku.trend > 0;
                         return (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.skuImageBg }}>
                                    <Image src={sku.image} alt={sku.name} width={32} height={32} className="object-contain" />
                                </div>
                                <div className="flex-1 min-w-0"> {/* Prevent text overflow issues */}
                                    <div className="flex justify-between items-baseline gap-2">
                                         <p className="text-xs font-medium truncate" style={{color: colors.textPrimary}} title={sku.name}>{sku.name}</p>
                                         <div className="flex items-baseline gap-1 flex-shrink-0">
                                            <span className="text-xs font-medium" style={{color: colors.textPrimary}}>INR {sku.dailyAvg.toLocaleString('en-IN')}</span>
                                            <span className="text-[10px]" style={{color: colors.textMuted}}>/ Daily Average</span>
                                         </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-[10px]" style={{ color: colors.textSecondary }}>SKU ID: {sku.id}</p>
                                         <div
                                            className={`inline-flex items-center gap-1 text-[10px] font-medium`}
                                            style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }}
                                         >
                                            {isTrendUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                            {Math.abs(sku.trend)}%
                                            <span className="ml-1 font-normal" style={{ color: colors.textMuted }}>last week</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span
                                            className="text-[9px] px-2 py-0.5 rounded-full border"
                                            style={{
                                                backgroundColor: colors.skuTagBg,
                                                borderColor: colors.skuTagBorder,
                                                color: colors.textSecondary
                                            }}
                                        >{sku.tag}</span>
                                        <span className="text-xs font-medium" style={{color: colors.textPrimary}}>{sku.interaction}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}


// --- Globe Component ---
interface GlobeVisualizationProps {
    selectedRegion: string;
}

function GlobeVisualization({ selectedRegion }: GlobeVisualizationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const globeInstance = useRef<ReturnType<typeof createGlobe> | null>(null); // Use ReturnType instead
    const rotationSpeed = 0.002; // Slower rotation

    // Example markers (replace with dynamic data based on selectedRegion if needed)
    const markers = [
        { location: [20.5937, 78.9629] as [number, number], size: 0.1 }, // India marker approx
        { location: [21.5937, 79.9629] as [number, number], size: 0.05 },
        { location: [19.5937, 77.9629] as [number, number], size: 0.08 },
        // Add more markers for visual density or based on region
        { location: [38.9637, 35.2433] as [number, number], size: 0.06 }, // Turkey approx
        { location: [34.0479, 100.6197] as [number, number], size: 0.07 }, // China approx
    ];

    useEffect(() => {
        if (!canvasRef.current) return;

        let phi = 3.8; // Initial rotation latitude (adjust to center desired area)
        let theta = 0.5; // Initial rotation longitude

        // Adjust initial phi/theta based on selectedRegion for better centering
        if (selectedRegion === "United States") {
            phi = 4.5; theta = -1.6;
        } else if (selectedRegion === "Europe") {
            phi = 4.8; theta = 0.1;
        } else if (selectedRegion === "India") {
            phi = 4.2; theta = 1.0; // Adjust for better India view
        }
        // Add more region centers

        globeInstance.current = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,  // Use fixed size * DPR for clarity
            height: 600 * 2,
            phi: phi,
            theta: theta,
            dark: 1,         // Dark mode
            diffuse: 1.2,    // Lighting intensity
            mapSamples: 18000, // Number of dots
            mapBrightness: 5, // Brightness of main dots
            mapBaseBrightness: 0.15, // Brightness of background dots
            baseColor: [0.15, 0.15, 0.18], // Dark blue/grey base [r, g, b] 0-1 scale
            markerColor: [1, 0.5, 0.2], // Orange marker color [1, 0.5, 0.2] approx #FFA500 -> [1, 0.64, 0]
            glowColor: [0.1, 0.1, 0.15], // Subtle dark glow
            scale: 1.0,
            markers: markers,
            opacity: 0.95,
            onRender: (state) => {
                // Called on every animation frame. Rotate globe here.
                state.phi = phi; // Use the current value
                state.width = 600 * 2;
                state.height = 600 * 2;
                phi += rotationSpeed; // Increment rotation
            },
        });

        // Set canvas style size to match parent container (avoids blurriness)
        canvasRef.current.style.width = '100%';
        canvasRef.current.style.height = '100%';
        canvasRef.current.style.contain = 'layout paint size';
        canvasRef.current.style.opacity = '0'; // Start hidden
        canvasRef.current.style.transition = 'opacity 1s ease'; // Fade in

        setTimeout(() => {
          if (canvasRef.current) canvasRef.current.style.opacity = '1';
        }, 100); // Fade in after slight delay


        return () => {
            globeInstance.current?.destroy();
        };
     // Re-run effect when selectedRegion changes to update center
    }, [selectedRegion]);

     // --- Placeholder Data for Overlay ---
    const overlayData = {
        newCustomers: 54081,
        returningCustomers: 8120
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Canvas for the globe */}
            <canvas ref={canvasRef} />

            {/* Top Overlay Card */}
            <motion.div
                className="absolute top-[10%] left-1/2 -translate-x-1/2 rounded-xl border p-4 min-w-[240px] max-w-[300px]"
                style={{
                    backgroundColor: colors.globeOverlayBg,
                    borderColor: colors.globeOverlayBorder,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)', // For Safari
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <p className="text-sm font-medium text-center mb-3" style={{color: colors.textSecondary}}>{selectedRegion.toUpperCase()}</p>
                <div className="flex justify-between gap-4">
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{color: colors.textSecondary}}>New Customers</p>
                        <p className="text-xl font-semibold" style={{color: colors.textPrimary}}>{overlayData.newCustomers.toLocaleString('en-IN')}</p>
                    </div>
                     <div className="border-l h-10 self-center" style={{borderColor: colors.divider}}></div> {/* Vertical divider */}
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{color: colors.textSecondary}}>Returning</p>
                        <p className="text-xl font-semibold" style={{color: colors.textPrimary}}>{overlayData.returningCustomers.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}


// --- Gender Distribution Card ---
function GenderDistributionCard({ region }: { region: string }) {
    // Placeholder Data
    const malePercent = 70; // Image shows 70% Male
    const femalePercent = 30;

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 10; // Match image thickness

    // Calculate offsets
    const femaleOffset = circumference - (circumference * femalePercent) / 100;
    // Male fills the rest, so its effective offset starts where female ends visually
    // We draw female first (orange), then male (teal) overlapping its start

    return (
        <Card className="rounded-xl border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="text-sm font-medium" style={{color: colors.textPrimary}}>{region.toUpperCase()}</CardTitle>
                <button className="focus:outline-none p-1 rounded-full hover:bg-[#27272A]" style={{ color: colors.textMuted }}>
                    <MoreHorizontal size={16} />
                </button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-center gap-6"> {/* Center items */}
                    {/* Donut Chart */}
                    <div className="relative w-36 h-36 flex-shrink-0"> {/* Slightly smaller chart */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            {/* Background Track */}
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="none"
                              stroke={colors.genderTrack}
                              strokeWidth={strokeWidth}
                            />
                            {/* Female Segment (Orange) - Drawn first */}
                            <motion.circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke={colors.genderFemale}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference} // Start hidden
                                strokeLinecap="round" // Rounded caps
                                transform="rotate(-90 50 50)"
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: femaleOffset }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                            />
                             {/* Male Segment (Teal) - Drawn second, overlaps orange start */}
                             <motion.circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke={colors.genderMale}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                // Start drawing from the end point of the female segment
                                strokeDashoffset={0} // Will fill remaining space
                                strokeLinecap="round"
                                transform={`rotate(${-90 + (femalePercent / 100) * 360} 50 50)`} // Start rotation after female segment
                                initial={{ strokeDashoffset: circumference }} // Start hidden relative to its own rotation
                                animate={{ strokeDashoffset: circumference - (circumference * malePercent / 100) }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />

                            {/* Percentage Labels on Arc - More complex calculation */}
                            {/* Female Label */}
                             <text
                                x={50 + radius * Math.cos((-90 + (femalePercent / 2) * 3.6) * Math.PI / 180)}
                                y={50 + radius * Math.sin((-90 + (femalePercent / 2) * 3.6) * Math.PI / 180)}
                                fill={colors.textPrimary}
                                fontSize="8" fontWeight="medium" textAnchor="middle" dominantBaseline="central"
                             >
                                {femalePercent}%
                             </text>
                             {/* Male Label */}
                              <text
                                x={50 + radius * Math.cos((-90 + (femalePercent + malePercent / 2) * 3.6) * Math.PI / 180)}
                                y={50 + radius * Math.sin((-90 + (femalePercent + malePercent / 2) * 3.6) * Math.PI / 180)}
                                fill={colors.textPrimary}
                                fontSize="8" fontWeight="medium" textAnchor="middle" dominantBaseline="central"
                             >
                                {malePercent}%
                             </text>

                             {/* Center Text */}
                              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="medium" fill={colors.textSecondary}>
                                Gender
                              </text>

                        </svg>
                    </div>
                    {/* Legend */}
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                           <span className="relative flex h-2.5 w-2.5">
                             <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.genderMale }}></span>
                             <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.genderMale }}></span>
                          </span>
                           <span style={{ color: colors.textSecondary }}>Male</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="relative flex h-2.5 w-2.5">
                             <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.genderFemale }}></span>
                             <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.genderFemale }}></span>
                          </span>
                            <span style={{ color: colors.textSecondary }}>Female</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}