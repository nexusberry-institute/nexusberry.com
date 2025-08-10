import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Palette, TrendingUp } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Customer Service Representative (CSR)",
    department: "Admissions",
    type: "Full-time",
    location: "Office",
    description:
      "Handle training course admissions, assist prospective students with inquiries, and provide excellent customer service throughout the enrollment process.",
    requirements: [
      "Excellent communication skills",
      "Customer service experience preferred",
      "Strong organizational abilities",
      "Proficiency in basic computer applications",
    ],
    icon: Users,
  },
  {
    id: 2,
    title: "Creative Artist",
    department: "Marketing",
    type: "Full-time",
    location: "Hybrid",
    description:
      "Manage social media presence, create engaging content, and handle video/photo editing for our training programs and brand promotion.",
    requirements: [
      "Proficiency in design software (Adobe Creative Suite)",
      "Social media management experience",
      "Video editing skills",
      "Creative mindset with attention to detail",
    ],
    icon: Palette,
  },
  {
    id: 3,
    title: "Digital Marketing Executive",
    department: "Marketing",
    type: "Full-time",
    location: "Office",
    description:
      "Develop and execute digital marketing strategies, manage online campaigns, and drive enrollment for our training courses through various digital channels.",
    requirements: [
      "Digital marketing experience (2+ years)",
      "Knowledge of SEO, SEM, and social media advertising",
      "Analytics and reporting skills",
      "Understanding of lead generation strategies",
    ],
    icon: TrendingUp,
  },
]

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">NexusBerry Training & Solutions</h1>
            <p className="text-xl text-gray-600">Join Our Growing Team</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Job Openings</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are looking for passionate individuals to join our team and help us deliver exceptional training
            solutions. Explore our current opportunities below.
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => {
            const IconComponent = job.icon
            return (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary">{job.department}</Badge>
                  </div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="text-base">{job.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Job Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Apply Button */}
                    <Button className="w-full mt-4">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Join Us?</CardTitle>
              <CardDescription className="text-base">
                Don&apos;t see a position that matches your skills? We&apos;re always looking for talented individuals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Send your resume and cover letter to:{" "}
                  <a href="mailto:careers@nexusberry.com" className="text-blue-600 hover:underline font-medium">
                    careers@nexusberry.com
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  We are an equal opportunity employer committed to diversity and inclusion.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
