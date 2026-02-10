'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewClientPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        companyName: '',
        contactEmail: '',
        contactPhone: '',
        industry: '',
        billingAddress: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to create client')
            }

            const client = await response.json()
            router.push(`/clients/${client.id}`)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/clients">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
                    <p className="text-gray-600 mt-1">Create a new client profile and start onboarding</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                    <CardDescription>Enter the basic details for the new client</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => handleChange('companyName', e.target.value)}
                                    placeholder="Acme Inc."
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                                    Contact Email <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                                    placeholder="contact@acme.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                                    Contact Phone
                                </label>
                                <Input
                                    id="contactPhone"
                                    type="tel"
                                    value={formData.contactPhone}
                                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="industry" className="text-sm font-medium text-gray-700">
                                    Industry
                                </label>
                                <Input
                                    id="industry"
                                    value={formData.industry}
                                    onChange={(e) => handleChange('industry', e.target.value)}
                                    placeholder="Technology, Retail, etc."
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="billingAddress" className="text-sm font-medium text-gray-700">
                                Billing Address
                            </label>
                            <textarea
                                id="billingAddress"
                                value={formData.billingAddress}
                                onChange={(e) => handleChange('billingAddress', e.target.value)}
                                placeholder="123 Main St, City, State, ZIP"
                                disabled={loading}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Client'}
                            </Button>
                            <Link href="/clients">
                                <Button type="button" variant="outline" disabled={loading}>
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
