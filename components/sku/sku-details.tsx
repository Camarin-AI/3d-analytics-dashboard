"use client";

import { useState } from "react";
import { Calendar, MoreHorizontal } from "lucide-react"; // Removed AlertCircle as we'll use custom
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format } from "date-fns";
import { useApiData } from "@/hooks/use-api-data";
import type { SKUData } from '@/lib/data-service';

// Colors remain largely the same, slight tweaks if necessary based on re-evaluation
const colors = {
  background: "#161618",
  cardBorder: "rgba(255, 255, 255, 0.4)",
  textPrimary: "#FDFDFD",
  textSecondary: "#A1A1AA", // For labels like "SKU Name:"
  textMuted: "#808080",   // For "Daily Average" type labels in stats box
  dateRangeButtonBg: "#27272A",
  dateRangeButtonBorder: "rgba(255, 255, 255, 0.15)",
  dateRangeButtonText: "#D4D4D8",
  imageContainerBg: "#000000",
  statsBoxBorder: "rgba(255, 255, 255, 0.3)",
  statsSeparator: "rgba(255, 255, 255, 0.3)",
  statusAvailable: "#2DD4BF", // Teal/Green
  categoryTagBg: "#27272A",
  categoryTagBorder: "rgba(255, 255, 255, 0.3)", // Slightly more visible border for tags
  categoryTagText: "#A1A1AA",
  indicatorTagBg: "#27272A",
  indicatorTagBorder: "rgba(255, 255, 255, 0.3)", // Slightly more visible border for tags
  indicatorTagText: "#E4E4E7",
  iconHighCTR: "#2DD4BF",
  iconNeedsPromotion: "#FBBF24", // Amber/Yellow
  iconLowEngagement: "#60A5FA", // Blue
};

const fallbackSkuData: SKUData = {
  name: "Diamond Cut Earrings",
  id: "ID140001",
  stock: "Available",
  listed: "Yes",
  digitised: "Yes",
  price: 1050,
  categories: ["Earrings", "Diamond"],
  thisWeekSales: 8459,
  dailyAverage: 1650,
  conversionRate: 71,
  averageCTR: 2.3,
  imageSrc: "/diamond-earrings.png",
};

// Custom SVG Icon for High CTR (Target-like) - from previous version
const HighCTRIcon = ({ color = colors.iconHighCTR, size = 20 }) => ( // Increased size slightly
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.8"/>
    <circle cx="10" cy="10" r="5.5" stroke={color} strokeWidth="1.8"/>
    <circle cx="10" cy="10" r="2" fill={color}/>
  </svg>
);


// Custom SVG Icon for Needs Promotion (Yellow circle with exclamation)
const NeedsPromotionIcon = ({ color = colors.iconNeedsPromotion, size = 20 }) => ( // Increased size slightly
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" fill={color}/>
    <path d="M10.0002 13.1667C10.4604 13.1667 10.8335 12.7936 10.8335 12.3333C10.8335 11.8731 10.4604 11.5 10.0002 11.5C9.54001 11.5 9.16687 11.8731 9.16687 12.3333C9.16687 12.7936 9.54001 13.1667 10.0002 13.1667Z" fill="white"/>
    <path d="M10.8335 10V6.66667H9.16687V10H10.8335Z" fill="white"/>
  </svg>
);

// Custom SVG Icon for Low Engagement (Zz) - from previous version
const LowEngagementZzIcon = ({ color = colors.iconLowEngagement, size = 22 }) => ( // Increased size slightly
  <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.16191 5.83191L4 8.99382H5.99025L9.15217 5.83191H7.16191Z" fill={color}/>
    <path d="M10.1619 8.83191L7 11.9938H8.99025L12.1522 8.83191H10.1619Z" fill={color}/>
  </svg>
);

export function SkuDetails() {
  const [dateRange] = useState({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 0, 7),
  });
  const { data, loading, error } = useApiData<SKUData>({ endpoint: 'sku-data', dateRange });
  const skuData: SKUData = (error ? fallbackSkuData : (data || fallbackSkuData));
  const isFallback = error;

  const detailItems = [
    { key: "name", label: "SKU Name:", value: skuData.name, valueColor: colors.textPrimary, valueFontWeight: "font-medium", multilineValue: true, maxWidth: "max-w-[170px]" },
    { key: "id", label: "SKU ID:", value: skuData.id, valueColor: colors.textPrimary, valueFontWeight: "font-medium" },
    { key: "stock", label: "Stock :", value: skuData.stock, valueColor: colors.statusAvailable, valueFontWeight: "font-medium" },
    { key: "listed", label: "Listed :", value: skuData.listed, valueColor: colors.statusAvailable, valueFontWeight: "font-medium" },
    { key: "digitised", label: "Digitised :", value: skuData.digitised, valueColor: colors.statusAvailable, valueFontWeight: "font-medium" },
  ];

  if (loading) return <div className="text-gray-400">Loading SKU details...</div>;

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
        <CardTitle className="text-2xl font-light font-sans tracking-wide" style={{ color: colors.textPrimary }}>
          SKU Details
        </CardTitle>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3.5 rounded-lg text-sm font-normal border focus:outline-none focus:ring-1 focus:ring-gray-500 hover:bg-[#38383d]"
            style={{
              backgroundColor: colors.dateRangeButtonBg,
              borderColor: colors.dateRangeButtonBorder,
              color: colors.dateRangeButtonText,
            }}
          >
            <Calendar className="mr-2 h-4 w-4" style={{ color: colors.textSecondary }} />
            {format(dateRange.from, "dd, MMM, yyyy")} - {format(dateRange.to, "dd, MMM, yyyy")}
          </Button>
          <button className="focus:outline-none p-1" style={{ color: colors.textSecondary }}>
            <MoreHorizontal size={24} />
          </button>
        </div>
      </CardHeader>

      {/* Subtle warning if fallback is used */}
      {isFallback && (
        <div className="mb-2 flex items-center gap-2 text-xs text-yellow-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          Offline mode: showing fallback data
        </div>
      )}

      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="flex flex-col md:flex-row gap-x-6 lg:gap-x-8 mb-6"> {/* Adjusted gap */}
          
          {/* Left Column: Image + Stats Box */}
          {/* Fixed width for this column to match image proportion */}
          <div className="w-full md:w-[280px] flex flex-col gap-5 flex-shrink-0">
            {/* Adjusted height for image container */}
            <div 
              className="h-[220px] w-full rounded-xl overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: colors.imageContainerBg }}
            >
              <Image
                src={skuData.imageSrc}
                alt={skuData.name}
                width={300}
                height={300}
                className="object-contain"
                priority
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/250?text=Image+Err'; }}
              />
            </div>

            <div
              className="rounded-xl border p-4 flex flex-col"
              style={{ borderColor: colors.statsBoxBorder, backgroundColor: colors.background }}
            >
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-light" style={{ color: colors.textSecondary }}>This Week</span>
                <span className="text-xl font-semibold text-sans" style={{ color: colors.textPrimary }}>
                  INR {skuData.thisWeekSales.toLocaleString("en-IN")}
                </span>
              </div>
              <hr className="border-t my-2" style={{ borderColor: colors.statsSeparator }} />
              <div className="flex justify-between items-center p-0.5">
                <div className="text-center">
                  <span className="block text-xs mb-0.5" style={{ color: colors.textMuted }}>Daily Average</span>
                  <span className="block text-sm font-light" style={{ color: colors.textPrimary }}>
                    INR {skuData.dailyAverage.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-xs mb-0.5" style={{ color: colors.textMuted }}>Conversion Rate</span>
                  <span className="block text-sm font-light" style={{ color: colors.textPrimary }}>
                    {skuData.conversionRate}%
                  </span>
                </div>
                 <div className="text-center">
                  <span className="block text-xs mb-0.5" style={{ color: colors.textMuted }}>Average CTR</span>
                  <span className="block text-sm font-light" style={{ color: colors.textPrimary }}>
                    {skuData.averageCTR}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: SKU Details + Categories */}
          <div className="flex-1 flex flex-col pt-1 mt-4 md:mt-0">
             <div className="space-y-3"> {/* Adjusted vertical spacing */}
                {detailItems.map(item => (
                  <div className="flex items-start gap-2" key={item.key}>
                      <span className="w-24 text-xl text-light text-sans flex-shrink-0 pt-px" style={{color: colors.textSecondary}}>{item.label}</span>
                      <span 
                        className={`text-xl ${item.valueFontWeight} ${item.multilineValue ? 'leading-snug' : ''} ${item.maxWidth || ''}`}
                        style={{color: item.valueColor}}
                      >
                        {item.value}
                      </span>
                  </div>
                ))}
             </div>

             <div className="flex items-baseline gap-2 mt-4"> {/* Margin top for separation */}
                <span className="w-24 text-xl text-light text-sans flex-shrink-0 pt-px" style={{color: colors.textSecondary}}>Listing Price :</span>
                <span className="text-xl font-semibold" style={{color: colors.textPrimary}}>
                    INR {skuData.price.toLocaleString("en-IN")}
                </span>
            </div>

            <div className="mt-4"> {/* Margin top for separation */}
              <div className="flex items-start gap-2"> {/* items-start for alignment if categories wrap */}
                <span className="w-24 text text-light text-sans flex-shrink-0 pt-px" style={{ color: colors.textSecondary }}>Categories :</span>
                <div className="inline-flex flex-wrap gap-1.5">
                  {skuData.categories.map((category) => (
                    <span
                      key={category}
                      className="text-sm px-2.5 py-[3px] rounded-full border" // Adjusted padding for small tags
                      style={{
                        backgroundColor: colors.categoryTagBg,
                        borderColor: colors.categoryTagBorder,
                        color: colors.categoryTagText,
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Indicator Tags */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6"> {/* Increased pt */}
           {[
             { text: "High CTR", IconComponent: HighCTRIcon, iconColor: colors.iconHighCTR },
             { text: "Needs Promotion", IconComponent: NeedsPromotionIcon, iconColor: colors.iconNeedsPromotion },
             { text: "Low Engagement", IconComponent: LowEngagementZzIcon, iconColor: colors.iconLowEngagement },
           ].map(({ text, IconComponent, iconColor }) => (
             <div
               key={text}
               className="flex-1 flex items-center justify-center gap-2 border rounded-xl px-4 py-2 text-sm font-normal" // rounded-xl, font-normal
               style={{ 
                 backgroundColor: colors.indicatorTagBg, 
                 borderColor: colors.indicatorTagBorder,
                 color: colors.indicatorTagText,
               }}
             >
               <span>{text}</span>
               <IconComponent /> {/* Color and size are now default in SVG definition */}
             </div>
           ))}
        </div>
      </CardContent>
    </Card>
  );
}