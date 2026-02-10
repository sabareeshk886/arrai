'use client'

import { ServiceStatus } from '@prisma/client'
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
    status: ServiceStatus | string
    size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<string, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive', label: string }> = {
    TODO: { variant: 'secondary', label: 'To Do' },
    IN_PROGRESS: { variant: 'default', label: 'In Progress' },
    WAITING: { variant: 'warning', label: 'Waiting' },
    APPROVED: { variant: 'success', label: 'Approved' },
    COMPLETED: { variant: 'success', label: 'Completed' },
    ONBOARDING: { variant: 'warning', label: 'Onboarding' },
    ACTIVE: { variant: 'success', label: 'Active' },
    INACTIVE: { variant: 'secondary', label: 'Inactive' },
    ARCHIVED: { variant: 'destructive', label: 'Archived' },
    PLANNING: { variant: 'secondary', label: 'Planning' },
    ON_HOLD: { variant: 'warning', label: 'On Hold' },
    CANCELLED: { variant: 'destructive', label: 'Cancelled' }
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status] || { variant: 'default' as const, label: status }

    return (
        <Badge variant={config.variant} className={size === 'sm' ? 'text-xs px-2 py-0.5' : ''}>
            {config.label}
        </Badge>
    )
}
