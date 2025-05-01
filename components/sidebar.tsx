// Indicate this is a Client Component
"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
// Import usePathname hook
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Package, LineChart, LogOut } from "lucide-react";

export function Sidebar() {
  // Get the current path
  const pathname = usePathname();

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

      {/* Make NavItems active state dynamic */}
      <nav className="flex-1 space-y-2 relative z-10">
        <NavItem href="/" icon={<Home size={20} />} label="Dashboard" active={pathname === '/'} />
        <NavItem href="/sales" icon={<BarChart2 size={20} />} label="Sales" active={pathname === '/sales'} />
        <NavItem href="/sku" icon={<Package size={20} />} label="SKU" active={pathname === '/sku'} />
        <NavItem href="/insights" icon={<LineChart size={20} />} label="Insights" active={pathname === '/insights'} />
      </nav>

      <div className="mt-auto pt-4 relative z-10">
        {/* Logout might not need an active state, but you can add it if needed */}
        <NavItem href="/logout" icon={<LogOut size={20} />} label="Logout" active={pathname === '/logout'} />
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean; // Keep this optional
}

// No changes needed in NavItem component itself
function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link href={href} className="relative block" passHref>
      {/* This span creates the blurred background effect */}
      {active && (
        <span
          aria-hidden="true" // Better for accessibility
          className="absolute inset-y-0 left-0 w-full rounded-l-full pointer-events-none" // Added pointer-events-none
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 80%)",
            filter: "blur(12px)",
            // You might want to add a slight z-index if layering becomes an issue, e.g., zIndex: -1
          }}
        />
      )}

      {/* Using <a> tag here ensures styles apply correctly, especially with the glow effect */}
      <div // Changed from <a> to <div> as Link handles the anchor tag itself. Use div for styling container.
        className={`
          relative flex items-center gap-3 px-4 py-2.5 transition-colors rounded-lg // Base styles apply to all, rounded-lg by default
          ${
            active
              ? `
                bg-[#3F3F46]
                text-white font-medium
                rounded-l-full rounded-r-none // Override rounding for active state
                /* crisp white edge glow */
                shadow-[0_0_4px_#fff,0_0_8px_#fff]
              `
              : `
                text-gray-400 hover:text-gray-100 hover:bg-[#27272A]
                // Keep rounded-lg for non-active items
              `
          }
        `}
      >
        {/* Ensure icon and text are above the potential blur span if z-index issues arise */}
        <span className="relative z-10">{icon}</span>
        <span className="relative z-10 text-sm">{label}</span>
      </div>
    </Link>
  );
}