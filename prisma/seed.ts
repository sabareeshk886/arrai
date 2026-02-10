import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@arrai.com' },
        update: {},
        create: {
            email: 'admin@arrai.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'SUPER_ADMIN'
        }
    })

    console.log('✅ Created admin user:', admin.email)

    // Create demo team member
    const teamPassword = await bcrypt.hash('team123', 10)

    const teamMember = await prisma.user.upsert({
        where: { email: 'team@arrai.com' },
        update: {},
        create: {
            email: 'team@arrai.com',
            name: 'Team Member',
            password: teamPassword,
            role: 'TEAM_MEMBER'
        }
    })

    console.log('✅ Created team member:', teamMember.email)

    // Create demo client
    const demoClient = await prisma.client.upsert({
        where: { contactEmail: 'contact@idk.com' },
        update: {},
        create: {
            companyName: 'IDK Kitchen',
            contactEmail: 'contact@idk.com',
            contactPhone: '+91 98765 43210',
            industry: 'Food & Beverage',
            status: 'ACTIVE',
            assignedTeam: [admin.id]
        }
    })

    console.log('✅ Created demo client:', demoClient.companyName)

    // Create client user
    const clientPassword = await bcrypt.hash('client123', 10)

    const clientUser = await prisma.user.upsert({
        where: { email: 'client@idk.com' },
        update: {},
        create: {
            email: 'client@idk.com',
            name: 'IDK Client User',
            password: clientPassword,
            role: 'CLIENT'
        }
    })

    await prisma.clientUserAccess.upsert({
        where: { userId: clientUser.id },
        update: {},
        create: {
            userId: clientUser.id,
            clientId: demoClient.id
        }
    })

    console.log('✅ Created client user:', clientUser.email)

    // Create demo project
    const demoProject = await prisma.project.create({
        data: {
            clientId: demoClient.id,
            name: 'Brand Refresh & Digital Presence',
            description: 'Complete rebranding and website development project',
            status: 'IN_PROGRESS',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-06-30')
        }
    })

    console.log('✅ Created demo project:', demoProject.name)

    // Create demo services
    const brandingService = await prisma.service.create({
        data: {
            projectId: demoProject.id,
            type: 'BRANDING',
            name: 'Brand Identity Design',
            description: 'Logo, color palette, typography, brand guidelines',
            status: 'COMPLETED',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-02-28')
        }
    })

    const websiteService = await prisma.service.create({
        data: {
            projectId: demoProject.id,
            type: 'WEBSITE',
            name: 'Website Development',
            description: 'Full-stack website with CMS integration',
            status: 'IN_PROGRESS',
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-05-31')
        }
    })

    console.log('✅ Created demo services')

    // Create onboarding checklist
    await prisma.onboardingChecklist.create({
        data: {
            clientId: demoClient.id,
            status: 'COMPLETED',
            checklistJson: {
                items: [
                    { id: '1', label: 'Contract signed and uploaded', completed: true },
                    { id: '2', label: 'Scope of work defined', completed: true },
                    { id: '3', label: 'Payment plan established', completed: true },
                    { id: '4', label: 'Team members assigned', completed: true },
                    { id: '5', label: 'Initial project created', completed: true },
                    { id: '6', label: 'Drive folder structure created', completed: true }
                ]
            }
        }
    })

    console.log('✅ Created onboarding checklist')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\nLogin credentials:')
    console.log('Admin: admin@arrai.com / admin123')
    console.log('Team: team@arrai.com / team123')
    console.log('Client: client@idk.com / client123')
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
