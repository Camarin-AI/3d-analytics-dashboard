"use client";

import { useState } from "react";
import { Calendar, MoreHorizontal, TrendingUp, AlertTriangle, Moon } from "lucide-react"; // Import relevant icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define specific colors based *strictly* on the image analysis
const colors = {
  background: "#161618", // Main card background
  cardBorder: "rgba(255, 255, 255, 0.4)", // Faint card border
  textPrimary: "#E4E4E7", // Primary text (values, main headers) - slightly off-white
  textSecondary: "#A1A1AA", // Secondary text (labels like SKU Name:)
  textMuted: "#71717A", // Muted text (placeholder-like, e.g., 'Daily Average')
  dateRangeButtonBg: "#27272A", // Button background
  dateRangeButtonBorder: "rgba(255, 255, 255, 0.15)", // Button border
  imageContainerBg: "#000000", // Image background seems pure black
  statsBoxBorder: "rgba(255, 255, 255, 0.4)", // Border for the 'This Week' box
  statsSeparator: "rgba(255, 255, 255, 0.4)", // Separator line in stats box
  statusAvailable: "#2DD4BF", // Teal/Green for 'Available' and 'Yes'
  statusYes: "#2DD4BF", // Same Teal/Green
  categoryTagBg: "#27272A", // Background for category tags
  categoryTagBorder: "rgba(255, 255, 255, 0.4)", // Border for category tags
  indicatorTagBg: "#1C1C1E", // Slightly different dark bg for bottom tags? Or same as card? Let's try darker.
  indicatorTagBorder: "rgba(255, 255, 255, 0.4)", // Border for bottom indicator tags
  iconHighCTR: "#2DD4BF", // Green for High CTR icon
  iconNeedsPromotion: "#FBBF24", // Yellow/Amber for Needs Promotion icon
  iconLowEngagement: "#60A5FA", // Blue-ish for Low Engagement icon (using Moon)
};

// Placeholder data matching the image
const skuData = {
  name: "Diamond Cut Earrings",
  id: "ID140001",
  stock: "Available",
  listed: "Yes",
  digitised: "Yes",
  price: 1050,
  categories: ["Earrings", "Diamond"],
  thisWeekSales: 8459,
  dailyAverage: 1650,
  conversionRate: 71, // As percentage
  averageCTR: 2.3, // As percentage
  imageSrc: "/diamond-earrings.png", // Replace with your actual image path
};

export function SkuDetails() {
  const [dateRange] = useState({
    from: new Date(2025, 0, 1), // Jan 1, 2025
    to: new Date(2025, 0, 7), // Jan 7, 2025
  });

  return (
    <Card
      className="rounded-2xl border p-6 shadow-lg h-full flex flex-col font-sans" // Added font-sans for consistency if needed
      style={{
        backgroundColor: colors.background,
        borderColor: colors.cardBorder,
        color: colors.textPrimary, // Default text color
      }}
    >
      {/* Card Header */}
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <CardTitle className="text-xl font-normal tracking-wide" style={{ color: colors.textPrimary }}>
          SKU Details
        </CardTitle>
        <div className="flex items-center gap-3">
           {/* Date Range Picker Button - Styled to match image */}
           <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-lg text-xs font-normal border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#161618] focus:ring-white hover:bg-[#3f3f46]" // Added hover state
            style={{
              backgroundColor: colors.dateRangeButtonBg,
              borderColor: colors.dateRangeButtonBorder,
              color: colors.textSecondary, // Use secondary color for button text
            }}
          >
            <Calendar className="mr-2 h-4 w-4" style={{ color: colors.textMuted }} />
            {format(dateRange.from, "d MMM, yyyy")} - {format(dateRange.to, "d MMM, yyyy")}
          </Button>
          {/* More Options Button */}
          <button className="focus:outline-none" style={{ color: colors.textMuted }}>
            <MoreHorizontal size={20} />
          </button>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="p-0 flex-grow flex flex-col">
        {/* Main content grid: Image/Stats (Left) + Details (Right) */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">

          {/* Left Column: Image + Stats Box */}
          <div className="w-full lg:w-[40%] flex flex-col gap-4 flex-shrink-0"> {/* Adjusted width and gap */}
            {/* Image Container */}
            <div className="aspect-square rounded-xl overflow-hidden flex items-center justify-center"
                 style={{ backgroundColor: colors.imageContainerBg }}>
                <Image
                    // *** IMPORTANT: Replace with your actual image path ***
                    src={skuData.imageSrc}
                    alt={skuData.name}
                    width={250} // Adjust size as needed
                    height={250}
                    className="object-contain" // Use contain if image aspect ratio varies
                    priority // Load image sooner
                />
            </div>

            {/* Stats Box */}
            <div
              className="rounded-xl border p-4 flex flex-col"
              style={{ borderColor: colors.statsBoxBorder }}
            >
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm" style={{ color: colors.textSecondary }}>This Week</span>
                <span className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  INR {skuData.thisWeekSales.toLocaleString("en-IN")}
                </span>
              </div>
              <hr className="border-t my-2" style={{ borderColor: colors.statsSeparator }} />
              <div className="flex justify-between items-center text-xs">
                <div className="text-center">
                  <span className="block" style={{ color: colors.textMuted }}>Daily Average</span>
                  <span className="block font-medium" style={{ color: colors.textPrimary }}>
                    INR {skuData.dailyAverage.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-center">
                  <span className="block" style={{ color: colors.textMuted }}>Conversion Rate</span>
                  <span className="block font-medium" style={{ color: colors.textPrimary }}>
                    {skuData.conversionRate}%
                  </span>
                </div>
                 <div className="text-center">
                  <span className="block" style={{ color: colors.textMuted }}>Average CTR</span>
                  <span className="block font-medium" style={{ color: colors.textPrimary }}>
                    {skuData.averageCTR}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: SKU Details + Categories */}
          <div className="w-full lg:flex-1 flex flex-col gap-4"> {/* Adjusted gap */}
             {/* Detail Rows */}
             <div className="space-y-3"> {/* Vertical spacing for details */}
                <div className="flex items-baseline gap-2">
                    <span className="w-20 text-sm flex-shrink-0" style={{color: colors.textSecondary}}>SKU Name:</span>
                    <span className="font-medium" style={{color: colors.textPrimary}}>{skuData.name}</span>
                </div>
                 <div className="flex items-baseline gap-2">
                    <span className="w-20 text-sm flex-shrink-0" style={{color: colors.textSecondary}}>SKU ID:</span>
                    <span className="font-medium" style={{color: colors.textPrimary}}>{skuData.id}</span>
                </div>
                 <div className="flex items-baseline gap-2">
                    <span className="w-20 text-sm flex-shrink-0" style={{color: colors.textSecondary}}>Stock :</span>
                    <span className="font-medium" style={{color: colors.statusAvailable}}>{skuData.stock}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="w-20 text-sm flex-shrink-0" style={{color: colors.textSecondary}}>Listed :</span>
                    <span className="font-medium" style={{color: colors.statusYes}}>{skuData.listed}</span>
                </div>
                 <div className="flex items-baseline gap-2">
                    <span className="w-20 text-sm flex-shrink-0" style={{color: colors.textSecondary}}>Digitised :</span>
                    <span className="font-medium" style={{color: colors.statusYes}}>{skuData.digitised}</span>
                </div>
                 <div className="flex items-baseline gap-2 mt-2"> {/* Added top margin */}
                    <span className="w-20 text-sm flex-shrink-0" style={{color: colors.textSecondary}}>Listing Price :</span>
                    <span className="text-base font-semibold" style={{color: colors.textPrimary}}>
                        INR {skuData.price.toLocaleString("en-IN")}
                    </span>
                </div>
             </div>

            {/* Categories Section */}
            <div className="mt-2"> {/* Added top margin */}
              <span className="text-sm mr-2" style={{ color: colors.textSecondary }}>Categories :</span>
              <div className="inline-flex flex-wrap gap-2 mt-1">
                {skuData.categories.map((category) => (
                  <span
                    key={category}
                    className="text-xs px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: colors.categoryTagBg,
                      borderColor: colors.categoryTagBorder,
                      color: colors.textSecondary, // Use secondary for tag text
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Indicator Tags */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4"> {/* mt-auto pushes to bottom if space, pt-4 adds space */}
           {/* High CTR Tag */}
           <div
             className="flex-1 flex items-center justify-center gap-2 border rounded-full px-4 py-2 text-sm"
             style={{ backgroundColor: colors.indicatorTagBg, borderColor: colors.indicatorTagBorder }}
           >
             <span>High CTR</span>
             <TrendingUp size={16} style={{ color: colors.iconHighCTR }}/>
           </div>
           {/* Needs Promotion Tag */}
           <div
             className="flex-1 flex items-center justify-center gap-2 border rounded-full px-4 py-2 text-sm"
             style={{ backgroundColor: colors.indicatorTagBg, borderColor: colors.indicatorTagBorder }}
           >
             <span>Needs Promotion</span>
             <AlertTriangle size={16} style={{ color: colors.iconNeedsPromotion }}/>
           </div>
           {/* Low Engagement Tag */}
           <div
             className="flex-1 flex items-center justify-center gap-2 border rounded-full px-4 py-2 text-sm"
             style={{ backgroundColor: colors.indicatorTagBg, borderColor: colors.indicatorTagBorder }}
           >
             <span>Low Engagement</span>
             <Moon size={16} style={{ color: colors.iconLowEngagement }}/> {/* Using Moon icon */}
           </div>
        </div>
      </CardContent>
    </Card>
  );
}