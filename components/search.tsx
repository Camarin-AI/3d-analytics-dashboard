import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Search() {
  return (
    <div className="relative w-full">
      <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
      <Input
        type="text"
        placeholder="Search in site"
        className="pl-4 pr-10 bg-[#27272A] border border-transparent text-gray-100 h-10 rounded-md focus:bg-[#1F1F22] focus:border-[#4F4F52] focus:ring-0 placeholder:text-white-500"
      />
    </div>
  )
}
