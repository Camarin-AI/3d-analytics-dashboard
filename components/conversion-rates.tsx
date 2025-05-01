"use client";

import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data structure matching the visual groups
const chartData = [
  { withEmbeds: 30, withoutEmbeds: 20 },
  { withEmbeds: 48, withoutEmbeds: 38 },
  { withEmbeds: 50, withoutEmbeds: 48 },
  { withEmbeds: 35, withoutEmbeds: 34 },
  { withEmbeds: 40, withoutEmbeds: 33 },
  { withEmbeds: 20, withoutEmbeds: 17 },
];

// Define colors based on the image analysis
const colors = {
  background: "#161618",
  cardBorder: "rgba(255, 255, 255, 0.4)",
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA", // Lighter gray for axis/legend text
  iconMuted: "#6B7280",
  gridLine: "rgba(255, 255, 255, 0.1)", // Faint white grid lines
  barWithEmbeds: "#14B8A6", // Teal
  barWithoutEmbeds: "#F59E0B", // Orange/Amber
  legendActiveBorder: "#FFFFFF", // White border for active legend item (using bar color bg)
};

// Chart Constants
const MAX_VALUE = 80; // Based on the Y-axis labels
const Y_AXIS_LABELS = [80, 40, 20, 0];

export function ConversionRates() {
  // Note: In this version, the legend doesn't control data visibility,
  // it just labels the existing bars, like in the image.
  // If interactivity was needed, state would be added.

  return (
    <Card
      className="rounded-2xl border p-6 shadow-xl h-full flex flex-col"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.cardBorder,
        color: colors.textPrimary,
      }}
    >
      {/* Card Header */}
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6"> {/* Increased margin bottom */}
        <CardTitle className="text-xl font-light font-sans text-white" style={{ color: colors.textPrimary }}> {/* Primary color for title */}
          Conversion Rates
        </CardTitle>
        <button className="focus:outline-none" style={{ color: colors.iconMuted }}>
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="p-0 flex-grow flex flex-col"> {/* Use flex-grow */}
        {/* Chart Area Wrapper */}
        <div className="flex-grow flex items-end gap-4 pl-8 pr-4 relative"> {/* Added padding left for Y-axis */}

          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 bottom-[20px] flex flex-col justify-between h-[calc(100%-20px)]"> {/* Adjust bottom offset */}
            {Y_AXIS_LABELS.map((label) => (
              <span key={label} className="text-xs" style={{ color: colors.textSecondary }}>
                {label === 0 ? '0' : `${label}%`} {/* Handle 0 specifically */}
              </span>
            ))}
          </div>

          {/* Grid Lines & Bars Container */}
          <div className="flex-grow h-full relative flex justify-around items-end gap-3"> {/* Use justify-around */}
            {/* Grid Lines */}
            <div className="absolute inset-0 top-0 bottom-[20px] right-0 left-0"> {/* Position behind bars */}
              {Y_AXIS_LABELS.slice(0, -1).map((label, index) => ( // Exclude 0 label for grid lines
                <div
                  key={`grid-${label}`}
                  className="absolute w-full h-px left-0"
                  style={{
                    backgroundColor: colors.gridLine,
                    // Position lines based on percentage from the TOP
                    // 80% line is at 20% from top, 40% line at 60%, 20% line at 80%
                    top: `${100 - (label / MAX_VALUE) * 100}%`,
                  }}
                />
              ))}
               {/* Explicit bottom line for 0% */}
               <div
                  className="absolute w-full h-px left-0 bottom-0"
                  style={{ backgroundColor: colors.gridLine }}
                />
            </div>

            {/* Bar Groups */}
            {chartData.map((group, index) => (
              <div key={index} className="flex gap-1.5 items-end h-full relative z-10"> {/* Ensure bars are above grid */}
                {/* With Embeds Bar */}
                <motion.div
                  className="w-3 lg:w-4 rounded-t-md" // Responsive width
                  style={{ backgroundColor: colors.barWithEmbeds }}
                  initial={{ height: "0%" }}
                  animate={{ height: `${(group.withEmbeds / MAX_VALUE) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                />
                {/* Without Embeds Bar */}
                <motion.div
                  className="w-3 lg:w-4 rounded-t-md" // Responsive width
                  style={{ backgroundColor: colors.barWithoutEmbeds }}
                  initial={{ height: "0%" }}
                  animate={{ height: `${(group.withoutEmbeds / MAX_VALUE) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 + 0.1 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Legend Area */}
        <div className="flex justify-center gap-5 pt-4 mt-2">
          {/* With Embeds Legend */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {/* Background color matching the bar */}
              <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.barWithEmbeds }}></span>
              {/* Outer border indicating this series */}
              <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.barWithEmbeds }}></span>
            </span>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              With Embeds
            </span>
          </div>

          {/* Without Embeds Legend */}
          <div className="flex items-center gap-2">
             <span className="relative flex h-3 w-3">
               {/* Background color matching the bar */}
               <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.barWithoutEmbeds }}></span>
               {/* Outer border indicating this series */}
               <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.barWithoutEmbeds }}></span>
             </span>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              Without Embeds
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}