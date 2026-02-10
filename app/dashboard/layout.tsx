import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    // Redirect clients to their specific dashboard
    if (session.user.role === UserRole.CLIENT) {
        redirect('/client/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white text-lg font-bold">A</span>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">Arrai CRM</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">{session.user.name || session.user.email}</span>
                            <form action={async () => {
                                'use server'
                                const { signOut } = await import('@/auth')
                                await signOut()
                            }}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
                    <nav className="p-4 space-y-2">
                        <a
                            href="/dashboard"
                            className="block px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md"
                        >
                            Dashboard
                        </a>
                        <a
                            href="/clients"
                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                            Clients
                        </a>
                        <a
                            href="/projects"
                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                            Projects
                        </a>
                        {session.user.role === UserRole.SUPER_ADMIN && (
                            <a
                                href="/analytics"
                                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                                Analytics
                            </a>
                        )}
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
