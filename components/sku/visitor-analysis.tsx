"use client";
import React, { useState } from "react"; 
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Instagram, Facebook, Zap as WhatsappIcon, Twitter as TikTokIcon } from "lucide-react"; 
import { useApiData } from "@/hooks/use-api-data";
import type { VisitorAnalysisData } from '@/lib/data-service';

// --- Color Palette (Based on Target Image) ---
const colors = {
    background: "#161618",
    cardBorder: "rgba(255, 255, 255, 0.4)",
    textPrimary: "#F4F4F5",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",
    tooltipBg: "#FFFFFF", 
    tooltipText: "#111113", 
    divider: "rgba(255, 255, 255, 0.1)", 
    cellLevel0: "#27272A", 
    cellLevel1: "#5F5DE6", 
    cellLevel2: "#7C7BFF", 
    cellLevel3: "#A09FFF", 
    gradientStart: "#27272A", 
    gradientMid: "#7C7BFF",   
    gradientEnd: "#A09FFF",   
};

// Custom Google Icon SVG
const GoogleIcon = ({size = 18, color = colors.textSecondary }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);

const fallbackData: VisitorAnalysisData = {
  platforms: ["Instagram", "Google", "WhatsApp", "Facebook", "TikTok"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  heatmapData: {
    Instagram: [50, 120, 20, 400, 280, 150, 80],
    Google: [80, 20, 150, 15, 180, 90, 60],
    WhatsApp: [300, 10, 120, 160, 20, 70, 40],
    Facebook: [100, 130, 8, 420, 10, 140, 50],
    TikTok: [20, 80, 24, 380, 453, 290, 10],
  },
};

export function VisitorAnalysis() {
  const [dateRange] = useState({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 0, 7),
  });
  const { data, loading, error } = useApiData<VisitorAnalysisData>({ endpoint: 'visitor-analysis', dateRange });
  const d: VisitorAnalysisData = (error ? fallbackData : (data || fallbackData));
  const isFallback = error;

  const [hoveredCell, setHoveredCell] = useState<{
    platform: string;
    day: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const socialMediaPlatforms = d.platforms;
  type Platform = typeof socialMediaPlatforms[number];

  const socialMediaIcons: Record<Platform, React.ReactNode> = {
    Instagram: <Instagram size={18} style={{ color: colors.textSecondary }}/>,
    Google: <GoogleIcon />,
    WhatsApp: <WhatsappIcon size={18} style={{ color: colors.textSecondary }}/>,
    Facebook: <Facebook size={18} style={{ color: colors.textSecondary }}/>,
    TikTok: <TikTokIcon size={18} style={{ color: colors.textSecondary }}/>,
  };

  const daysOfWeek = d.days;

  const heatmapDataValues: Record<Platform, number[]> = d.heatmapData;

  const heatmapColorLevels = socialMediaPlatforms.map(platform =>
    heatmapDataValues[platform].map(value => {
      if (value < 50) return 0;
      if (value < 150) return 1;
      if (value < 300) return 2;
      return 3;
    })
  );

  const getColorForLevel = (level: number) => {
    switch (level) {
      case 0: return colors.cellLevel0;
      case 1: return colors.cellLevel1;
      case 2: return colors.cellLevel2;
      case 3: return colors.cellLevel3;
      default: return colors.cellLevel0;
    }
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    platform: Platform,
    dayIndex: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredCell({
      platform: platform,
      day: daysOfWeek[dayIndex],
      value: heatmapDataValues[platform][dayIndex],
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  if (loading) return <div className="text-gray-400">Loading visitor analysis...</div>;

  return (
    <Card
        className="rounded-2xl border p-6 shadow-lg h-full flex flex-col font-[Inter,ui-sans-serif,system-ui] overflow-visible" // FIX 6: Added overflow-visible
        style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-5">
        <CardTitle className="text-xl font-light font-sans tracking-normal" style={{ color: colors.textPrimary }}>
            Visitor Analysis
        </CardTitle>
        <button className="focus:outline-none p-1 rounded-full hover:bg-[#27272A]" style={{ color: colors.textMuted }}>
            <MoreHorizontal size={18} />
        </button>
      </CardHeader>

      {/* Subtle warning if fallback is used */}
      {isFallback && (
        <div className="mb-2 flex items-center gap-2 text-xs text-yellow-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          Offline mode: showing fallback data
        </div>
      )}

      <CardContent className="p-0 flex-grow flex flex-col relative">
        <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-1.5">
          <div></div>
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-[11px] font-medium py-1" style={{color: colors.textSecondary}}>
              {day}
            </div>
          ))}

          {socialMediaPlatforms.map((platform, platformIndex) => (
            <React.Fragment key={platform}>
              <div className="flex items-center justify-center h-9 w-9 my-auto">
                {socialMediaIcons[platform]}
              </div>
              {heatmapColorLevels[platformIndex].map((level, dayIndex) => (
                <motion.div
                  key={`${platform}-${dayIndex}`}
                  className="aspect-square rounded-md cursor-default flex items-center justify-center relative"
                  style={{ backgroundColor: getColorForLevel(level) }}
                  onMouseEnter={(e) => handleMouseEnter(e, platform, dayIndex)}
                  onMouseLeave={handleMouseLeave}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: (platformIndex * 7 + dayIndex) * 0.015, ease: "easeOut" }}
                >
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t" style={{borderColor: colors.divider}}>
          <p className="text-xs font-medium mb-2" style={{color: colors.textSecondary}}>Total Visitors</p>
          <div className="w-full h-2.5 rounded-full"
               style={{ background: `linear-gradient(to right, ${colors.gradientStart}, ${colors.gradientMid}, ${colors.gradientEnd})` }}>
          </div>
          <div className="flex justify-between text-[10px] mt-1" style={{color: colors.textMuted}}>
            <span>{'<'} 100</span>
            <span>{'>'} 800</span>
          </div>
        </div>

        {hoveredCell && (
          <motion.div
            className="fixed p-2 rounded-md shadow-xl text-sm font-medium pointer-events-none" // FIX 6: Changed to 'fixed' for viewport positioning
            style={{
              backgroundColor: colors.tooltipBg,
              color: colors.tooltipText,
              left: hoveredCell.x, // x is already viewport-relative from getBoundingClientRect
              top: hoveredCell.y,  // y is already viewport-relative
              transform: 'translate(-50%, -115%)', // Position above and centered
              zIndex: 1000, // FIX 6: Increased z-index significantly
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3 h-3 transform translate-y-[7px] rotate-45"
                 style={{ backgroundColor: colors.tooltipBg }}/>
            {hoveredCell.platform} : {hoveredCell.value.toLocaleString()}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}