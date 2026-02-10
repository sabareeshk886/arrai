import { UserRole } from '@prisma/client'

export type Permission = 'view' | 'create' | 'edit' | 'delete' | 'comment' | 'approve'

export type Resource =
    | 'clients'
    | 'projects'
    | 'services'
    | 'tasks'
    | 'files'
    | 'analytics'
    | 'users'
    | 'finance'

const PERMISSIONS: Record<UserRole, Record<string, Permission[]>> = {
    SUPER_ADMIN: {
        clients: ['view', 'create', 'edit', 'delete'],
        projects: ['view', 'create', 'edit', 'delete'],
        services: ['view', 'create', 'edit', 'delete'],
        tasks: ['view', 'create', 'edit', 'delete'],
        files: ['view', 'create', 'delete'],
        analytics: ['view'],
        users: ['view', 'create', 'edit', 'delete'],
        finance: ['view', 'create', 'edit', 'delete']
    },
    TEAM_MEMBER: {
        clients: ['view'],
        projects: ['view', 'edit'], // assigned only
        services: ['view', 'edit'], // assigned only
        tasks: ['view', 'create', 'edit'],
        files: ['view', 'create'],
        analytics: ['view'],
        users: ['view'],
        finance: ['view']
    },
    CLIENT: {
        clients: ['view'], // own only
        projects: ['view'], // own only
        services: ['view'], // own only
        tasks: ['view', 'comment'], // client-visible only
        files: ['view', 'create'],
        analytics: [],
        users: [],
        finance: []
    }
}

export function hasPermission(
    userRole: UserRole,
    resource: Resource,
    permission: Permission
): boolean {
    const rolePermissions = PERMISSIONS[userRole]
    const resourcePermissions = rolePermissions[resource] || []
    return resourcePermissions.includes(permission)
}

export function canView(userRole: UserRole, resource: Resource): boolean {
    return hasPermission(userRole, resource, 'view')
}

export function canCreate(userRole: UserRole, resource: Resource): boolean {
    return hasPermission(userRole, resource, 'create')
}

export function canEdit(userRole: UserRole, resource: Resource): boolean {
    return hasPermission(userRole, resource, 'edit')
}

export function canDelete(userRole: UserRole, resource: Resource): boolean {
    return hasPermission(userRole, resource, 'delete')
}
