'use client'

import React, { useState, useEffect } from 'react'

const SimpleContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState('')
    const [formId, setFormId] = useState<string | null>(null)
    const [formFields, setFormFields] = useState([])

    useEffect(() => {
        const fetchFormId = async () => {
            try {
                const response = await fetch('/api/forms?where[slug][equals]=registration-form')
                const result = await response.json()
                console.log('Form data:', result) // Debug log
                if (result.docs && result.docs.length > 0) {
                    setFormId(result.docs[0].id)
                    setFormFields(result.docs[0].fields)
                    console.log('Form fields:', result.docs[0].fields) // Debug log
                }
            } catch (error) {
                console.error('Error fetching form:', error)
            }
        }
        fetchFormId()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formId) {
            setError('Form not found')
            return
        }

        setStatus('loading')
        setError('')

        const payload = {
            form: formId,
            submissionData: Object.entries(formData).map(([field, value]) => ({
                field,
                value,
            })),
        }

        console.log('Sending payload (Format 1):', payload)

        try {
            const response = await fetch('/api/form-submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (!response.ok) {
                console.error('Form submission error:', result)
                setStatus('error')
                setError(result?.message || 'Submission failed')
                return
            }

            console.log('Submission success:', result)
            setStatus('success')
            setFormData({ name: '', email: '', phone: '', message: '' })
        } catch (error) {
            console.error('Form submission error:', error)
            setStatus('error')
            setError('Something went wrong. Please try again.')
        }
    }

    if (!formId) {
        return <div>Loading form...</div>
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div>
                <label className="block mb-1" htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1" htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    type="number"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block mb-1" htmlFor="message">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message || ''}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border rounded p-2"
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className={`px-4 py-2 rounded text-white ${status === 'loading' ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600'}`}
            >
                {status === 'loading' ? 'Submitting...' : 'Submit'}
            </button>

            {status === 'success' && <p className="text-green-600">Submitted successfully!</p>}
            {status === 'error' && <p className="text-red-600">{error || 'Something went wrong.'}</p>}
        </form>

    )
}

export default SimpleContactForm