import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Home, BarChart2, Package, LineChart, LogOut } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-[#18181B] border-r border-[#27272A] p-6 flex flex-col text-white">
      <div className="mb-10 mt-2">
        <Image src="/camarinlogo.svg" alt="Camarin Logo" width={120} height={28} />
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem href="/" icon={<Home size={20} />} label="Dashboard" active />
        <NavItem href="/sales" icon={<BarChart2 size={20} />} label="Sales" />
        <NavItem href="/sku" icon={<Package size={20} />} label="SKU" />
        <NavItem href="/insights" icon={<LineChart size={20} />} label="Insights" />
      </nav>

      <div className="mt-auto pt-4">
        <NavItem href="/logout" icon={<LogOut size={20} />} label="Logout" />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
        active
          ? "bg-[#3F3F46] text-white font-medium"
          : "text-gray-400 hover:text-gray-100 hover:bg-[#27272A]"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
}
