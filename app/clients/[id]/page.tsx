import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Building2, Mail, Phone, MapPin, FolderKanban, CheckCircle2 } from 'lucide-react'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    const { id } = await params

    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            projects: {
                include: {
                    services: true,
                    milestones: true
                },
                orderBy: { createdAt: 'desc' }
            },
            onboardingChecklist: true,
            invoices: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })

    if (!client) {
        notFound()
    }

    const totalServices = client.projects.reduce((sum: number, p: any) => sum + p.services.length, 0)
    const completedServices = client.projects.reduce(
        (sum: number, p: any) => sum + p.services.filter((s: any) => s.status === 'COMPLETED').length,
        0
    )
    const progress = totalServices > 0 ? Math.round((completedServices / totalServices) * 100) : 0

    const checklist = client.onboardingChecklist?.checklistJson as any
    const checklistItems = checklist?.items || []
    const completedItems = checklistItems.filter((item: any) => item.completed).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{client.companyName}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <StatusBadge status={client.status} />
                            {client.industry && (
                                <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                                    {client.industry}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <div className="font-medium">{client.contactEmail}</div>
                        </div>
                    </div>
                    {client.contactPhone && (
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <div>
                                <div className="text-sm text-gray-500">Phone</div>
                                <div className="font-medium">{client.contactPhone}</div>
                            </div>
                        </div>
                    )}
                    {client.billingAddress && (
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                                <div className="text-sm text-gray-500">Address</div>
                                <div className="font-medium">{client.billingAddress}</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Onboarding Progress */}
            {client.status === 'ONBOARDING' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Onboarding Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ProgressBar
                            value={(completedItems / checklistItems.length) * 100}
                            label="Overall Progress"
                            variant="default"
                        />
                        <div className="space-y-2">
                            {checklistItems.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                        }`}>
                                        {item.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                                    </div>
                                    <span className={item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Projects */}
            <Card>
                <CardHeader>
                    <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    {client.projects.length > 0 ? (
                        <div className="space-y-4">
                            {client.projects.map((project: any) => (
                                <div
                                    key={project.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                            {project.description && (
                                                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                            )}
                                            <div className="flex gap-3 mt-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FolderKanban className="h-4 w-4" />
                                                    <span>{project.services.length} services</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span>
                                                        {project.services.filter((s: any) => s.status === 'COMPLETED').length} completed
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <StatusBadge status={project.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <FolderKanban className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No projects yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
