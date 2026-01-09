import * as React from "react"
// Slot removed
import { cn } from "../lib/utils"

// --- Button ---
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'brand' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'brand', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-transform duration-100",
                    {
                        'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/25': variant === 'brand',
                        'border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900': variant === 'outline',
                        'hover:bg-slate-100 text-slate-700': variant === 'ghost',
                        'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-12 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

// --- Input ---
export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && <label className="text-sm font-medium text-slate-700 ml-1">{label}</label>}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = "Input"

// --- Card ---
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("rounded-2xl border border-slate-100 bg-white text-slate-950 shadow-sm", className)}
            {...props}
        />
    )
)
Card.displayName = "Card"

export { Button, Input, Card }
