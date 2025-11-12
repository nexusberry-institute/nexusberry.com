import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Palette, TrendingUp, HeadphonesIcon } from "lucide-react"

const jobs = [
  {
    id: 1,
    slug: "creative-content-artist-job",
    title: "Creative Content Artist",
    department: "Creative Design",
    type: "Full-time",
    location: "Johar Town, Lahore (Onsite)",
    description:
      "NexusBerry Training and Solutions is seeking a talented Creative Content Artist to produce high-quality visuals, videos, and digital assets for our social media, YouTube, and website platforms. The ideal candidate combines creativity with technical design skills, staying ahead of digital trends to craft engaging visuals that reflect our brand's excellence in IT education and innovation.",
    requirements: [
      "1+ year of experience in content creation, graphic design, or video editing.",
      "Proficiency in Adobe Creative Suite (Photoshop, Illustrator, Premiere Pro, After Effects, or similar).",
      "Ability to design social media graphics, promotional materials, and video thumbnails aligned with brand aesthetics.",
      "Experience in editing and optimizing short-form video content (Reels, Shorts, YouTube, etc.).",
      "Knowledge of visual storytelling, typography, and brand identity design.",
      "Ability to plan and execute content calendars in collaboration with the marketing team.",
      "Stay updated with creative design trends, motion graphics, and visual communication best practices.",
      "Strong sense of detail, color, and composition.",
      "Ability to provide training or mentoring to junior staff, students, and internees is a plus.",
      "Salary: PKR 40,000 - 55,000 (based on experience).",
    ],
    topSkills: [
      {
        skill: "Graphic Design",
        description:
          "#1 — Core creative skill for crafting visuals across marketing, course branding, and student engagement materials.",
      },
      {
        skill: "Video Editing & Motion Graphics",
        description: "#2 — Enhances content appeal and storytelling through dynamic visuals.",
      },
      {
        skill: "Visual Storytelling",
        description: "#3 — Transforms educational ideas into emotionally engaging media for brand impact.",
      },
      {
        skill: "Social Media Content Creation",
        description: "#4 — Vital for building digital visibility and attracting potential students.",
      },
      {
        skill: "Mentoring",
        description: "#5 — Adds institutional value by guiding creative interns or design learners.",
      },
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
      "NexusBerry Training and Solutions is looking for a skilled Digital Marketing Executive to develop and execute digital marketing strategies, manage online campaigns, and strengthen the institute's online presence. The ideal candidate should have a solid understanding of social media management, branding, and advertising to drive engagement and course enrollments across multiple digital platforms.",
    requirements: [
      "1+ year of experience in digital marketing, social media, or content creation.",
      "Expertise in social media management, branding, and advertising.",
      "Ability to plan and execute marketing campaigns across Meta, Google, and YouTube.",
      "Knowledge of SEO, SEM, and social media advertising.",
      "Understanding of lead generation and audience targeting strategies.",
      "Strong analytics and reporting skills to measure campaign performance.",
      "Creative mindset with attention to detail in visuals and copywriting.",
      "Ability to provide training or mentoring to junior staff, students, and internees is a plus.",
      "Salary: PKR 40,000 - 55,000 (based on experience).",
    ],
    topSkills: [
      {
        skill: "Content Marketing",
        description:
          "#1 — Core skill for promoting courses, writing blogs, video scripts, and educational content that converts viewers into enrollments.",
      },
      {
        skill: "Social Media Management",
        description:
          "#2 — Crucial for maintaining brand presence, student engagement, and community building on Meta, LinkedIn, YouTube, etc.",
      },
      {
        skill: "Branding",
        description:
          "#3 — Helps position the institute as a premium, credible education provider in a competitive market.",
      },
      {
        skill: "Digital Advertising",
        description: "#4 — Directly drives admissions through paid campaigns (Meta, Google Ads, YouTube).",
      },
      {
        skill: "Mentoring",
        description:
          "#5 — Valuable for training interns or students, enhancing the institute's internal growth culture.",
      },
    ],
    icon: TrendingUp,
  },
  {
    id: 3,
    slug: "csr-admission-officer-job",
    title: "CSR cum Admission Officer",
    department: "Student Affairs & Admissions",
    type: "Full-time",
    location: "Johar Town, Lahore (Onsite)",
    description:
      "NexusBerry Training and Solutions is looking for a proactive and student-focused CSR cum Admission Officer to handle inquiries, admissions, and customer engagement. The ideal candidate will serve as the first point of contact for potential students—providing guidance about training programs, ensuring smooth communication, and supporting each student's journey from initial inquiry to successful enrollment.",
    requirements: [
      "1+ years of experience in customer service, academic admissions, or front-desk operations.",
      "Excellent communication and interpersonal skills for engaging students and parents effectively.",
      "Proven experience in lead management, follow-up, and conversion to admissions.",
      "Ability to handle inquiries through calls, WhatsApp, email, and in-person visits.",
      "Provide complete course, fee, and schedule information with professionalism.",
      "Maintain accurate admission data, student records, and CRM database entries.",
      "Coordinate with instructors and management to ensure student satisfaction and smooth onboarding.",
      "Strong organizational and documentation skills with attention to detail.",
      "Proficiency in MS Office and Google Workspace tools.",
      "Ability to provide training or mentoring to junior staff, students, and internees is a plus.",
      "Salary: PKR 40,000 - 55,000 (based on experience).",
    ],
    topSkills: [
      {
        skill: "Communication & Interpersonal Skills",
        description: "#1 — Core strength for handling inquiries, counseling, and student interactions effectively.",
      },
      {
        skill: "Lead Engagement & Conversion",
        description: "#2 — Essential for turning inquiries into confirmed admissions through persuasive communication.",
      },
      {
        skill: "Customer Relationship Management",
        description: "#3 — Builds trust and ensures positive experiences for prospective students.",
      },
      {
        skill: "Data Handling & Documentation",
        description: "#4 — Maintains organized records crucial for academic operations.",
      },
      {
        skill: "Mentoring",
        description: "#5 — Supports training of junior admission staff or front-desk interns for institutional growth.",
      },
    ],
    icon: HeadphonesIcon,
  },
]

export const metadata = {
  title: "Job Openings & Career Opportunities | NexusBerry Training & Solutions",
  description:
    "Explore exciting career opportunities at NexusBerry Training and Solutions. Apply for positions including Creative Content Artist, Digital Marketing Executive, and CSR Admission Officer. Full-time roles in Lahore with competitive salaries.",
  keywords: [
    "jobs",
    "careers",
    "training",
    "digital marketing",
    "graphic design",
    "admission officer",
    "NexusBerry",
    "Lahore jobs",
    "IT training careers",
  ],
  authors: [
    {
      name: "NexusBerry Training & Solutions",
      url: "https://nexusberry.com",
    },
  ],
  creator: "NexusBerry Training & Solutions",
  publisher: "NexusBerry Training & Solutions",
  metadataBase: new URL("https://nexusberry.com"),
  openGraph: {
    title: "Job Openings & Career Opportunities | NexusBerry Training & Solutions",
    description:
      "Join NexusBerry Training and Solutions. We are hiring Creative Content Artists, Digital Marketing Executives, and CSR Admission Officers. Build your career with us!",
    url: "https://nexusberry.com/jobs",
    siteName: "NexusBerry Training & Solutions",
    images: [
      {
        url: "/logos/nexusberry-transparant-1712x450.png",
        width: 1200,
        height: 630,
        alt: "NexusBerry Training & Solutions Careers",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Openings & Career Opportunities | NexusBerry",
    description:
      "Explore career opportunities at NexusBerry Training and Solutions. Apply now for full-time positions!",
    images: ["/logos/nexusberry-transparant-1712x450.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://nexusberry.com/jobs",
  },
}

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-40 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">NexusBerry Training & Solutions</h1>
            <p className="text-lg text-muted-foreground">Join Our Growing Team</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Current Job Openings</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            We are looking for passionate individuals to join our team and help us deliver exceptional training
            solutions. Explore our current opportunities below.
          </p>
        </div>

        {/* Job Listings - Full Width */}
        <div className="space-y-6">
          {jobs.map((job) => {
            const IconComponent = job.icon
            return (
              <Card key={job.id} className="hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 mt-1">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl sm:text-3xl text-foreground">{job.title}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {job.department}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Job Meta Information */}
                  <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <CardDescription className="text-base text-foreground/80">{job.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Key Requirements</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground/80">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 pb-1">
                          <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Top Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Top Skills</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {job.topSkills.map((skill, index) => (
                        <div key={index} className="bg-muted/50 p-3 rounded-lg border border-border">
                          <p className="font-semibold text-foreground text-sm">{skill.skill}</p>
                          <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-4 border-t">
                    <a href="mailto:jobs@nexusberry.com" className="w-full sm:w-auto block">
                      <Button className="w-full sm:w-auto">Apply Now: jobs@nexusberry.com</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl text-foreground">Ready to Join Us?</CardTitle>
              <CardDescription className="text-base text-foreground/70">
                Don&apos;t see a position that matches your skills? We&apos;re always looking for talented individuals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-foreground/80">
                <p>
                  Send your resume and cover letter to:{" "}
                  <a href="mailto:jobs@nexusberry.com" className="text-primary hover:underline font-semibold">
                    jobs@nexusberry.com
                  </a>
                </p>
                <p className="text-sm">We are an equal opportunity employer committed to diversity and inclusion.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
