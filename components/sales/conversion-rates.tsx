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
  gridLine: "rgba(255, 255, 255, 0.3)", // Faint white grid lines
  barWithEmbeds: "#14B8A6", // Teal
  barWithoutEmbeds: "#F59E0B", // Orange/Amber
  legendActiveBorder: "#FFFFFF", 
};

const MAX_VALUE = 80; 
const Y_AXIS_LABELS = [80, 40, 20, 0];

export function ConversionRates() {
  return (
    <Card
      className="rounded-2xl border p-6 shadow-xl h-full flex flex-col"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.cardBorder,
        color: colors.textPrimary,
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6"> 
        <CardTitle className="text-xl font-light font-sans text-white" style={{ color: colors.textPrimary }}> 
          Conversion Rates
        </CardTitle>
        <button className="focus:outline-none" style={{ color: colors.iconMuted }}>
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>

      <CardContent className="p-0 flex-grow flex flex-col">
        {/* FIX 4: Added min-h-[250px] to chart area wrapper and responsive gap/bar width */}
        <div className="flex-grow flex items-end gap-2 sm:gap-4 pl-8 pr-4 relative min-h-[250px]"> 

          <div className="absolute left-0 top-0 bottom-[20px] flex flex-col justify-between h-[calc(100%-20px)]"> 
            {Y_AXIS_LABELS.map((label) => (
              <span key={label} className="text-xs" style={{ color: colors.textSecondary }}>
                {label === 0 ? '0' : `${label}%`} 
              </span>
            ))}
          </div>

          <div className="flex-grow h-full relative flex justify-around items-end gap-2 sm:gap-3"> 
            <div className="absolute inset-0 top-0 bottom-[20px] right-0 left-0"> 
              {Y_AXIS_LABELS.slice(0, -1).map((label, index) => ( 
                <div
                  key={`grid-${label}`}
                  className="absolute w-full h-px left-0"
                  style={{
                    backgroundColor: colors.gridLine,
                    top: `${100 - (label / MAX_VALUE) * 100}%`,
                  }}
                />
              ))}
               <div
                  className="absolute w-full h-px left-0 bottom-0"
                  style={{ backgroundColor: colors.gridLine }}
                />
            </div>

            {chartData.map((group, index) => (
              <div key={index} className="flex gap-1 sm:gap-1.5 items-end h-full relative z-10"> 
                <motion.div
                  className="w-2.5 md:w-3 lg:w-4 rounded-t-md" // Responsive bar width
                  style={{ backgroundColor: colors.barWithEmbeds }}
                  initial={{ height: "0%" }}
                  animate={{ height: `${(group.withEmbeds / MAX_VALUE) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                />
                <motion.div
                  className="w-2.5 md:w-3 lg:w-4 rounded-t-md" // Responsive bar width
                  style={{ backgroundColor: colors.barWithoutEmbeds }}
                  initial={{ height: "0%" }}
                  animate={{ height: `${(group.withoutEmbeds / MAX_VALUE) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 + 0.1 }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 pt-4 mt-2"> {/* Responsive legend */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.barWithEmbeds }}></span>
              <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.barWithEmbeds }}></span>
            </span>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              With Embeds
            </span>
          </div>

          <div className="flex items-center gap-2">
             <span className="relative flex h-3 w-3">
               <span className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.barWithoutEmbeds }}></span>
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