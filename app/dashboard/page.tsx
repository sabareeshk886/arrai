import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FolderKanban, CheckCircle2, Clock } from 'lucide-react'

export default async function DashboardPage() {
    const session = await auth()

    // Fetch dashboard stats
    const [totalClients, activeProjects, completedServices, pendingTasks] = await Promise.all([
        prisma.client.count({ where: { status: 'ACTIVE' } }),
        prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.service.count({ where: { status: 'COMPLETED' } }),
        prisma.task.count({ where: { status: { in: ['TODO', 'IN_PROGRESS'] } } })
    ])

    // Fetch recent activity
    const recentProjects = await prisma.project.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
            client: true,
            services: true
        }
    })

    const stats = [
        {
            title: 'Active Clients',
            value: totalClients,
            icon: Users,
            description: 'Currently engaged',
            color: 'text-blue-600'
        },
        {
            title: 'Active Projects',
            value: activeProjects,
            icon: FolderKanban,
            description: 'In progress',
            color: 'text-green-600'
        },
        {
            title: 'Completed Services',
            value: completedServices,
            icon: CheckCircle2,
            description: 'Total delivered',
            color: 'text-purple-600'
        },
        {
            title: 'Pending Tasks',
            value: pendingTasks,
            icon: Clock,
            description: 'Awaiting completion',
            color: 'text-orange-600'
        }
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {session?.user.name}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-5 w-5 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Recent Projects */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>Latest updates across your projects</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                    <p className="text-sm text-gray-600">{project.client.companyName}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                            {project.services.length} services
                                        </span>
                                    </div>
                                </div>
                                <a
                                    href={`/projects/${project.id}`}
                                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                    View
                                </a>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
