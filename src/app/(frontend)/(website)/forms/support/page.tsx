"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function InquiryForm() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        subject: "",
        query: "",
    })
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            // console.log("Full API Response:", data);
            // console.log("Response status:", res.status);

            // Status 200-299 range successful hoti hai
            if (res.ok && data.message) {
                // toast({
                //     title: "✅ Inquiry Submitted",
                //     description: "Thank you! We have received your inquiry and will get back to you soon.",
                //     variant: "default",
                //     duration: 3000,
                // })
                setShowSuccessModal(true);

                // Form reset
                setFormData({
                    name: '',
                    email: '',
                    contact: '',
                    subject: '',
                    query: '',
                });
            } else {
                toast({
                    title: "❌ Submission Failed",
                    description: data.message || "Something went wrong while submitting your inquiry. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error("Error:", err);
            toast({
                title: "⚠️ Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive",
            });
        }
    };

    const handleCloseAndNavigate = () => {
        setShowSuccessModal(false);
        // Navigate to another form or page
        router.push('/forms');
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <div className=" max-w-3xl mx-3 md:mx-auto  mt-10 mb-20 py-12 px-3  md:px-15 bg-card  shadow-[10px_20px_10px] shadow-foreground/30 border-2 border-dashed border-primary-400 rounded-2xl ">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Inquiry Form</h1>
                <p className="text-gray-600">Please fill out all the required fields to submit your inquiry</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:primary-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                    <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                        Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="contact"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                        Subject <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("subject", value)} required>
                        <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            <SelectValue placeholder="Select inquiry subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="sales">Sales Question</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Query */}
                <div className="space-y-2">
                    <Label htmlFor="query" className="text-sm font-medium text-gray-700">
                        Query <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="query"
                        placeholder="Enter your detailed query"
                        value={formData.query}
                        onChange={(e) => handleInputChange("query", e.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                    <Button
                        type="submit"
                        className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200"
                    >
                        Submit Inquiry
                    </Button>
                </div>
            </form>

            {/* model-box */}

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="flex flex-col items-center justify-center space-y-4 py-8">
                    {/* Success Check Animation */}
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
                        <DialogTitle className="text-center text-green-600">Inquiry Submitted!</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 text-center">
                        Thank you! We have received your inquiry and will get back to you soon.
                    </p>
                    <Button onClick={handleCloseAndNavigate} className="mt-4">
                        Close
                    </Button>
                </DialogContent>
            </Dialog>

            {/* model-box-end */}

        </div>
    )
}
