import * as React from "react"
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", variant = 'default', ...props }, ref) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  }
  return <button ref={ref} className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
})
Button.displayName = "Button"
