import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeaderProps {
  title: string
  children?: React.ReactNode
  className?: string
}

function Header({ title, children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4",
        className
      )}
    >
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
      {children && (
        <div className="flex items-center gap-3">{children}</div>
      )}
    </header>
  )
}

export { Header }
