"use client";

import { useState } from "react";
import { MoreHorizontal, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ShimmerButton } from "@/components/magicui/shimmer-button"; // Ensure this path is correct

// --- Color Palette (Strictly from Target Image, with refinements) ---
const colors = {
  background: "#161618",
  cardBorder: "rgba(255, 255, 255, 0.4)",
  textPrimary: "#F4F4F5",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textSubtle: "#52525B",

  dateRangeButtonBg: "#27272A",
  dateRangeButtonBorder: "rgba(255, 255, 255, 0.15)",

  badgeBg: "#27272A",
  badgeBorder: "rgba(255, 255, 255, 0.2)",
  // Specific color for "Best Sales of the Month" text from image
  badgeTextSpecial: "#EBB866", // Golden/Yellowish text

  // Progress Bar
  progressBarTrack: "#1D2B3A",
  progressBarFill: "#FFFFFF",
  progressBarGlow: "rgba(255, 255, 255, 0.7)",
  progressLabelPreviousWeek: "#2DD4BF",
  // Color for the subtle segment lines within the white progress bar fill
  progressBarSegmentLine: "rgba(0, 0, 0, 0.15)", // Dark subtle line

  // Stacked Bars
  barSocial: "#4B4A7A",
  barRedirect: "#3B82F6",
  barDirect: "#2DD4BF",

  separatorLine: "rgba(255, 255, 255, 0.3)",
  legendDotBorder: "rgba(255, 255, 255, 0.3)",
};

export function TotalSales() {
  const [dateRange] = useState({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 0, 7),
  });

  const salesData = [
    { day: "Today", socialMedia: 33, redirectLinks: 37, directLogin: 30 },
    { day: "Jan 4", socialMedia: 30, redirectLinks: 40, directLogin: 30 },
    { day: "Jan 3", socialMedia: 38, redirectLinks: 28, directLogin: 34 },
  ];

  const totalSales = 35248;
  const previousWeekSales = 15230;
  const progressPercent = 65; // Visually set

  const legendData = [
    { label: "Social Media", color: colors.barSocial },
    { label: "Redirect Links", color: colors.barRedirect },
    { label: "Direct Login", color: colors.barDirect },
  ];

  return (
    <Card
      className="rounded-2xl border p-5 shadow-xl font-[Inter,ui-sans-serif,system-ui]"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.cardBorder,
        color: colors.textPrimary,
      }}
    >
      {/* Card Header */}
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-5">
        <CardTitle className="text-xl font-light font-sans tracking-normal" style={{ color: colors.textPrimary }}> {/* Adjusted tracking */}
          Total Sales
        </CardTitle>
        <div className="flex items-center gap-2.5">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline" size="sm"
                className="h-8 px-3 rounded-lg text-xs font-normal border focus:outline-none focus:ring-1 focus:ring-white/30 hover:bg-[#3f3f46]"
                style={{ backgroundColor: colors.dateRangeButtonBg, borderColor: colors.dateRangeButtonBorder, color: colors.textMuted }} >
                <Calendar className="mr-1.5 h-3.5 w-3.5" style={{ color: colors.textSecondary }} />
                {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none rounded-lg shadow-xl" style={{ backgroundColor: colors.dateRangeButtonBg }} align="end" >
              {/* Calendar Placeholder */}
            </PopoverContent>
          </Popover>
          <button className="focus:outline-none p-1 rounded-full hover:bg-[#27272A]" style={{ color: colors.textMuted }}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="p-0 space-y-5">
        {/* Sales Figure and Badge */}
        <div className="relative">
          <div
            className="absolute -top-3 -right-1 w-20 h-12 rounded-full opacity-60 pointer-events-none"
            style={{ background: `radial-gradient(${colors.progressBarGlow}, transparent 65%)`, filter: "blur(18px)", zIndex: 0 }} />
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-semibold font-sans leading-none tracking-tight" style={{ color: colors.textPrimary }}> {/* Increased font weight, adjusted tracking */}
              INR {totalSales.toLocaleString("en-IN")}
            </h3>
            <ShimmerButton
              className="relative z-10 inline-flex items-center justify-center rounded-full border text-xs font-medium px-3 py-1"
              style={{ backgroundColor: colors.badgeBg, borderColor: colors.cardBorder, color: colors.badgeTextSpecial }} // Applied special text color
              shimmerColor="#ffffff" shimmerSize="0.08em" shimmerDuration="3.5s" >
              Best Sales of the Month
            </ShimmerButton>
          </div>
          <div className="flex justify-between text-[11px] mt-1.5 tracking-wide" style={{ color: colors.textSecondary }}> {/* Added tracking */}
            <span>{format(dateRange.from, "MMM d, yyyy")}</span>
            <span>Revenue till {format(dateRange.to, "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-1.5 pt-1">
          {/* <hr className="border-t" style={{ borderColor: colors.separatorLine }} /> */}
          <div className="relative w-full h-2.5 rounded-full overflow-hidden mt-3" style={{ backgroundColor: colors.progressBarTrack }}>
            {/* White Progress Bar with Segments */}
            <motion.div
              className="h-full rounded-full relative flex items-center" // Added relative and flex for segment lines
              style={{ backgroundColor: colors.progressBarFill }}
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Simulate subtle segment lines within the white bar if progressPercent > 0 */}
                {/* These are decorative and approximate the look */}
                {progressPercent > 25 && <div className="absolute left-[25%] top-0 bottom-0 w-px" style={{backgroundColor: colors.progressBarSegmentLine}}></div>}
                {progressPercent > 50 && <div className="absolute left-[50%] top-0 bottom-0 w-px" style={{backgroundColor: colors.progressBarSegmentLine}}></div>}
                {progressPercent > 75 && <div className="absolute left-[75%] top-0 bottom-0 w-px" style={{backgroundColor: colors.progressBarSegmentLine}}></div>}
            </motion.div>

            {/* Progress Bar Glow */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-[120%] w-5 rounded-full pointer-events-none"
              style={{ backgroundColor: colors.progressBarGlow, filter: 'blur(5px)', left: `${progressPercent}%`, transform: 'translate(-70%, -50%)', opacity: 0.9 }}
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: `${progressPercent}%`, opacity: 0.9 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }} />
          </div>
          
          <div className="relative w-full flex justify-center -mt-1">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded tracking-normal" style={{ color: colors.progressLabelPreviousWeek, backgroundColor: colors.background }}> {/* Adjusted tracking */}
                Previous Week
            </span>
          </div>
          <hr className="border-t" style={{ borderColor: colors.separatorLine }} />
          <div className="flex justify-between text-base font-semibold pt-1.5 tracking-tight" style={{ color: colors.textPrimary }}> {/* Increased font size, weight, adjusted tracking */}
            <span className="font-medium text-sm" style={{ color: colors.textSubtle }}>Previous Week</span> {/* Adjusted this label style slightly */}
            <span>INR {previousWeekSales.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Daily Breakdown Bars */}
        <div className="space-y-2.5 pt-3">
          {salesData.map((item, index) => {
            const total = item.socialMedia + item.redirectLinks + item.directLogin;
            const socialPercent = total === 0 ? 0 : (item.socialMedia / total) * 100;
            const redirectPercent = total === 0 ? 0 : (item.redirectLinks / total) * 100;
            const directPercent = total === 0 ? 0 : (item.directLogin / total) * 100;

            return (
              <div key={item.day} className="flex items-center gap-3">
                <span className="w-12 text-xs text-right flex-shrink-0 font-medium tracking-normal" style={{ color: colors.textSecondary }}> {/* Adjusted tracking */}
                  {item.day}
                </span>
                <div className="flex-1 h-3.5 rounded-full overflow-hidden flex">
                  <motion.div style={{ backgroundColor: colors.barSocial, width: `${socialPercent}%` }} className="h-full"
                    initial={{ width: "0%"}} animate={{ width: `${socialPercent}%`}} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 * index }} />
                  <motion.div style={{ backgroundColor: colors.barRedirect, width: `${redirectPercent}%` }} className="h-full"
                     initial={{ width: "0%"}} animate={{ width: `${redirectPercent}%`}} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 * index + 0.05 }} />
                  <motion.div style={{ backgroundColor: colors.barDirect, width: `${directPercent}%` }} className="h-full"
                     initial={{ width: "0%"}} animate={{ width: `${directPercent}%`}} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 * index + 0.1 }} />
                </div>
              </div> );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-end gap-3.5 pt-2 pr-2">
          {legendData.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                 <span className="relative inline-flex rounded-full h-full w-full border" style={{backgroundColor: item.color, borderColor: colors.legendDotBorder }}></span>
              </span>
              <span className="text-[11px] tracking-normal" style={{ color: colors.textSecondary }}> {/* Adjusted tracking */}
                {item.label}
              </span>
            </div> ))}
        </div>
      </CardContent>
    </Card>
  );
}