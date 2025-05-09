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
import { ShimmerButton } from "@/components/magicui/shimmer-button";

// Define specific colors based on the image analysis
const colors = {
  background: "#161618", // Slightly darker background than original reference code
  cardBorder: "rgba(255, 255, 255, 0.4)", // Subtle white border
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA", // Lighter gray for secondary text
  textMuted: "#71717A", // Darker gray for muted text
  dateRangeButtonBg: "#27272A",
  dateRangeButtonBorder: "rgba(255, 255, 255, 0.15)",
  badgeBg: "#27272A",
  badgeBorder: "rgba(255, 255, 255, 0.2)",
  progressBarBg: "#0E7490", // Dark teal/blue for progress bar background
  progressBarFg: "#FFFFFF", // White progress
  previousWeekLabel: "#2DD4BF", // Teal color for "Previous Week"
  barSocial: "#4F46E5", // Indigo/Dark Purple
  barRedirect: "#3B82F6", // Bright Blue
  barDirect: "#2DD4BF", // Teal/Cyan
  glowColor: "rgba(255, 255, 255, 0.7)", // White glow color
};

export function TotalSales() {
  const [dateRange] = useState({
    from: new Date(2025, 0, 1), // Jan 1, 2025
    to: new Date(2025, 0, 7), // Jan 7, 2025
  });

  // Adjusted data to better match visual proportions in the image
  const salesData = [
    {
      day: "Today",
      socialMedia: 35, // Proportions (not actual values)
      redirectLinks: 40,
      directLogin: 25,
    },
    {
      day: "Jan 4",
      socialMedia: 30,
      redirectLinks: 45,
      directLogin: 25,
    },
    {
      day: "Jan 3",
      socialMedia: 40,
      redirectLinks: 30,
      directLogin: 30,
    },
  ];

  const totalSales = 35248;
  const previousWeekSales = 15230;
  // Calculate the *end position* of the white bar for the glow effect
  // This seems visually around 60-70% in the image, not based on previousWeekSales/totalSales
  const progressPercent = 65; // Adjust this percentage visually

  const legendData = [
    { label: "Social Media", color: colors.barSocial },
    { label: "Redirect Links", color: colors.barRedirect },
    { label: "Direct Login", color: colors.barDirect },
  ];

  return (
    <Card
      className="rounded-2xl border p-6 shadow-xl"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.cardBorder,
        color: colors.textPrimary,
        // Adding a subtle outer glow to the card itself if desired
        // boxShadow: `0 0 15px rgba(255, 255, 255, 0.05)`,
      }}
    >
      {/* Card Header */}
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <CardTitle className="text-xl font-light" style={{ color: colors.textPrimary }}>
          Total Sales
        </CardTitle>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#161618] focus:ring-white"
                style={{
                  backgroundColor: colors.dateRangeButtonBg,
                  borderColor: colors.dateRangeButtonBorder,
                  color: colors.textSecondary,
                }}
              >
                <Calendar className="mr-2 h-4 w-4" style={{ color: colors.textMuted }} />
                {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-none rounded-lg shadow-lg"
              style={{ backgroundColor: colors.dateRangeButtonBg }}
              align="end"
            >
              {/* Replace with your actual Calendar component if needed */}
              {/* <div className="p-4 text-white">Calendar Placeholder</div> */}
            </PopoverContent>
          </Popover>
          <button className="focus:outline-none" style={{ color: colors.textMuted }}>
            <MoreHorizontal size={20} />
          </button>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="p-0 space-y-6">
        {/* Sales Figure and Badge */}
        <div className="relative">
          {/* Badge Glow Effect */}
          <div
            className="absolute -top-4 right-4 w-24 h-16 rounded-full opacity-80 pointer-events-none"
            style={{
              background: `radial-gradient(${colors.glowColor}, transparent 70%)`,
              filter: "blur(20px)",
              zIndex: 0, // Ensure glow is behind badge
            }}
          />
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-light leading-none" style={{ color: colors.textPrimary }}>
              INR {totalSales.toLocaleString("en-IN")}
            </h3>
            {/* Actual Badge */}
            <span
              className="relative z-10 text-xs px-4 py-1.5 rounded-full border"
              style={{
                backgroundColor: colors.badgeBg,
                borderColor: colors.cardBorder,
                color: "#EBB866",
              }}
            >
              Best Sales of the Month
            </span>
          </div>
          <div className="flex justify-between text-xs mt-2" style={{ color: colors.textMuted }}>
            <span>{format(dateRange.from, "MMM d, yyyy")}</span>
            <span>Revenue till {format(dateRange.to, "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-2 pt-2">
           {/* Thin separator line */}
           <hr className="border-t" style={{ borderColor: colors.cardBorder }} />

          <div className="relative w-full h-3 rounded-full overflow-hidden mt-4" style={{ backgroundColor: colors.progressBarBg }}>
            {/* White Progress Bar */}
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colors.progressBarFg }}
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            {/* Progress Bar Glow */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full pointer-events-none"
              style={{
                backgroundColor: colors.glowColor,
                filter: 'blur(10px)',
                // Position the glow slightly offset from the end of the white bar
                left: `${progressPercent}%`,
                transform: 'translate(-60%, -50%)', // Adjust horizontal offset (-50% to -70% usually works)
                opacity: 0.8,
              }}
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: `${progressPercent}%`, opacity: 0.8 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between text-lg mt-1">
            <span style={{ color: colors.previousWeekLabel }}>Previous Week</span>
            <span style={{ color: colors.textSecondary }}>
              INR {previousWeekSales.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Daily Breakdown Bars */}
        <div className="space-y-3 pt-4">
          {salesData.map((item) => {
            const total = item.socialMedia + item.redirectLinks + item.directLogin;
            const socialPercent = (item.socialMedia / total) * 100;
            const redirectPercent = (item.redirectLinks / total) * 100;
            const directPercent = (item.directLogin / total) * 100;

            return (
              <div key={item.day} className="flex items-center gap-4">
                <span className="w-12 text-sm text-right" style={{ color: colors.textSecondary }}>
                  {item.day}
                </span>
                <div className="flex-1 h-4 rounded-full overflow-hidden flex">
                  {/* Social Media Segment */}
                  <motion.div
                    style={{ backgroundColor: colors.barSocial, width: `${socialPercent}%` }}
                    className="h-full"
                    initial={{ width: "0%"}}
                    animate={{ width: `${socialPercent}%`}}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  />
                  {/* Redirect Links Segment */}
                  <motion.div
                    style={{ backgroundColor: colors.barRedirect, width: `${redirectPercent}%` }}
                    className="h-full"
                     initial={{ width: "0%"}}
                     animate={{ width: `${redirectPercent}%`}}
                     transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  />
                  {/* Direct Login Segment */}
                  <motion.div
                     style={{ backgroundColor: colors.barDirect, width: `${directPercent}%` }}
                     className="h-full"
                     initial={{ width: "0%"}}
                     animate={{ width: `${directPercent}%`}}
                     transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-end gap-4 pt-2 pr-4"> {/* Aligned to the right */}
          {legendData.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {/* Legend circle with subtle border/glow */}
              <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{backgroundColor: item.color}}></span>
                 <span className="relative inline-flex rounded-full h-3 w-3" style={{backgroundColor: item.color}}></span>
              </span>

              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}