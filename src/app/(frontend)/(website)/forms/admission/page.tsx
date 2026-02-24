'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export default function AdmissionForm() {
    const [formData, setFormData] = useState({ name: '', date: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formId, setFormId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchFormId = async () => {
            try {
                const response = await fetch('/api/forms?where[slug][equals]=registration-form')
                const result = await response.json()
                if (result.docs && result.docs.length > 0) {
                    setFormId(result.docs[0].id)
                }
            } catch {
                toast({
                    title: 'Error',
                    description: 'Failed to load form. Please refresh the page.',
                    variant: 'destructive',
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchFormId()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formId) {
            toast({
                title: 'Error',
                description: 'Form configuration not found. Please refresh the page.',
                variant: 'destructive',
            })
            return
        }

        setIsSubmitting(true)

        const payload = {
            form: formId,
            submissionData: Object.entries(formData).map(([field, value]) => ({
                field,
                value,
            })),
        }

        try {
            const response = await fetch('/api/form-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (!response.ok) {
                toast({
                    title: 'Submission Failed',
                    description: result?.message || 'Please try again later.',
                    variant: 'destructive',
                })
                return
            }

            setShowSuccessModal(true)
            setFormData({ name: '', date: '' })
        } catch {
            toast({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCloseAndNavigate = () => {
        setShowSuccessModal(false)
        router.push('/forms')
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const inputClassName = "w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-3 md:mx-auto mt-10 mb-20 py-12 px-3 md:px-16 bg-card shadow-[10px_20px_10px] shadow-foreground/30 border-2 border-dashed border-primary-400 rounded-2xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-600">Loading form...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-3 md:mx-auto mt-10 mb-20 py-12 px-3 md:px-16 bg-card shadow-[10px_20px_10px] shadow-foreground/30 border-2 border-dashed border-primary-400 rounded-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Admission Form</h1>
                <p className="text-gray-600">Please fill out all the required fields to submit your admission application</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className={inputClassName}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                        Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                        className={inputClassName}
                    />
                </div>

                <div className="flex justify-center pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </div>
            </form>

            <Dialog open={showSuccessModal} onOpenChange={handleCloseAndNavigate}>
                <DialogContent className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <DialogHeader>
                        <DialogTitle className="text-center text-green-600">Application Submitted!</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 text-center">
                        Thank you! We have received your admission application and will get back to you soon.
                    </p>
                    <Button onClick={handleCloseAndNavigate} className="mt-4">
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
