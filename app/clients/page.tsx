import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, Building2, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export default async function ClientsPage() {
    const session = await auth()

    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            projects: {
                include: {
                    services: true
                }
            },
            _count: {
                select: {
                    projects: true
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600 mt-1">Manage your client relationships</p>
                </div>
                <Link href="/clients/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => {
                    const activeProjects = client.projects.filter(p => p.status === 'IN_PROGRESS').length
                    const totalServices = client.projects.reduce((sum, p) => sum + p.services.length, 0)
                    const completedServices = client.projects.reduce(
                        (sum, p) => sum + p.services.filter(s => s.status === 'COMPLETED').length,
                        0
                    )

                    return (
                        <Card key={client.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                            <Building2 className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{client.companyName}</CardTitle>
                                            <StatusBadge status={client.status} size="sm" />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate">{client.contactEmail}</span>
                                    </div>
                                    {client.contactPhone && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            <span>{client.contactPhone}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{client._count.projects}</div>
                                        <div className="text-xs text-gray-500">Projects</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{activeProjects}</div>
                                        <div className="text-xs text-gray-500">Active</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{completedServices}</div>
                                        <div className="text-xs text-gray-500">Done</div>
                                    </div>
                                </div>

                                <Link href={`/clients/${client.id}`} className="block">
                                    <Button variant="outline" className="w-full">
                                        View Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )
                })}

                {clients.length === 0 && (
                    <div className="col-span-full">
                        <Card className="p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Building2 className="h-10 w-10 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">No clients yet</h3>
                                    <p className="text-gray-600 mt-1">Get started by adding your first client</p>
                                </div>
                                <Link href="/clients/new">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Client
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
