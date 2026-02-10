import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { canCreate, canView } from '@/lib/permissions'

// GET /api/clients - List all clients
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!canView(session.user.role, 'clients')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // For client users, only show their own client
        const where = session.user.clientId
            ? { id: session.user.clientId }
            : {}

        const clients = await prisma.client.findMany({
            where,
            include: {
                projects: {
                    include: {
                        services: true
                    }
                },
                _count: {
                    select: {
                        projects: true,
                        invoices: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(clients)
    } catch (error) {
        console.error('Error fetching clients:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/clients - Create new client
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!canCreate(session.user.role, 'clients')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await req.json()
        const { companyName, contactEmail, contactPhone, industry, assignedTeam, billingAddress } = body

        if (!companyName || !contactEmail) {
            return NextResponse.json(
                { error: 'Company name and contact email are required' },
                { status: 400 }
            )
        }

        const client = await prisma.client.create({
            data: {
                companyName,
                contactEmail,
                contactPhone,
                industry,
                assignedTeam: assignedTeam || [],
                billingAddress,
                status: 'ONBOARDING'
            }
        })

        // Create onboarding checklist
        await prisma.onboardingChecklist.create({
            data: {
                clientId: client.id,
                checklistJson: {
                    items: [
                        { id: '1', label: 'Contract signed and uploaded', completed: false },
                        { id: '2', label: 'Scope of work defined', completed: false },
                        { id: '3', label: 'Payment plan established', completed: false },
                        { id: '4', label: 'Team members assigned', completed: false },
                        { id: '5', label: 'Initial project created', completed: false },
                        { id: '6', label: 'Drive folder structure created', completed: false }
                    ]
                },
                status: 'IN_PROGRESS'
            }
        })

        // Log activity
        await prisma.activityLog.create({
            data: {
                userId: session.user.id,
                action: 'CREATED_CLIENT',
                entityType: 'PROJECT',
                entityId: client.id,
                metadataJson: { companyName }
            }
        })

        return NextResponse.json(client, { status: 201 })
    } catch (error) {
        console.error('Error creating client:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
