"use client";

import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react"; // Import React for fragment usage

// Data based on the image
const chartData = [
  { name: "New Customers", value: 80, color: "#1E3A8A" }, // Dark Blue
  { name: "Returning Customers", value: 20, color: "#F59E0B" }, // Orange/Amber
];

// Define colors based on the image analysis
const colors = {
  background: "#161618",
  cardBorder: "rgba(255, 255, 255, 0.4)", // Slightly reduced border opacity from image analysis
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA", // Lighter gray for secondary/legend text
  textMuted: "#6B7280", // Muted gray for 'By' in center
  iconMuted: "#6B7280",
  segmentLabel: "#E5E7EB", // Light gray/off-white for segment %
  // Added background color for the percentage labels
  labelBackground: "rgba(0, 0, 0, 0.35)", // Dark transparent background
  // Segment colors are defined in chartData
};

// SVG Donut properties
const radius = 40;
const circumference = 2 * Math.PI * radius; // Approx 251.2
const strokeWidth = 18; // Wider stroke for the donut look

export function TrafficAnalysis() {
  let accumulatedAngle = -90; // Start angle (top)

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
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        {/* Adjusted Title styling */}
        <CardTitle className="text-xl font-light font-sans text-white" style={{ color: colors.textPrimary }}>
          Traffic Analysis
        </CardTitle>
        <button className="focus:outline-none" style={{ color: colors.iconMuted }}>
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="p-0 flex-grow flex flex-col items-center justify-center">
        {/* Chart Area */}
        <div className="relative w-52 h-52 mb-6">
          {/* SVG Container */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Render segments - IMPORTANT: Render orange (smaller %) BEFORE blue (larger %) for overlap */}
            {/* Sort data to render smaller value first */}
            {[...chartData].sort((a, b) => a.value - b.value).map((segment, index) => {
              const percentage = segment.value;
              const segmentAngle = (percentage / 100) * 360;
              const startAngle = accumulatedAngle;
              const midAngle = startAngle + segmentAngle / 2;

              const segmentOffset = circumference - (circumference * percentage) / 100;

              // Calculate label position
              const labelRadius = radius; // Position label on the stroke
              const labelX = 50 + labelRadius * Math.cos((midAngle * Math.PI) / 180);
              const labelY = 50 + labelRadius * Math.sin((midAngle * Math.PI) / 180);

              // Update accumulated angle for the next segment's start
              accumulatedAngle += segmentAngle;

              return (
                // Using React.Fragment to group SVG elements per segment
                <React.Fragment key={segment.name}>
                  {/* Donut Segment */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // Start fully hidden
                    strokeLinecap="butt" // Use butt for sharp overlap edges
                    transform={`rotate(${startAngle} 50 50)`} // Rotate to start position
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: segmentOffset }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  />

                  {/* Transparent Oval Background for Label */}
                  <motion.rect
                  // position the rect so it's centered on (labelX, labelY)
                  x={labelX - 12}         // half of your desired width (e.g. 28/2)
                  y={labelY - 7.5}          // half of your desired height (e.g. 16/2)
                  width={24}              // total width of the pill
                  height={15}             // total height of the pill
                  rx={7.5}                  // corner radius = half the height for a perfect pill
                  ry={7.5}
                  fill={colors.labelBackground}  // same semi-transparent white/gray
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 1 + index * 0.2 }}
                />

                   {/* Segment Percentage Label */}
                   <motion.text
                      x={labelX}
                      y={labelY}
                      fill={colors.segmentLabel}
                      fontSize="7" // Reduced font size
                      fontWeight="medium" // Adjusted font weight
                      textAnchor="middle"
                      dominantBaseline="central"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.2 }} // Delay until segment draws
                    >
                      {`${percentage}%`}
                    </motion.text>
                </React.Fragment>
              );
            })}

            {/* Center Text - Adjusted font size and weight */}
            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50" dy="-0.6em" fontSize="8" fill={colors.textMuted}> {/* Adjusted size/position */}
                By
              </tspan>
              <tspan x="50" dy="1.2em" fontSize="8" fontWeight="normal" fill={colors.textPrimary}> {/* Adjusted size/weight */}
                Customer
              </tspan>
              <tspan x="50" dy="1.2em" fontSize="8" fontWeight="normal" fill={colors.textPrimary}> {/* Adjusted size/weight */}
                Types
              </tspan>
            </text>
          </svg>
        </div>

        {/* Legend Area */}
        <div className="flex justify-center gap-5 pt-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                 {/* Background color circle */}
                 <span className="absolute inset-0 rounded-full" style={{ backgroundColor: item.color }}></span>
                 {/* Subtle border matching the color */}
                 <span className="absolute -inset-0.5 rounded-full border" style={{ borderColor: item.color }}></span>
              </span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}