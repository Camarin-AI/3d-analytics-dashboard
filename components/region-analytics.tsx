"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import createGlobe from "cobe";
import type { Marker } from "cobe";


// --- Color Palette (Refined based on deeper analysis) ---
const colors = {
    background: "#111113", // Main background
    cardBackground: "#1C1C1E", // Slightly lighter card bg
    cardBorder: "rgba(255, 255, 255, 0.4)", // Shared faint border
    textPrimary: "#F4F4F5", // Brightest text (values, main SKU name)
    textSecondary: "#A1A1AA", // Subtitles, labels, region button inactive
    textMuted: "#71717A", // Dimmer text ('last week', table headers, SKU ID)
    divider: "rgba(255, 255, 255, 0.1)", // Dividers

    regionButtonBgActive: "#27272A", // Darker grey active button
    regionButtonBorder: "rgba(255, 255, 255, 0.2)", // Visible border for inactive
    regionButtonTextActive: "#FFFFFF", // White text for active button
    regionButtonTextInactive: "#A1A1AA", // Text color for inactive button

    trendUp: "#34D399", // Green
    trendDown: "#F87171", // Red
    trendBgUp: "rgba(52, 211, 153, 0.1)",
    trendBgDown: "rgba(248, 113, 113, 0.1)",

    sparklineSales: "#5FA8FC", // Blue
    sparklineUnits: "#4CD8E5", // Teal

    badgeBestSellingBg: "#27272A",
    badgeBestSellingBorder: "rgba(255, 255, 255, 0.2)",
    badgeBestSellingGlow: "rgba(255, 255, 255, 0.4)", // Slightly more visible glow

    skuImageBg: "#111113", // Match main background for image circle
    skuTagBg: "#27272A",
    skuTagBorder: "rgba(255, 255, 255, 0.15)",

    // Glassmorphism Overlays
    globeOverlayBg: "rgba(30, 30, 32, 0.65)", // Darker, less transparent overlay bg
    globeOverlayBorder: "rgba(255, 255, 255, 0.12)", // Fainter overlay border
    globeOverlayBackdropBlur: "12px", // Blur amount

    // Gender Chart Specific (Refined)
    genderMale: "#4CD8E5", // Teal (Outer, thicker)
    genderFemale: "#F59E0B", // Orange (Inner, thinner)
    genderTrackOuter: "rgba(76, 216, 229, 0.1)", // Faint Teal track
    genderTrackInner: "rgba(245, 158, 11, 0.1)", // Faint Orange track
    // Alt: Single faint track: genderTrack: "rgba(255, 255, 255, 0.06)",
    genderLabelBg: "rgba(0, 0, 0, 0.35)",
    genderLabelText: "#F4F4F5",
};

// --- Component ---
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

    // Show current and next region button
    const displayedRegions = () => {
        const nextIndex = (currentIndex + 1) % regions.length;
        if (regions.length <= 1) return [regions[currentIndex]];
        return [regions[currentIndex], regions[nextIndex]];
    };

    return (
        <Card
            // Using Inter font stack if available, otherwise default sans
            className="rounded-2xl border p-6 shadow-lg h-full flex flex-col font-sans"
            style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
            }}
        >
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <CardTitle className="text-xl font-light font-sans text-white tracking-wide" style={{ color: colors.textPrimary }}>
                    Region Analytics
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button // Chevron Left
                        variant="ghost" size="icon"
                        className="h-7 w-7 p-0 rounded-full hover:bg-[#27272A]"
                        style={{ color: colors.textSecondary }}
                        onClick={handlePrevious} disabled={regions.length <= 1} >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="flex gap-2">
                        {displayedRegions().map((region) => (
                             <Button key={region} variant="outline" size="sm"
                                className={`h-7 px-4 rounded-full border text-xs font-medium transition-colors duration-200 ${ // Medium weight for buttons
                                    region === selectedRegion
                                        ? 'border-transparent shadow-sm' // Add subtle shadow if active
                                        : 'hover:bg-[#27272A] hover:border-transparent'
                                }`}
                                style={{
                                     backgroundColor: region === selectedRegion ? colors.regionButtonBgActive : 'transparent',
                                     borderColor: region === selectedRegion ? 'transparent' : colors.regionButtonBorder,
                                     color: region === selectedRegion ? colors.regionButtonTextActive : colors.regionButtonTextInactive,
                                }}
                                onClick={() => setSelectedRegion(region)} >
                                {region}
                            </Button>
                        ))}
                    </div>
                    <Button // Chevron Right
                         variant="ghost" size="icon"
                         className="h-7 w-7 p-0 rounded-full hover:bg-[#27272A]"
                         style={{ color: colors.textSecondary }}
                         onClick={handleNext} disabled={regions.length <= 1} >
                         <ChevronRight size={18} />
                    </Button>
                </div>
            </CardHeader>

            {/* Content Grid */}
            <CardContent className="p-0 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5"> {/* Slightly reduced gap */}
                {/* Left Column */}
                <div className="space-y-4 lg:space-y-5">
                    <TotalSalesCard />
                    <TotalUnitSoldCard />
                    <SalesMetricsCard />
                    <TopSkusCard />
                </div>

                {/* Right Area */}
                <div className="lg:col-span-2 flex flex-col min-h-[650px] lg:min-h-0 relative"> {/* Ensure height, make relative for overlays */}
                    {/* Globe Container */}
                     <div className="absolute inset-0">
                        <GlobeVisualization selectedRegion={selectedRegion} />
                    </div>
                    {/* Overlays Container */}
                    <div className="relative z-10 flex flex-col flex-grow justify-between pointer-events-none"> {/* Pointer events none allows globe interaction */}
                         {/* Top Overlay - Customer Counts */}
                         <div className="flex justify-center pt-[8%] pointer-events-auto"> {/* Allow interaction with this overlay */}
                             <CustomerCountOverlay region={selectedRegion} />
                         </div>
                         {/* Bottom Overlay - Gender Chart */}
                          <div className="flex justify-center pb-[5%] pointer-events-auto"> {/* Allow interaction with this overlay */}
                            <GenderDistributionCard region={selectedRegion} />
                         </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


// --- Sub Components (Refined Styling) ---

function TotalSalesCard() {
    const sales = 40000; const trend = 2; const isTrendUp = trend > 0;
    return (
        <Card className="rounded-lg border overflow-hidden" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-3"> {/* Reduced padding */}
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>Total Sales</p>
                        <p className="text-base font-semibold" style={{ color: colors.textPrimary }}> {/* Slightly smaller value font */}
                            INR {sales.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${isTrendUp ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                         style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }}>
                        {isTrendUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {Math.abs(trend)}%
                        <span className="ml-0.5 font-normal text-[9px] opacity-80" style={{ color: colors.textMuted }}>last week</span>
                    </div>
                </div>
                <div className="h-6 w-full -ml-1 -mr-1"> {/* Smaller height, slight negative margin */}
                     <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <motion.path
                            d="M0,15 C10,5 20,18 30,12 C40,20 50,8 60,15 C70,5 80,13 90,8 C100,16"
                            fill="none" stroke={colors.sparklineSales} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
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
                        <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>Total Unit Sold</p>
                        <p className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                            {units.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${isTrendUp ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                         style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }}>
                        {isTrendUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {Math.abs(trend)}%
                        <span className="ml-0.5 font-normal text-[9px] opacity-80" style={{ color: colors.textMuted }}>last week</span>
                    </div>
                </div>
                <div className="h-6 w-full -ml-1 -mr-1">
                     <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <motion.path
                            d="M0,18 C10,10 20,20 30,14 C40,8 50,17 60,10 C70,22 80,12 90,18 C100,8"
                            fill="none" stroke={colors.sparklineUnits} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
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
                 <div className="flex justify-between items-center mb-2 relative">
                    <p className="text-sm font-medium" style={{color: colors.textPrimary}}>Sales</p>
                    <div className="relative">
                        <span className="absolute -inset-1 rounded-full opacity-40" style={{ background: `radial-gradient(${colors.badgeBestSellingGlow}, transparent 70%)`, filter: "blur(6px)", zIndex: 0 }} />
                        <span className="relative z-10 text-[10px] px-2.5 py-0.5 rounded-full border" style={{ backgroundColor: colors.badgeBestSellingBg, borderColor: colors.badgeBestSellingBorder, color: colors.textSecondary }} >
                          Best Selling Region
                        </span>
                    </div>
                 </div>
                 <table className="w-full text-xs border-separate" style={{ borderSpacing: '0 0.4rem' }}> {/* Vertical spacing via borderSpacing */}
                     <tbody>
                         {metrics.map(metric => {
                             const isTrendUp = metric.trend > 0;
                             return (
                                 <tr key={metric.name}>
                                     <td className="py-0 font-normal" style={{color: colors.textSecondary}}>{metric.name}</td>
                                     <td className="py-0 text-right font-medium" style={{color: colors.textPrimary}}>{metric.value}</td>
                                     <td className="py-0 text-right pl-2 w-[90px]"> {/* Fixed width for trend */}
                                          <div className={`inline-flex items-center justify-end gap-1 text-[10px] font-medium whitespace-nowrap`} style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }} >
                                            {isTrendUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {Math.abs(metric.trend)}%
                                            <span className="ml-0.5 font-normal" style={{ color: colors.textMuted }}>last week</span>
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

function TopSkusCard() {
    const skus = [
        { id: "ID140001", name: "Diamond Cut Earrings", image: "/diamond-earrings.png", dailyAvg: 1650, trend: 6, interaction: 71, tag: "Most Interacted With" },
        { id: "ID140001", name: "Diamond Cut Earrings", image: "/diamond-earrings.png", dailyAvg: 1650, trend: 6, interaction: 71, tag: "Most Purchased" },
    ];
    return (
        <Card className="rounded-lg border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <CardContent className="p-3">
                <p className="text-sm font-medium mb-3" style={{color: colors.textPrimary}}>Top SKUs in the Region</p>
                <div className="space-y-3">
                    {skus.map((sku, index) => {
                         const isTrendUp = sku.trend > 0;
                         return (
                            <div key={index} className="flex items-center gap-2.5"> {/* Slightly less gap */}
                                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.skuImageBg }}>
                                    <Image src={sku.image} alt={sku.name} width={28} height={28} className="object-contain" /> {/* Smaller image */}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline gap-2">
                                         <p className="text-xs font-medium truncate" style={{color: colors.textPrimary}} title={sku.name}>{sku.name}</p>
                                         <div className="flex items-baseline gap-1 flex-shrink-0">
                                            <span className="text-[11px] font-medium" style={{color: colors.textPrimary}}>INR {sku.dailyAvg.toLocaleString('en-IN')}</span>
                                            <span className="text-[9px]" style={{color: colors.textMuted}}>/ Daily Avg</span>
                                         </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-0.5">
                                        <p className="text-[10px]" style={{ color: colors.textMuted }}>SKU ID: {sku.id}</p>
                                         <div className={`inline-flex items-center gap-0.5 text-[10px] font-medium`} style={{ color: isTrendUp ? colors.trendUp : colors.trendDown }}>
                                            {isTrendUp ? <ArrowUp size={9} /> : <ArrowDown size={9} />} {Math.abs(sku.trend)}%
                                            <span className="ml-0.5 font-normal text-[9px]" style={{ color: colors.textMuted }}>last week</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-0.5">
                                        <span className="text-[9px] px-1.5 py-0 border rounded-full" style={{ backgroundColor: colors.skuTagBg, borderColor: colors.skuTagBorder, color: colors.textSecondary }} >{sku.tag}</span>
                                        <span className="text-xs font-medium" style={{color: colors.textPrimary}}>{sku.interaction}%</span>
                                    </div>
                                </div>
                            </div> );
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
    const rotationSpeed = 0.0025; // Keep it slow

    // Example markers - make them denser and smaller
    const markers = React.useMemo<Marker[]>(() => [
        { location: [20.5937, 78.9629] as [number, number], size: 0.08 }, // India
        { location: [22.5937, 80.9629] as [number, number], size: 0.04 },
        { location: [18.5937, 76.9629] as [number, number], size: 0.06 },
        { location: [38.9637, 35.2433] as [number, number], size: 0.05 }, // Turkey
        { location: [34.0479, 100.6197] as [number, number], size: 0.06 }, // China
        { location: [40.7128, -74.0060] as [number, number], size: 0.07 }, // NYC
        { location: [34.0522, -118.2437] as [number, number], size: 0.05 }, // LA
        { location: [51.5074, -0.1278] as [number, number], size: 0.06 }, // London
        { location: [-33.8688, 151.2093] as [number, number], size: 0.05 }, // Sydney
    ], []);

    useEffect(() => {
        if (!canvasRef.current) return;
        let phi = 3.8; let theta = 0.5; // Default view

        // Center on region (adjust these coords)
        if (selectedRegion === "United States") { phi = 4.5; theta = -1.6; }
        else if (selectedRegion === "Europe") { phi = 4.8; theta = 0.1; }
        else if (selectedRegion === "India") { phi = 4.2; theta = 1.0; }
        else if (selectedRegion === "Australia") { phi = 2.2; theta = 2.4; }

        const globeWidth = canvasRef.current.offsetWidth;
        const globeHeight = canvasRef.current.offsetHeight;

        globeInstance.current = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: globeWidth * 2,
            height: globeHeight * 2,
            phi: phi, theta: theta,
            dark: 1,
            diffuse: 1.1, // Slightly less diffuse
            mapSamples: 22000, // Increased dot density
            mapBrightness: 8, // Brighter dots
            mapBaseBrightness: 0.1, // Dimmer base
            baseColor: [0.12, 0.12, 0.15], // Darker base
            markerColor: [1.0, 0.4, 0.1], // Orange marker [R,G,B] 0-1
            glowColor: [0.1, 0.1, 0.12], // Very subtle glow
            markers: markers,
            scale: 1.0, // Keep scale normal
            opacity: 1.0, // Fully opaque texture
            onRender: (state) => {
                state.phi = phi;
                if (canvasRef.current) {
                    state.width = canvasRef.current.offsetWidth * 2;
                    state.height = canvasRef.current.offsetHeight * 2;
                }
                phi += rotationSpeed;
            },
        });

        // Style canvas for layout
        canvasRef.current.style.width = '100%';
        canvasRef.current.style.height = '100%';
        canvasRef.current.style.contain = 'layout paint size';
        canvasRef.current.style.opacity = '0';
        canvasRef.current.style.transition = 'opacity 1s ease';
        setTimeout(() => { if (canvasRef.current) canvasRef.current.style.opacity = '1'; }, 100);

        return () => globeInstance.current?.destroy();
    }, [selectedRegion, markers]); // Rerun if region or markers change

    return <canvas ref={canvasRef} />; // Canvas fills the container
}

// Overlay Component - Customer Counts
function CustomerCountOverlay({ region }: { region: string }) {
    const overlayData = { newCustomers: 54081, returningCustomers: 8120 }; // Placeholder
    return (
         <motion.div
            // Adjusted padding, width constraints
            className="rounded-xl border p-3.5 shadow-xl w-[260px]" // Fixed width might be better for consistency
            style={{
                backgroundColor: colors.globeOverlayBg,
                borderColor: colors.globeOverlayBorder,
                backdropFilter: colors.globeOverlayBackdropBlur,
                WebkitBackdropFilter: colors.globeOverlayBackdropBlur,
            }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            {/* Region Title */}
            <p className="text-sm font-medium text-center mb-2" style={{color: colors.textSecondary}}>
                {region.toUpperCase()}
            </p>

            {/* Divider Line */}
            <hr className="border-t mb-3" style={{ borderColor: colors.divider }} />

            {/* Customer Counts */}
            <div className="flex justify-around items-start gap-4 px-1"> {/* Use justify-around */}
                {/* New Customers */}
                <div className="text-center">
                    <p className="text-[11px] mb-0.5" style={{color: colors.textSecondary}}>New Customers</p>
                    <p className="text-xl font-semibold leading-tight" style={{color: colors.textPrimary}}>
                        {overlayData.newCustomers.toLocaleString('en-IN')}
                    </p>
                </div>
                {/* Returning Customers */}
                <div className="text-center">
                    <p className="text-[11px] mb-0.5" style={{color: colors.textSecondary}}>Returning</p>
                    <p className="text-xl font-semibold leading-tight" style={{color: colors.textPrimary}}>
                        {overlayData.returningCustomers.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}


// Gender Distribution Card (Now an Overlay)
const malePercent = 70;
const femalePercent = 30;

// Define Radii & Stroke Widths based on target image visual
const outerRadius = 42; // For Male Segment (Thicker)
const innerRadius = 30; // For Female Segment (Thinner) - Adjusted inner radius significantly
const outerStrokeWidth = 8; // Thicker
const innerStrokeWidth = 6;  // Thinner

// Calculate Circumferences and Offsets for each ring
const outerCircumference = 2 * Math.PI * outerRadius;
const innerCircumference = 2 * Math.PI * innerRadius;
const maleOffset = outerCircumference - (outerCircumference * malePercent) / 100;
const femaleOffset = innerCircumference - (innerCircumference * femalePercent) / 100;


// --- Label Positioning ---
// Calculate point near the middle of the arc for each radius
function GenderDistributionCard({ region }: { region: string }) {   
const calculateLabelPos = (percent: number, radius: number) => {
    const midAngleDeg = -90 + (percent / 2) * 3.6; // Mid-angle of segment from top
    const midAngleRad = midAngleDeg * Math.PI / 180;
    const x = 50 + radius * Math.cos(midAngleRad);
    const y = 50 + radius * Math.sin(midAngleRad);
    return { x, y };
};
const maleLabelPos = calculateLabelPos(malePercent, outerRadius);
// Position female label relative to its *own* arc start (-90 + 70% * 3.6)
const femaleLabelPos = calculateLabelPos(femalePercent, innerRadius);
const femaleStartAngleDeg = -90 + (malePercent * 3.6); // where female arc should visually start
const femaleMidAngleDeg = femaleStartAngleDeg + (femalePercent/2 * 3.6);
const femaleMidAngleRad = femaleMidAngleDeg * Math.PI / 180;
femaleLabelPos.x = 50 + innerRadius * Math.cos(femaleMidAngleRad);
femaleLabelPos.y = 50 + innerRadius * Math.cos(femaleMidAngleRad);



return (
    <motion.div
        className="rounded-xl border p-3.5 shadow-xl w-[260px]" // Consistent overlay size
         style={{
            backgroundColor: colors.globeOverlayBg,
            borderColor: colors.globeOverlayBorder,
            backdropFilter: colors.globeOverlayBackdropBlur,
            WebkitBackdropFilter: colors.globeOverlayBackdropBlur,
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
    >
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-2">
            <h3 className="text-sm font-medium" style={{color: colors.textSecondary}}>{region.toUpperCase()}</h3>
             <button className="focus:outline-none p-0.5 rounded-full hover:bg-[#3f3f46]" style={{ color: colors.textMuted }}>
                <MoreHorizontal size={16} />
            </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center">
            {/* Donut Chart */}
            <div className="relative w-32 h-32 mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background Track - Outer (Thick) */}
                    <circle cx="50" cy="50" r={outerRadius} fill="none"
                            stroke={colors.genderTrackOuter} // Faint Teal
                            strokeWidth={outerStrokeWidth} />
                    {/* Background Track - Inner (Thin) */}
                     <circle cx="50" cy="50" r={innerRadius} fill="none"
                            stroke={colors.genderTrackInner} // Faint Orange
                            strokeWidth={innerStrokeWidth} />

                    {/* Male Segment (Teal, Outer/Thicker) - Represents 70% */}
                    <motion.circle
                        cx="50" cy="50" r={outerRadius} fill="none" stroke={colors.genderMale}
                        strokeWidth={outerStrokeWidth} strokeDasharray={outerCircumference}
                        strokeDashoffset={outerCircumference} strokeLinecap="round" transform="rotate(-90 50 50)"
                        initial={{ strokeDashoffset: outerCircumference }}
                        animate={{ strokeDashoffset: maleOffset }} // Offset for 70%
                        transition={{ duration: 1.2, ease: "circOut" }} />

                    {/* Female Segment (Orange, Inner/Thinner) - Represents 30% */}
                    {/* Start rotation after the male segment visually */}
                    <motion.circle
                        cx="50" cy="50" r={innerRadius} fill="none" stroke={colors.genderFemale}
                        strokeWidth={innerStrokeWidth} strokeDasharray={innerCircumference}
                        strokeDashoffset={innerCircumference} strokeLinecap="round" transform={`rotate(${-90 + (malePercent / 100) * 360} 50 50)`} // Rotate to start after Male %
                        initial={{ strokeDashoffset: innerCircumference }}
                        animate={{ strokeDashoffset: femaleOffset }} // Offset for 30%
                        transition={{ duration: 1.2, ease: "circOut", delay: 0.1 }} />


                     {/* Percentage Labels with Backgrounds */}
                     {/* Male Label (On Outer Arc) */}
                     <g>
                        <motion.circle cx={maleLabelPos.x} cy={maleLabelPos.y} r="7" fill={colors.genderLabelBg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}/>
                         <motion.text
                            x={maleLabelPos.x} y={maleLabelPos.y} dy="0.5"
                            fill={colors.genderLabelText} fontSize="7" fontWeight="medium" textAnchor="middle" dominantBaseline="middle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} >
                            {malePercent}%
                         </motion.text>
                     </g>
                     {/* Female Label (On Inner Arc) */}
                     <g>
                         <motion.circle cx={femaleLabelPos.x} cy={femaleLabelPos.y} r="7" fill={colors.genderLabelBg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}/>
                         <motion.text
                            x={femaleLabelPos.x} y={femaleLabelPos.y} dy="0.5"
                            fill={colors.genderLabelText} fontSize="7" fontWeight="medium" textAnchor="middle" dominantBaseline="middle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} >
                            {femalePercent}%
                         </motion.text>
                     </g>

                     {/* Center Text */}
                     <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="medium" fill={colors.textPrimary}>
                        Gender
                     </text>
                </svg>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-4 text-xs mt-1">
                <div className="flex items-center gap-1.5">
                   <span className="relative flex h-2.5 w-2.5">
                     <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.genderMale }}></span>
                     <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.genderMale }}></span>
                  </span> <span style={{ color: colors.textSecondary }}>Male</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <span className="relative flex h-2.5 w-2.5">
                     <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.genderFemale }}></span>
                     <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.genderFemale }}></span>
                  </span> <span style={{ color: colors.textSecondary }}>Female</span>
                </div>
            </div>
        </div>
    </motion.div>
);
}
