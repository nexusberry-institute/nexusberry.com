import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, UserCheck, Award } from "lucide-react"

const formCards = [
    {
        id: "certificate-application",
        title: "Certificate Application",
        description: "Apply for official certificates and documentation with our streamlined application process.",
        icon: <Award className="h-8 w-8 text-blue-600" />,
        route: "/forms/certificate",
        buttonText: "Apply Now",
        category: "Official Documents",
    },
    {
        id: "support",
        title: "General Support",
        description: "Submit your questions and inquiries. Our team will respond within 24 hours.",
        icon: <MessageSquare className="h-8 w-8 text-green-600" />,
        route: "/forms/support",
        buttonText: "Submit Inquiry",
        category: "Support",
    },
    {
        id: "admission",
        title: "Admission Form",
        description: "Apply for admission to our programs and courses with a quick and easy application.",
        icon: <UserCheck className="h-8 w-8 text-purple-600" />,
        route: "/forms/admission",
        buttonText: "Apply Now",
        category: "Admissions",
    },
]

const FormsPage = () => {
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
                                    asChild
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 transition-colors duration-200"
                                >
                                    <Link href={form.route} aria-label={`Navigate to ${form.title}`}>
                                        {form.buttonText}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default FormsPage
