import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Palette, TrendingUp } from "lucide-react"
// import { Users } from "lucide-react"

const jobs = [
  {
    id: 1,
    slug: "creative-content-artist-job",
    title: "Creative Content Artist",
    department: "Creative Design",
    type: "Full-time",
    location: "Johar Town, Lahore (Onsite)",
    description:
      "We are looking for a Creative Artist who can bring our brand to life across social media, YouTube, and our website. The ideal candidate is passionate about visual storytelling, video editing, and social media trends — someone who can turn ideas into engaging digital content.",
    requirements: [
      "1+ year of experience in content creation or video editing.",
      "Produce eye-catching image and video content for social media, YouTube, and the website.",
      "Edit and enhance videos, reels, and promotional materials.",
      "Manage and post content across social media platforms.",
      "Stay updated with the latest trends in digital content creation.",
      "Salary: PKR 40,000 - 50,000.",
    ],
    icon: Palette,
  },
  {
    id: 2,
    slug: "digital-marketing-job",
    title: "Digital Marketing Executive",
    department: "Marketing",
    type: "Full-time",
    location: "Johar Town, Lahore (Onsite)",
    description:
      "Develop and execute digital marketing strategies, manage online campaigns, and drive enrollment for our training courses through various digital channels.",
    requirements: [
      "1+ year of experience in content creation or video editing.",
      "Knowledge of SEO, SEM, and social media advertising",
      "Analytics and reporting skills",
      "Understanding of lead generation strategies",
      "Ability to run successful paid Ad compaign on meta and google platforms",
      "Salary: PKR 40,000 - 50,000.",
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
