import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { canView } from '@/lib/permissions'

// GET /api/clients/:id - Get client details
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!canView(session.user.role, 'clients')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { id } = params

        // Check client access for client users
        if (session.user.clientId && session.user.clientId !== id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                projects: {
                    include: {
                        services: {
                            include: {
                                assignments: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                email: true,
                                                avatar: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        milestones: true
                    }
                },
                onboardingChecklist: true,
                invoices: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                paymentPlan: true
            }
        })

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 })
        }

        return NextResponse.json(client)
    } catch (error) {
        console.error('Error fetching client:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
