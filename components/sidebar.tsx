// Indicate this is a Client Component
"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Package, LineChart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { UserButton } from '@clerk/nextjs'

export function Sidebar() {
  const pathname = usePathname();
  // FIX 2: Initialize isMobile based on window presence for server-side rendering safety
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  // FIX 2: Default isCollapsed to true if mobile.
  const [isCollapsed, setIsCollapsed] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);


  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;

    const handleResize = () => {
      const mobile = checkMobile();
      setIsMobile(mobile);
      if (!mobile) { // Desktop
        setIsCollapsed(false); // Always open on desktop
      } else {
        // On mobile, keep current state unless it's the initial load scenario
        // The initial load is handled by the useState default
      }
    };

    // Set initial state correctly after mount
    const initialMobile = checkMobile();
    setIsMobile(initialMobile);
    setIsCollapsed(initialMobile); // Collapse by default on initial mobile load

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Hamburger menu toggle button - visible only on mobile */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="md:hidden fixed top-4 left-4 z-30 bg-zinc-800 p-2 rounded-md text-white"
        aria-label={isCollapsed ? "Open menu" : "Close menu"}
      >
        {/* FIX 2: If mobile and collapsed, show Menu icon to open. Otherwise (mobile and open), show X. */}
        {isMobile && isCollapsed ? <Menu size={24} /> : isMobile && !isCollapsed ? <X size={24} /> : null}
      </button>

      <div
        className={`
          ${isMobile ? (isCollapsed ? "translate-x-[-100%]" : "translate-x-0") : "translate-x-0"}
          w-64 min-h-screen bg-[#18181B] p-6 flex flex-col text-white relative
          rounded-tr-2xl rounded-br-2xl
          shadow-[0_0_30px_rgba(255,255,255,0.15),0_0_60px_rgba(255,255,255,0.08)]
          transition-transform duration-300 ease-in-out
          ${isMobile ? "fixed top-0 left-0 z-20" : ""}
        `}
      >
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
          <NavItem href="/" icon={<Home size={20} />} label="Dashboard" active={pathname === '/'} />
          <NavItem href="/sales" icon={<BarChart2 size={20} />} label="Sales" active={pathname === '/sales'} />
          <NavItem href="/sku" icon={<Package size={20} />} label="SKU" active={pathname === '/sku'} />
          <NavItem href="/insights" icon={<LineChart size={20} />} label="Insights" active={pathname === '/insights'} />
        </nav>

        <div className="mt-auto pt-4 relative z-10 flex justify-center">
          <UserButton afterSignOutUrl="/auth" appearance={{ elements: { userButtonAvatarBox: 'w-8 h-8', userButtonPopoverCard: 'bg-[#18181B] text-white' } }} />
        </div>
      </div>

      {/* Overlay backdrop for mobile, shown when sidebar is open */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10" // z-10 to be below sidebar (z-20)
          onClick={() => setIsCollapsed(true)}
          aria-hidden="true"
        />
      )}
    </>
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
    <Link href={href} className="relative block" passHref>
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-full rounded-l-full pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 80%)",
            filter: "blur(12px)",
          }}
        />
      )}
      <div
        className={`
          relative flex items-center gap-3 px-4 py-2.5 transition-colors rounded-lg
          ${
            active
              ? `
                bg-[#3F3F46]
                text-white font-medium
                rounded-l-full rounded-r-none 
                shadow-[0_0_4px_#fff,0_0_8px_#fff]
              `
              : `
                text-gray-400 hover:text-gray-100 hover:bg-[#27272A]
              `
          }
        `}
      >
        <span className="relative z-10">{icon}</span>
        <span className="relative z-10 text-sm">{label}</span>
      </div>
    </Link>
  );
}