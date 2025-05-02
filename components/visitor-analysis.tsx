"use client"
import { MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Instagram, Facebook, TwitterIcon as TikTok } from "lucide-react"

export function VisitorAnalysis() {
  const socialMediaIcons = {
    instagram: <Instagram size={20} />,
    google: <div className="font-bold text-xl">G</div>,
    whatsapp: <div className="font-bold text-xl">W</div>,
    facebook: <Facebook size={20} />,
    tiktok: <TikTok size={20} />,
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Mock data for the heatmap
  const heatmapData = [
    [0, 1, 2, 3, 2, 1, 0], // Instagram
    [1, 2, 1, 2, 1, 0, 0], // Google
    [0, 1, 1, 1, 2, 0, 0], // WhatsApp
    [1, 1, 2, 3, 1, 1, 0], // Facebook
    [0, 0, 2, 3, 3, 2, 0], // TikTok
  ]

  const getColorForValue = (value: number) => {
    switch (value) {
      case 0:
        return "bg-[#252525]" // Dark gray (almost invisible)
      case 1:
        return "bg-[#4A4AF8]/30" // Light purple
      case 2:
        return "bg-[#4A4AF8]/60" // Medium purple
      case 3:
        return "bg-[#4A4AF8]" // Bright purple
      default:
        return "bg-[#252525]"
    }
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#FFFFFF88] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-light font-sans">Visitor Analysis</CardTitle>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-8 gap-2">
            <div className="col-span-1"></div>
            {daysOfWeek.map((day, i) => (
              <div key={i} className="text-center text-xs text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {Object.entries(socialMediaIcons).map(([platform, icon], platformIndex) => (
            <div key={platform} className="grid grid-cols-8 gap-2">
              <div className="flex items-center justify-center">{icon}</div>
              {daysOfWeek.map((_, dayIndex) => (
                <motion.div
                  key={dayIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: (platformIndex * 7 + dayIndex) * 0.02 }}
                  className={`aspect-square rounded-md ${getColorForValue(heatmapData[platformIndex][dayIndex])}`}
                >
                  {platform === "tiktok" && dayIndex === 4 && (
                    <div className="absolute top-0 right-0 bg-white text-black text-xs px-1.5 py-0.5 rounded-sm transform translate-x-1/2 -translate-y-1/3">
                      453
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Total Visitors</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-[#252525] rounded-full"></span>
                  <span className="text-xs">0</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-[#4A4AF8]/30 rounded-full"></span>
                  <span className="text-xs">&lt;100</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-[#4A4AF8]/60 rounded-full"></span>
                  <span className="text-xs">&gt;100</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-[#4A4AF8] rounded-full"></span>
                  <span className="text-xs">&gt;500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
