"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, UserCheck, Building, Shield, Award } from "lucide-react"

const FormsPage = () => {
    const router = useRouter()

    const formCards = [
        {
            id: "certificate-application",
            title: "Certificate Application",
            description: "Apply for official certificates and documentation with our streamlined application process.",
            icon: <Award className="h-8 w-8 text-blue-600" />,
            route: "/forms/certificate-application-form",
            buttonText: "Apply Now",
            category: "Official Documents",
        },
        {
            id: "inquiry-form",
            title: "General Inquiry",
            description: "Submit your questions and inquiries. Our team will respond within 24 hours.",
            icon: <MessageSquare className="h-8 w-8 text-green-600" />,
            route: "/forms/inquiry-form",
            buttonText: "Submit Inquiry",
            category: "Support",
        },
        {
            id: "registration",
            title: "User Registration",
            description: "Create your account to access exclusive features and personalized services.",
            icon: <UserCheck className="h-8 w-8 text-purple-600" />,
            route: "#",
            buttonText: "Register",
            category: "Account",
        },
        {
            id: "business-application",
            title: "Business Application",
            description: "Apply for business licenses and permits through our comprehensive application system.",
            icon: <Building className="h-8 w-8 text-orange-600" />,
            route: "#",
            buttonText: "Apply for Business",
            category: "Business",
        },
        {
            id: "compliance-form",
            title: "Compliance Report",
            description: "Submit compliance reports and regulatory documentation securely and efficiently.",
            icon: <Shield className="h-8 w-8 text-red-600" />,
            route: "#",
            buttonText: "Submit Report",
            category: "Compliance",
        },
        {
            id: "document-request",
            title: "Document Request",
            description: "Request official documents, transcripts, and records with fast processing times.",
            icon: <FileText className="h-8 w-8 text-teal-600" />,
            route: "#",
            buttonText: "Request Documents",
            category: "Documents",
        },
    ]

    const handleNavigation = (route: string) => {
        router.push(route)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Forms & Applications</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Access all your forms and applications in one place. Choose from our comprehensive collection of digital
                        forms designed for efficiency and ease of use.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {formCards.map((form) => (
                        <Card
                            key={form.id}
                            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg"
                        >
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">{form.icon}</div>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {form.category}
                                    </span>
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                    {form.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-6">
                                <CardDescription className="text-gray-600 leading-relaxed">{form.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button
                                    onClick={() => handleNavigation(form.route)}
                                    className="w-full bg-primary hover:bg-primary text-white font-medium py-2.5 transition-colors duration-200"
                                    aria-label={`Navigate to ${form.title}`}
                                >
                                    {form.buttonText}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="mt-16 text-center">
                    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-gray-600 mb-4">
                            If you can not find the form you are looking for or need assistance, our support team is here to help.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => handleNavigation("/contact-us")}
                            className="border-primary-600 text-primary-600 hover:bg-primary-50"
                        >
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormsPage
