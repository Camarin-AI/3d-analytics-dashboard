import { Bell } from "lucide-react"
import Image from "next/image"

export function Header() {
  return (
    <div className="flex items-center justify-end gap-6">
      <button className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
      </button>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-gray-400">Welcome back</p>
          <p className="font-medium text-white">John Doe</p>
        </div>
        <div className="w-9 h-9 rounded-full overflow-hidden">
          <Image
            src="https://avatar.vercel.sh/johndoe"
            alt="Profile"
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
