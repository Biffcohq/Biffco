import React from 'react'

export function Badge({ children, variant = 'gray', className = '' }: { children: React.ReactNode, variant?: 'gray' | 'green' | 'red' | 'blue', className?: string }) {
  const variants = {
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
