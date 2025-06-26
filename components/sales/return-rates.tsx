"use client";

import { useState } from "react";
import { MoreHorizontal, ArrowDown, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiData } from "@/hooks/use-api-data";
import { ReturnRatesData } from "@/lib/data-service";

// Define data for both sources, matching visual rings
const data = {
  without: { // Outer Ring Data
    rate: 71,
    trend: "down",
  },
  with: { // Inner Ring Data
    rate: 45, // Example data for the inner ring
    trend: "up", // Example trend for inner ring
  },
};

// Define colors based on activity state
const colors = {
  background: "#161618",
  cardBorder: "rgba(255, 255, 255, 0.4)", // Adjusted border opacity based on image
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  iconMuted: "#6B7280",
  // --- Dynamic Ring/Track Colors ---
  progressActive: "#14B8A6",      // Bright teal for the active progress arc
  progressInactive: "#095C56",    // Darker, less saturated teal for inactive arc (adjust as needed)
                                   // Alt: use opacity: "rgba(20, 184, 166, 0.3)"
  trackActive: "rgba(20, 184, 166, 0.2)", // Visible track for the active ring
  trackInactive: "rgba(20, 184, 166, 0.05)", // Very faint track for the inactive ring
  // --- Other Colors ---
  trendDown: "#F87171",
  trendUp: "#34D399",
  legendActiveHighlight: "#14B8A6", // Color for the active legend circle's border
  legendInactiveCircle: "#6B7280", // Background color for inactive legend circle
  legendInactiveText: "#6B7280",
};

// SVG Circle properties
const outerRadius = 42;
const innerRadius = 30;
const outerCircumference = 2 * Math.PI * outerRadius; // Approx 264
const innerCircumference = 2 * Math.PI * innerRadius; // Approx 188
const outerStrokeWidth = 8;
const innerStrokeWidth = 6; // Keep inner ring slightly thinner than outer

interface ReturnRatesProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function ReturnRates({ dateRange }: ReturnRatesProps) {
  const { data, loading, error } = useApiData<ReturnRatesData>({ endpoint: 'return-rates', dateRange });
  const fallback = { without: { rate: 71, trend: "down" }, with: { rate: 45, trend: "up" } };
  const d = (error ? fallback : (data || fallback));
  const [activeView, setActiveView] = useState<"without" | "with">("without");
  if (loading) return <div className="text-gray-400">Loading return rates...</div>;

  // Show a subtle warning if fallback data is being used due to error
  const isFallback = error;

  const displayData = d[activeView]; // Data to show in the center

  // Calculate offsets (these don't change based on activeView)
  const outerProgressOffset = outerCircumference - (outerCircumference * d.without.rate) / 100;
  const innerProgressOffset = innerCircumference - (innerCircumference * d.with.rate) / 100;

  // Determine active/inactive state for styling
  const isOuterActive = activeView === 'without';
  const isInnerActive = activeView === 'with';

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
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        {/* Adjusted Title font */}
        <CardTitle className="text-xl font-light font-sans text-white" style={{ color: colors.textPrimary }}>
          Return Rates
        </CardTitle>
        <button className="focus:outline-none" style={{ color: colors.iconMuted }}>
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>

      {/* Subtle warning if fallback is used */}
      {isFallback && (
        <div className="mb-2 flex items-center gap-2 text-xs text-yellow-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          Offline mode: showing fallback data
        </div>
      )}

      {/* Card Content */}
      <CardContent className="p-0 flex flex-col flex-grow items-center justify-center">
        {/* Chart Area */}
        <div className="relative w-48 h-48 mb-6">
          {/* SVG Container */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background Track Circle - Outer */}
            <circle
              cx="50"
              cy="50"
              r={outerRadius}
              fill="none"
              // *** Apply dynamic track color ***
              stroke={isOuterActive ? colors.trackActive : colors.trackInactive}
              strokeWidth={outerStrokeWidth}
              strokeLinecap="round"
            />
            {/* Background Track Circle - Inner */}
            <circle
              cx="50"
              cy="50"
              r={innerRadius}
              fill="none"
              // *** Apply dynamic track color ***
              stroke={isInnerActive ? colors.trackActive : colors.trackInactive}
              strokeWidth={innerStrokeWidth}
              strokeLinecap="round"
            />

            {/* Progress Circle - Outer (Without Embeds) */}
            <motion.circle
              cx="50"
              cy="50"
              r={outerRadius}
              fill="none"
              // *** Apply dynamic progress color ***
              stroke={isOuterActive ? colors.progressActive : colors.progressInactive}
              strokeWidth={outerStrokeWidth}
              strokeDasharray={outerCircumference}
              strokeDashoffset={outerProgressOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              initial={{ strokeDashoffset: outerCircumference }}
              // Animate stroke color change along with offset
              animate={{
                 strokeDashoffset: outerProgressOffset,
                 stroke: isOuterActive ? colors.progressActive : colors.progressInactive
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }} // Slightly faster color transition?
            />

            {/* Progress Circle - Inner (With Embeds) */}
            <motion.circle
              cx="50"
              cy="50"
              r={innerRadius}
              fill="none"
              // *** Apply dynamic progress color ***
              stroke={isInnerActive ? colors.progressActive : colors.progressInactive}
              strokeWidth={innerStrokeWidth}
              strokeDasharray={innerCircumference}
              strokeDashoffset={innerProgressOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              initial={{ strokeDashoffset: innerCircumference }}
              // Animate stroke color change along with offset
              animate={{
                strokeDashoffset: innerProgressOffset,
                stroke: isInnerActive ? colors.progressActive : colors.progressInactive
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </svg>

          {/* Center Text & Trend Indicator (Based on activeView) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                {displayData.rate}%
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeView} // Animate when activeView changes
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {displayData.trend === "down" ? (
                    // <ArrowDown size={16} style={{ color: colors.trendDown }} />
                    <img src="/downArrow.png" alt="Down Arrow" className="w-3 h-3" />
                  ) : (
                    <img src="/upArrow.png" alt="Up Arrow" className="w-3 h-3" />
                  )}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              Returns
            </span>
          </div>
        </div>

        {/* Legend Area */}
        <div className="flex justify-center gap-5">
          {/* Without Embeds Legend Item (Corresponds to Outer Ring) */}
          <button
            onClick={() => setActiveView("without")}
            className={`flex items-center gap-2 cursor-pointer focus:outline-none transition-colors duration-200`}
            style={{ color: isOuterActive ? colors.textPrimary : colors.legendInactiveText }}
          >
            <span
              className="relative flex h-3 w-3 rounded-full border border-transparent"
              // Legend circle background reflects the *bright* active color if selected
              style={{ backgroundColor: isOuterActive ? colors.progressActive : colors.legendInactiveCircle }}
            >
              {/* Active state indicator border uses the bright color */}
              {isOuterActive && (
                 <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.legendActiveHighlight }}></span>
              )}
            </span>
            <span className="text-xs">Without Embeds</span>
          </button>

          {/* With Embeds Legend Item (Corresponds to Inner Ring) */}
          <button
            onClick={() => setActiveView("with")}
            className={`flex items-center gap-2 cursor-pointer focus:outline-none transition-colors duration-200`}
             style={{ color: isInnerActive ? colors.textPrimary : colors.legendInactiveText }}
          >
             <span
               className="relative flex h-3 w-3 rounded-full border border-transparent"
               // Legend circle background reflects the *bright* active color if selected
               style={{ backgroundColor: isInnerActive ? colors.progressActive : colors.legendInactiveCircle }}
             >
               {/* Active state indicator border uses the bright color */}
               {isInnerActive && (
                 <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: colors.legendActiveHighlight }}></span>
               )}
            </span>
            <span className="text-xs">With Embeds</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}