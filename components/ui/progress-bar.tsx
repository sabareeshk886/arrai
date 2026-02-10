'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
    value: number // 0-100
    label?: string
    showPercentage?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function ProgressBar({
    value,
    label,
    showPercentage = true,
    size = 'md',
    variant = 'default'
}: ProgressBarProps) {
    const clampedValue = Math.min(100, Math.max(0, value))

    const heights = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4'
    }

    const colors = {
        default: 'bg-blue-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-500',
        danger: 'bg-red-600'
    }

    return (
        <div className="w-full">
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
                    {showPercentage && (
                        <span className="text-sm font-semibold text-gray-800">{clampedValue}%</span>
                    )}
                </div>
            )}
            <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[size])}>
                <div
                    className={cn('h-full rounded-full transition-all duration-300', colors[variant])}
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
        </div>
    )
}
