import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link" // Corrected import for Link
import { Code, Smartphone, Brain, BarChart3, Bot, Clock, Users, Award } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "MERN Stack Development",
    price: 45000,
    duration: "6 months",
    level: "Intermediate",
    description:
      "Master full-stack web development with MongoDB, Express.js, React, and Node.js. Build modern, scalable web applications from scratch.",
    features: [
      "Complete MERN stack mastery",
      "Real-world project development",
      "Industry-standard practices",
      "Job placement assistance",
    ],
    icon: Code,
    popular: false,
  },
  {
    id: 2,
    title: "Flutter App Development",
    price: 45000,
    duration: "5 months",
    level: "Intermediate",
    description:
      "Create beautiful, cross-platform mobile applications using Flutter and Dart. Deploy apps to both iOS and Android platforms.",
    features: [
      "Cross-platform development",
      "UI/UX design principles",
      "App store deployment",
      "Performance optimization",
    ],
    icon: Smartphone,
    popular: false,
  },
  {
    id: 3,
    title: "Python for Data Science and AI",
    price: 20000,
    duration: "3 months",
    level: "Beginner",
    description:
      "Learn Python programming fundamentals and apply them to data science and artificial intelligence projects.",
    features: [
      "Python programming basics",
      "Data analysis with Pandas",
      "Machine learning introduction",
      "AI project implementation",
    ],
    icon: Brain,
    popular: true,
  },
  {
    id: 4,
    title: "Data Science and Machine Learning",
    price: 48000,
    duration: "6 months",
    level: "Advanced",
    description:
      "Comprehensive program covering statistical analysis, machine learning algorithms, and data visualization techniques.",
    features: [
      "Advanced statistical methods",
      "ML algorithm implementation",
      "Big data processing",
      "Industry case studies",
    ],
    icon: BarChart3,
    popular: false,
  },
  {
    id: 5,
    title: "Agentic AI",
    price: 48000,
    duration: "4 months",
    level: "Advanced",
    description: "Cutting-edge course on autonomous AI agents, multi-agent systems, and advanced AI architectures.",
    features: [
      "Autonomous agent development",
      "Multi-agent coordination",
      "Advanced AI frameworks",
      "Research-oriented projects",
    ],
    icon: Bot,
    popular: false,
  },
]

export default function FeeStructurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Training Programs</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Invest in your future with our comprehensive training programs. All courses include hands-on projects,
            industry mentorship, and career support.
          </p>
        </div>

        {/* Course Listings */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const IconComponent = course.icon
            return (
              <Card
                key={course.id}
                className={`hover:shadow-lg transition-all duration-300 relative ${course.popular ? "ring-2 ring-green-500 scale-105" : ""
                  }`}
              >
                {course.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Price */}
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-3xl font-bold text-green-600">
                        Rs. {course.price}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Complete Course Fee</p>
                    </div>

                    {/* Course Details */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Small Batches
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {"What You'll Learn:"}
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {course.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Enroll Button */}
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Payment & Support Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Flexible installment plans available</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Group enrollment discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Student & professional discounts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{"What's Included"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Live interactive sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Recorded lectures for revision</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Hands-on projects & assignments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Industry mentorship & career guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Certificate of completion</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Need More Information?</CardTitle>
              <CardDescription className="text-base">
                Our counselors are here to help you choose the right course for your career goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Contact us at:{" "}
                  <a href="mailto:admissions@nexusberry.com" className="text-green-600 hover:underline font-medium">
                    admissions@nexusberry.com
                  </a>
                </p>
                <p className="text-gray-600">
                  Call us:{" "}
                  <a href="tel:+911234567890" className="text-green-600 hover:underline font-medium">
                    +92 3250362286
                  </a>
                </p>
                <Button className="bg-green-600 hover:bg-green-700">Schedule Free Consultation</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 NexusBerry Training & Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
