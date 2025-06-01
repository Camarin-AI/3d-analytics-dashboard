"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion"; // AnimatePresence removed as it's not used directly here
import Image from "next/image";
import createGlobe from "cobe";
import type { Marker } from "cobe";

// --- Color Palette (from your code) ---
const colors = {
    background: "#111113",
    cardBackground: "#1C1C1E",
    cardBorder: "rgba(255, 255, 255, 0.4)", // Softened border for main card based on new images
    textPrimary: "#F4F4F5",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",
    divider: "rgba(255, 255, 255, 0.1)",

    regionButtonBgActive: "#27272A",
    regionButtonBorder: "rgba(255, 255, 255, 0.4)", // For inactive buttons
    regionButtonTextActive: "#FFFFFF",
    regionButtonTextInactive: "#A1A1AA",

    trendUp: "#34D399",
    trendDown: "#F87171",
    // trendBgUp: "rgba(52, 211, 153, 0.1)", // Not directly used in provided styles, but good for reference
    // trendBgDown: "rgba(248, 113, 113, 0.1)", // Not directly used

    sparklineSales: "#5FA8FC",
    sparklineUnits: "#4CD8E5",

    badgeBestSellingBg: "#27272A",
    badgeBestSellingBorder: "rgba(255, 255, 255, 0.4)",
    badgeBestSellingGlow: "rgba(255, 255, 255, 0.4)",

    skuImageBg: "#111113",
    skuTagBg: "#27272A",
    skuTagBorder: "rgba(255, 255, 255, 0.4)",

    globeOverlayBg: "rgba(30, 30, 32, 0.65)",
    globeOverlayBorder: "rgba(255, 255, 255, 0.15)", // Softened overlay border
    globeOverlayBackdropBlur: "12px",

    genderMale: "#4CD8E5",
    genderFemale: "#F59E0B",
    genderTrackOuter: "rgba(76, 216, 229, 0.1)",
    genderTrackInner: "rgba(245, 158, 11, 0.1)",
    genderLabelBg: "rgba(0, 0, 0, 0.35)",
    genderLabelText: "#F4F4F5",
};

export function RegionAnalytics() {
    const [selectedRegion, setSelectedRegion] = useState("India");
    const regions = ["India", "United States", "Europe", "Australia"];
    const currentIndex = regions.indexOf(selectedRegion);

    const handlePrevious = () => {
        const newIndex = (currentIndex - 1 + regions.length) % regions.length;
        setSelectedRegion(regions[newIndex]);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % regions.length;
        setSelectedRegion(regions[newIndex]);
    };

    const displayedRegions = () => {
        const nextIndex = (currentIndex + 1) % regions.length;
        if (regions.length <= 1) return [regions[currentIndex]];
        return [regions[currentIndex], regions[nextIndex]];
    };

    return (
        <Card
            className="rounded-2xl border p-6 shadow-lg h-full flex flex-col font-sans"
            style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
            }}
        >
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                {/* 4.) Decrease font weight and increase letter spacing in the title */}
                <CardTitle className="text-2xl font-light font-sanstracking-wider" style={{ color: colors.textPrimary }}>
                    Region Analytics
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 p-0 rounded-full hover:bg-[#27272A]" // Increased size
                        style={{ color: colors.textSecondary }}
                        onClick={handlePrevious} disabled={regions.length <= 1} >
                        <ChevronLeft size={20} />
                    </Button>
                    <div className="flex gap-2">
                        {displayedRegions().map((region) => (
                             <Button key={region} variant="outline"
                                // 2.) Increase the size of the region tags & 6.) White Border around the containers of region tags
                                className={`h-8 px-5 rounded-md border text-sm font-normal transition-colors duration-200 ${ // Adjusted size, weight, rounded-md
                                    region === selectedRegion
                                        ? 'border-transparent shadow-sm'
                                        : 'hover:bg-[#27272A] hover:border-transparent' // Keep hover style
                                }`}
                                style={{
                                     backgroundColor: region === selectedRegion ? colors.regionButtonBgActive : 'transparent',
                                     // Ensure border is applied for inactive state
                                     borderColor: region === selectedRegion ? 'transparent' : colors.regionButtonBorder,
                                     color: region === selectedRegion ? colors.regionButtonTextActive : colors.regionButtonTextInactive,
                                }}
                                onClick={() => setSelectedRegion(region)} >
                                {region}
                            </Button>
                        ))}
                    </div>
                    <Button
                         variant="ghost" size="icon"
                         className="h-8 w-8 p-0 rounded-full hover:bg-[#27272A]" // Increased size
                         style={{ color: colors.textSecondary }}
                         onClick={handleNext} disabled={regions.length <= 1} >
                         <ChevronRight size={20} />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                <div className="space-y-4 lg:space-y-5">
                    <TotalSalesCard />
                    <TotalUnitSoldCard />
                    <SalesMetricsCard />
                    <TopSkusCard />
                </div>

                <div className="lg:col-span-2 flex flex-col min-h-[650px] lg:min-h-0 relative">
                     <div className="absolute inset-0">
                        <GlobeVisualization selectedRegion={selectedRegion} />
                    </div>
                    <div className="relative z-10 flex flex-col flex-grow justify-between pointer-events-none">
                         <div className="flex justify-center pt-[8%] pointer-events-auto">
                             <CustomerCountOverlay region={selectedRegion} />
                         </div>
                          <div className="flex justify-center pb-[5%] pointer-events-auto">
                            <GenderDistributionCard region={selectedRegion} />
                         </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- Sub Components ---

function TotalSalesCard() {
    const sales = 40000; const trend = 2; const isTrendUp = trend > 0;
    return (
        <Card className="rounded-lg border overflow-hidden" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <p className="text-sm font-light tracking-wider " style={{ color: colors.textSecondary }}>Total Sales</p>
                        <p className="text-xl font-semibold mt-1" style={{ color: colors.textPrimary }}>
                            INR {sales.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${isTrendUp ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                         style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }}>
                        <Image src={isTrendUp ? "/upArrow.png" : "/downArrow.png"} alt={isTrendUp ? "Up" : "Down"} width={10} height={10} className="mr-0.5" />
                        {Math.abs(trend)}%
                        <span className="ml-0.5 font-normal text-[10px] opacity-80" style={{ color: colors.textMuted }}>last week</span>
                    </div>
                </div>
                <div className="h-8 w-full -ml-1 -mr-1">
                     <svg width="100%" height="100%" viewBox="0 0 100 25" preserveAspectRatio="none">
                        <motion.path
                            d="M0,20 C10,8 20,22 30,15 C40,25 50,10 60,20 C70,8 80,18 90,10 C100,20"
                            fill="none" stroke={colors.sparklineSales} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                    </svg>
                </div>
            </CardContent>
        </Card>
    );
}

function TotalUnitSoldCard() {
    const units = 2000; const trend = 2; const isTrendUp = trend > 0;
    return (
         <Card className="rounded-lg border overflow-hidden" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <p className="text-sm font-light tracking-wider " style={{ color: colors.textSecondary }}>Total Unit Sold</p>
                        <p className="text-xl font-semibold mt-1" style={{ color: colors.textPrimary }}>
                            {units.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${isTrendUp ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                         style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }}>
                        <Image src={isTrendUp ? "/upArrow.png" : "/downArrow.png"} alt={isTrendUp ? "Up" : "Down"} width={10} height={10} className="mr-0.5" />
                        {Math.abs(trend)}%
                        <span className="ml-0.5 font-normal text-[10px] opacity-80" style={{ color: colors.textMuted }}>last week</span>
                    </div>
                </div>
                <div className="h-8 w-full -ml-1 -mr-1">
                     <svg width="100%" height="100%" viewBox="0 0 100 25" preserveAspectRatio="none">
                        <motion.path
                            d="M0,22 C10,12 20,25 30,18 C40,10 50,20 60,12 C70,28 80,15 90,22 C100,10"
                            fill="none" stroke={colors.sparklineUnits} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }} />
                    </svg>
                </div>
            </CardContent>
        </Card>
    );
}

function SalesMetricsCard() {
    const metrics = [
        { name: "Avg. Order Value", value: "INR 1000", trend: 6 },
        { name: "Avg. Return Rate", value: "6.5%", trend: 6 },
        { name: "Avg. Conversion Rate", value: "5.5%", trend: -6 },
    ];
    return (
         <Card className="rounded-lg border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-3">
                 <div className="flex justify-between items-center mb-2.5 relative">
                    {/* 5.) Fix the font weight and the letter spacing in the titles of the smaller cards */}
                    <p className="text-xl font-light tracking-wider " style={{color: colors.textSecondary}}>Sales</p>
                    <div className="relative">
                        <span className="absolute -inset-1 rounded-full opacity-40" style={{ background: `radial-gradient(${colors.badgeBestSellingGlow}, transparent 70%)`, filter: "blur(6px)", zIndex: 0 }} />
                        <span className="relative z-10 text-[10px] px-2.5 py-0.5 rounded-full border" style={{ backgroundColor: colors.badgeBestSellingBg, borderColor: colors.badgeBestSellingBorder, color: "#EBB866" }} >
                          Best Selling Region
                        </span>
                    </div>
                 </div>
                 <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 0.4rem' }}>
                     <tbody>
                         {metrics.map(metric => {
                             const isTrendUp = metric.trend > 0;
                             return (
                                 <tr key={metric.name}>
                                     <td className="py-0.5 font-normal" style={{color: colors.textSecondary}}>{metric.name}</td>
                                     <td className="py-0.5 text-right font-medium" style={{color: colors.textPrimary}}>{metric.value}</td>
                                     <td className="py-0.5 text-right pl-2 w-[95px]">
                                          <div className={`inline-flex items-center justify-end gap-1 text-[11px] font-medium whitespace-nowrap`} style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }} >
                                            <Image src={isTrendUp ? "/upArrow.png" : "/downArrow.png"} alt={isTrendUp ? "Up" : "Down"} width={10} height={10} className="mr-0.5" />
                                            {isTrendUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {Math.abs(metric.trend)}%
                                            <span className="ml-0.5 font-normal text-[10px]" style={{ color: colors.textMuted }}>last week</span>
                                        </div>
                                     </td>
                                 </tr> );
                         })}
                     </tbody>
                 </table>
            </CardContent>
         </Card>
    );
}

const topSkusColors = {
    cardBackground: "#1E1E20", // Dark charcoal grey background of the card
    cardBorder: "rgba(255, 255, 255, 0.4)", // Subtle border for the card
    titleText: "#EAEAEA",         // Light grey / Off-white for "Top SKUs in the Region"
    dividerLine: "rgba(255, 255, 255, 0.15)", // Line below the title
    
    skuImageBg: "#111113",          // Very dark background for the image container
    skuNameText: "#E0E0E0",         // Light grey for "Diamond Cut Earrings"
    skuIdLabelText: "#8A8A8A",      // Muted grey for "SKU ID:"
    skuIdValueText: "#D0D0D0",      // Brighter grey for the actual ID "ID140001"
    
    tagBackground: "#2A2A2C",       // Dark grey for the tag "Most Interacted With"
    tagBorder: "rgba(255, 255, 255, 0.4)", // Border for the tag
    tagText: "#A0A0A0",             // Grey text for the tag

    metricsLabelText: "#909090",    // Grey for "Daily Average", "Conversion Rate" labels
    metricsValueText: "#E0E0E0",    // Light grey for "INR 1,650", "71 %"
    trendUpColor: "#34D399",        // Green for the trend percentage
    trendDownColor: "#F87171",      // Red for down trend (not shown, but standard)
    lastWeekText: "#707070",        // Darker, muted grey for "last week"
};

function TopSkusCard() {
    const skus = [
        { id: "ID140001", name: "Diamond Cut Earrings", image: "/diamond-earrings.png", dailyAvg: 1650, trend: 6, conversionRate: 71, tag: "Most Interacted With" },
        { id: "ID140001", name: "Diamond Cut Earrings", image: "/diamond-earrings.png", dailyAvg: 1650, trend: 6, conversionRate: 71, tag: "Most Purchased" },
    ];
    return (
        <Card 
            className="rounded-xl border" // Image shows slightly rounded corners for the main card
            style={{ 
                backgroundColor: topSkusColors.cardBackground, 
                borderColor: topSkusColors.cardBorder 
            }}
        >
            <CardContent className="p-5"> {/* Adjusted padding to match image */}
                <p 
                    className="text-xl font-light pb-3 mb-4 border-b" // Large, light title with bottom border
                    style={{
                        color: topSkusColors.titleText, 
                        borderColor: topSkusColors.dividerLine,
                        letterSpacing: '0.025em' // Slight letter spacing for title
                    }}
                >
                    Top SKUs in the Region
                </p>
                <div className="space-y-5"> {/* Space between SKU items */}
                    {skus.map((sku, index) => {
                         const isTrendUp = sku.trend > 0;
                         return (
                            <div key={index} className="flex gap-4 items-start"> {/* Main flex container for an SKU item */}
                                {/* Image Container */}
                                <div 
                                    className="w-[88px] h-[88px] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" // Exact size and rounded corners for image
                                    style={{ backgroundColor: topSkusColors.skuImageBg }}
                                >
                                    <Image src={sku.image} alt={sku.name} width={80} height={80} className="object-contain" />
                                </div>

                                {/* SKU Info and Metrics Container */}
                                <div className="flex-1 flex min-w-0">
                                    {/* Left part: SKU Name, ID, Tag */}
                                    <div className="flex-1 pt-1">
                                        <p 
                                            className="text-sm font-light" 
                                            style={{color: topSkusColors.skuNameText}}
                                        >
                                            {sku.name}
                                        </p>
                                        <p 
                                            className="text-sm mt-1"  // SKU ID line, slightly larger than tag
                                            style={{ color: topSkusColors.skuIdLabelText }}
                                        >
                                            SKU ID: <span style={{color: topSkusColors.skuIdValueText, fontWeight: 500}}>{sku.id}</span>
                                        </p>
                                        {sku.tag && (
                                            <div className="mt-2.5">
                                                <span 
                                                    className="text-xs px-4 py-1.5 border rounded-full" // Pill shape tag with padding
                                                    style={{ 
                                                        backgroundColor: topSkusColors.tagBackground, 
                                                        borderColor: topSkusColors.tagBorder, 
                                                        color: topSkusColors.tagText 
                                                    }} 
                                                >
                                                    {sku.tag}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right part: Metrics */}
                                    <div className="w-[160px] flex-shrink-0 text-right space-y-2.5 ml-3 pt-1">
                                        {/* Daily Average Metric Block */}
                                        <div>
                                            <p 
                                                className="text-[11px] font-normal" // Smaller label
                                                style={{color: topSkusColors.metricsLabelText}}
                                            >
                                                Daily Average
                                            </p>
                                            <div className="flex items-baseline justify-end mt-0.5">
                                                <p 
                                                    className="text-lg font-semibold mr-1.5" // Larger value
                                                    style={{color: topSkusColors.metricsValueText}}
                                                >
                                                    INR {sku.dailyAvg.toLocaleString('en-IN')}
                                                </p>
                                                <div 
                                                    className={`flex items-center text-sm font-medium`} 
                                                    style={{ color: isTrendUp ? topSkusColors.trendUpColor : topSkusColors.trendDownColor }}
                                                >
                                                    <Image 
                                                        src={isTrendUp ? "/upArrow.png" : "/downArrow.png"} 
                                                        alt={isTrendUp ? "Up" : "Down"} 
                                                        width={10}  // Adjusted size for arrow image
                                                        height={10}
                                                        className="mr-0.5"
                                                    /> 
                                                    {Math.abs(sku.trend)}%
                                                </div>
                                            </div>
                                            <p 
                                                className="text-[10px] font-normal -mt-0.5" // Smaller "last week"
                                                style={{color: topSkusColors.lastWeekText}}
                                            >
                                                last week
                                            </p>
                                        </div>
                                        
                                        {/* Conversion Rate Metric Block */}
                                        <div>
                                            <p 
                                                className="text-[11px] font-normal" 
                                                style={{color: topSkusColors.metricsLabelText}}
                                            >
                                                Conversion Rate
                                            </p>
                                            <p 
                                                className="text-lg font-semibold mt-0.5" 
                                                style={{color: topSkusColors.metricsValueText}}
                                            >
                                                {sku.conversionRate} %
                                            </p>
                                        </div>
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


// --- Globe Component & Overlays ---

interface GlobeVisualizationProps { selectedRegion: string; }

function GlobeVisualization({ selectedRegion }: GlobeVisualizationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const globeInstance = useRef<ReturnType<typeof createGlobe> | null>(null);
    const rotationSpeed = 0.002; // Slightly slower

    const markers = React.useMemo<Marker[]>(() => [ // Example, replace with actual data
        { location: [20.5937, 78.9629], size: 0.08 }, { location: [22.5937, 80.9629], size: 0.04 },
        { location: [18.5937, 76.9629], size: 0.06 }, { location: [38.9637, 35.2433], size: 0.05 },
        { location: [34.0479, 100.6197], size: 0.06 }, { location: [40.7128, -74.0060], size: 0.07 },
        { location: [34.0522, -118.2437], size: 0.05 }, { location: [51.5074, -0.1278], size: 0.06 },
        { location: [-33.8688, 151.2093], size: 0.05 },
        // Add more markers for better visualization
        ...Array.from({ length: 20 }, () => ({
            location: [Math.random() * 180 - 90, Math.random() * 360 - 180] as [number, number],
            size: Math.random() * 0.03 + 0.02 // Smaller random markers
        }))
    ], []);

    useEffect(() => {
        if (!canvasRef.current) return;
        let phi = 3.8; let theta = 0.5;

        if (selectedRegion === "United States") { phi = 4.5; theta = -1.6; }
        else if (selectedRegion === "Europe") { phi = 4.8; theta = 0.1; }
        else if (selectedRegion === "India") { phi = 4.2; theta = 1.0; }
        else if (selectedRegion === "Australia") { phi = 2.2; theta = 2.4; }

        const globeWidth = canvasRef.current.offsetWidth;
        const globeHeight = canvasRef.current.offsetHeight;

        globeInstance.current = createGlobe(canvasRef.current, {
            devicePixelRatio: 2, width: globeWidth * 2, height: globeHeight * 2,
            phi: phi, theta: theta, dark: 1, diffuse: 1.0, // Adjusted diffuse
            mapSamples: 25000, mapBrightness: 9, mapBaseBrightness: 0.08, // Adjusted brightness
            baseColor: [0.09, 0.09, 0.11], // Darker base
            markerColor: [1.0, 0.45, 0.15], // Slightly adjusted orange marker
            glowColor: [0.08, 0.08, 0.10], markers: markers, scale: 1.0, opacity: 1.0,
            onRender: (state) => {
                state.phi = phi;
                if (canvasRef.current) { // Responsive canvas sizing
                    const currentWidth = canvasRef.current.offsetWidth;
                    const currentHeight = canvasRef.current.offsetHeight;
                    if (state.width !== currentWidth * 2 || state.height !== currentHeight * 2) {
                        state.width = currentWidth * 2;
                        state.height = currentHeight * 2;
                    }
                }
                phi += rotationSpeed;
            },
        });
        canvasRef.current.style.width = '100%'; canvasRef.current.style.height = '100%';
        canvasRef.current.style.contain = 'layout paint size'; canvasRef.current.style.opacity = '0';
        canvasRef.current.style.transition = 'opacity 1s ease';
        setTimeout(() => { if (canvasRef.current) canvasRef.current.style.opacity = '1'; }, 100);
        return () => globeInstance.current?.destroy();
    }, [selectedRegion, markers]);

    return <canvas ref={canvasRef} />;
}

function CustomerCountOverlay({ region }: { region: string }) {
    // 1.) Tooltip not functional in the Customer value chart for every bar.
    // Note: This component is an overlay, not a bar chart with tooltips.
    // If tooltips are needed for specific data points (e.g., on the globe or a future bar chart),
    // that would require a different implementation (e.g., using a charting library or custom hover logic).
    const overlayData = { newCustomers: 54081, returningCustomers: 8120 };
    return (
         <motion.div
            className="rounded-xl border p-4 shadow-xl w-[280px]" // Slightly wider
            style={{
                backgroundColor: colors.globeOverlayBg,
                borderColor: colors.globeOverlayBorder,
                backdropFilter: `blur(${colors.globeOverlayBackdropBlur})`, // Ensure blur is applied
                WebkitBackdropFilter: `blur(${colors.globeOverlayBackdropBlur})`,
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <p className="text-sm font-medium text-center mb-2.5 tracking-wider uppercase" style={{color: colors.textSecondary}}>
                {region}
            </p>
            <hr className="border-t mb-3.5" style={{ borderColor: colors.divider }} />
            <div className="flex justify-around items-start gap-4 px-1">
                <div className="text-center">
                    <p className="text-xs mb-0.5 tracking-wide" style={{color: colors.textSecondary}}>New Customers</p>
                    <p className="text-2xl font-semibold leading-tight" style={{color: colors.textPrimary}}>
                        {overlayData.newCustomers.toLocaleString('en-IN')}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs mb-0.5 tracking-wide" style={{color: colors.textSecondary}}>Returning</p>
                    <p className="text-2xl font-semibold leading-tight" style={{color: colors.textPrimary}}>
                        {overlayData.returningCustomers.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

const malePercent = 70; const femalePercent = 30;
const outerRadius = 42; const innerRadius = 30;
const outerStrokeWidth = 8; const innerStrokeWidth = 6;
const outerCircumference = 2 * Math.PI * outerRadius;
const innerCircumference = 2 * Math.PI * innerRadius;
const maleOffset = outerCircumference - (outerCircumference * malePercent) / 100;
const femaleOffset = innerCircumference - (innerCircumference * femalePercent) / 100;

function GenderDistributionCard({ region }: { region: string }) {
    const calculateLabelPos = (percent: number, radius: number, startAngleDeg: number = -90) => {
        const midAngleDeg = startAngleDeg + (percent / 2) * 3.6;
        const midAngleRad = midAngleDeg * Math.PI / 180;
        return { x: 50 + radius * Math.cos(midAngleRad), y: 50 + radius * Math.sin(midAngleRad) };
    };
    const maleLabelPos = calculateLabelPos(malePercent, outerRadius);
    const femaleStartAngleVisual = -90 + (malePercent / 100) * 360;
    const femaleLabelPos = calculateLabelPos(femalePercent, innerRadius, femaleStartAngleVisual);

    return (
    <motion.div
        className="rounded-xl border p-4 shadow-xl w-[280px]" // Consistent size
         style={{
            backgroundColor: colors.globeOverlayBg,
            borderColor: colors.globeOverlayBorder,
            backdropFilter: `blur(${colors.globeOverlayBackdropBlur})`,
            WebkitBackdropFilter: `blur(${colors.globeOverlayBackdropBlur})`,
        }}
        initial={{ opacity: 0, y: 20 }} // Changed y for variety
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
    >
        <div className="flex flex-row items-center justify-between mb-2.5">
            <h3 className="text-sm font-medium tracking-wider uppercase" style={{color: colors.textSecondary}}>{region}</h3>
             <button className="focus:outline-none p-0.5 rounded-full hover:bg-[#3f3f46]" style={{ color: colors.textMuted }}>
                <MoreHorizontal size={18} />
            </button>
        </div>
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-2.5">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={outerRadius} fill="none" stroke={colors.genderTrackOuter} strokeWidth={outerStrokeWidth} />
                    <circle cx="50" cy="50" r={innerRadius} fill="none" stroke={colors.genderTrackInner} strokeWidth={innerStrokeWidth} />
                    <motion.circle cx="50" cy="50" r={outerRadius} fill="none" stroke={colors.genderMale} strokeWidth={outerStrokeWidth} strokeDasharray={outerCircumference} strokeLinecap="round" transform="rotate(-90 50 50)"
                        initial={{ strokeDashoffset: outerCircumference }} animate={{ strokeDashoffset: maleOffset }} transition={{ duration: 1.2, ease: "circOut" }} />
                    <motion.circle cx="50" cy="50" r={innerRadius} fill="none" stroke={colors.genderFemale} strokeWidth={innerStrokeWidth} strokeDasharray={innerCircumference} strokeLinecap="round" transform={`rotate(${-90 + (malePercent / 100) * 360} 50 50)`}
                        initial={{ strokeDashoffset: innerCircumference }} animate={{ strokeDashoffset: femaleOffset }} transition={{ duration: 1.2, ease: "circOut", delay: 0.1 }} />
                     <g>
                        <motion.circle cx={maleLabelPos.x} cy={maleLabelPos.y} r="8" fill={colors.genderLabelBg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}/>
                         <motion.text x={maleLabelPos.x} y={maleLabelPos.y} dy="0.35em" fill={colors.genderLabelText} fontSize="7.5" fontWeight="medium" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} >
                            {malePercent}%
                         </motion.text>
                     </g>
                     <g>
                         <motion.circle cx={femaleLabelPos.x} cy={femaleLabelPos.y} r="8" fill={colors.genderLabelBg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}/>
                         <motion.text x={femaleLabelPos.x} y={femaleLabelPos.y} dy="0.35em" fill={colors.genderLabelText} fontSize="7.5" fontWeight="medium" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} >
                            {femalePercent}%
                         </motion.text>
                     </g>
                     <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="medium" fill={colors.textPrimary}>Gender</text>
                </svg>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-1.5">
                <div className="flex items-center gap-1.5">
                   <span className="h-2.5 w-2.5 rounded-full border" style={{ backgroundColor: colors.genderMale, borderColor: colors.genderMale }}></span>
                   <span style={{ color: colors.textSecondary }}>Male</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <span className="h-2.5 w-2.5 rounded-full border" style={{ backgroundColor: colors.genderFemale, borderColor: colors.genderFemale }}></span>
                   <span style={{ color: colors.textSecondary }}>Female</span>
                </div>
            </div>
        </div>
    </motion.div>
);
}