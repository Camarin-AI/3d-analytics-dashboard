// sidebar.tsx
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, BarChart2, Package, LineChart, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <div
      className="
        w-64 min-h-screen bg-[#18181B] p-6 flex flex-col text-white relative
        rounded-tr-2xl rounded-br-2xl
        /* sidebar outer glow with a fade at left/right */
        shadow-[0_0_30px_rgba(255,255,255,0.15),0_0_60px_rgba(255,255,255,0.08)]
      "
    >
      {/* optional gradient‐mask overlay to softly fade that halo on the far left & right */}
      <div
        className="pointer-events-none absolute inset-0 rounded-tr-2xl rounded-br-2xl"
        style={{
          background:
            "linear-gradient(to right, rgba(24,24,27,1) 0%, rgba(24,24,27,0) 10%, rgba(24,24,27,0) 90%, rgba(24,24,27,1) 100%)",
        }}
      />

      <div className="mb-10 mt-2 relative z-10">
        <Image
          src="/camarinlogo.svg"
          alt="Camarin Logo"
          width={120}
          height={28}
        />
      </div>

      <nav className="flex-1 space-y-2 relative z-10">
        <NavItem href="/" icon={<Home size={20} />} label="Dashboard" active />
        <NavItem href="/sales" icon={<BarChart2 size={20} />} label="Sales" />
        <NavItem href="/sku" icon={<Package size={20} />} label="SKU" />
        <NavItem href="/insights" icon={<LineChart size={20} />} label="Insights" />
      </nav>

      <div className="mt-auto pt-4 relative z-10">
        <NavItem href="/logout" icon={<LogOut size={20} />} label="Logout" />
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link href={href} className="relative block">
      {active && (
        <span
          className="absolute inset-y-0 left-0 w-full rounded-l-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 80%)",
            filter: "blur(12px)",
          }}
        />
      )}

      <a
        className={`
          relative flex items-center gap-3 px-4 py-2.5 transition-colors
          ${
            active
              ? `
                bg-[#3F3F46]
                text-white font-medium
                rounded-l-full
                /* crisp white edge glow */
                shadow-[0_0_4px_#fff,0_0_8px_#fff]
              `
              : `
                text-gray-400 hover:text-gray-100 hover:bg-[#27272A]
                rounded-lg
              `
          }
        `}
      >
        {icon}
        <span className="text-sm">{label}</span>
      </a>
    </Link>
  );
}
