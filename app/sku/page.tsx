import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
// import { SkuPage } from "@/components/sku-page"

export default function SKU() {
  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        <div className="mt-6">
          {/* <SkuPage /> */}
        </div>
      </main>
    </div>
  )
}
