"use client"

import { MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ConversionRates() {
  const conversionData = {
    withEmbeds: 85,
    withoutEmbeds: 65,
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Conversion Rates</CardTitle>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[250px]">
          <div className="relative w-full h-48 flex items-end justify-center gap-16">
            <div className="flex flex-col items-center">
              <motion.div
                className="w-8 bg-[#4AE3F8] rounded-t-md"
                initial={{ height: 0 }}
                animate={{ height: conversionData.withEmbeds * 1.5 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <div className="mt-2 text-sm text-center">
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-3 h-3 rounded-full bg-[#4AE3F8]"></span>
                  <span>With Embeds</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <motion.div
                className="w-8 bg-[#F59E0B] rounded-t-md"
                initial={{ height: 0 }}
                animate={{ height: conversionData.withoutEmbeds * 1.5 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
              <div className="mt-2 text-sm text-center">
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                  <span>Without Embeds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
