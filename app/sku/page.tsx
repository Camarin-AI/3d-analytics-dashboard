import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SkuAnalytics } from "@/components/sku-analytics"

export default function SKU() {
  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        <div className="mt-6">
          <SkuAnalytics />
        </div>
      </main>
    </div>
  )
}
