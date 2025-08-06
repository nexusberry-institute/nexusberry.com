type programsArray = {
  title: string,
  module: {
    id: number,
    name: string,
    image_url: StaticImageData,
    short_description: string,
    long_description: string,
    duration: string,
    language: string,
    tag: string,
    badge: string
  }[]
}[]

// export const coursesArray: string[] = [
//   'MERN ', 'React Native', 'Flutter',
//   'Android Development', 'Machine Learning',
//   'Data Science', 'UI/UX Design', 'Laravel'
// ]
import {
  power_bi,
  android,
  flutter,
  Asp,
  dataAnalytics,
  Django,
  dl,
  Dsml,

  graphic,
  javascript,
  mean,
  Mern,
  nextjs,
  PhpLaravel,
  python,
  react,
  reactNative,
  seo,
  social_media,
  social,
  unity_game,
  webdesigning,
  wordpress,
  interactiveLearning,
  certificate,
  Quz,
  extraLearn,
} from '@/app/(frontend)/(website)/_assets/images'
import { StaticImageData } from "next/image"

export const programs: programsArray = [
  {
    title: 'Web Development Courses',
    module: [
      {
        id: 1,
        name: 'Javascript',
        image_url: javascript,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 2,
        name: 'React',
        image_url: Mern,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 3,
        name: 'Mean',
        image_url: mean,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: 'paid',
        badge: "Exclusive"
      },
      {
        id: 4,
        name: 'Django',
        image_url: Django,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: 'paid',
        badge: "Exclusive"
      },
      {
        id: 5,
        name: 'Asp.Net core',
        image_url: Asp,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 6,
        name: 'Php Laravel',
        image_url: PhpLaravel,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 7,
        name: 'Web Design',
        image_url: webdesigning,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 8,
        name: 'Nextjs',
        image_url: nextjs,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      }
    ]
  },

  {
    title: 'AI and Data Science Courses',
    module: [
      {
        id: 1,
        name: 'Deep Learning',
        image_url: dl,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 2,
        name: 'Data Science',
        image_url: Dsml,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 3,
        name: 'Data Analytics',
        image_url: dataAnalytics,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: 'paid',
        badge: "Exclusive"
      },
      {
        id: 4,
        name: 'Python',
        image_url: python,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: 'paid',
        badge: "Exclusive"
      },
      {
        id: 5,
        name: 'Power BI',
        image_url: power_bi,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: 'paid',
        badge: "Exclusive"
      },
    ]
  },

  {
    title: 'Mobile App Development Courses',
    module: [
      {
        id: 1,
        name: 'Flutter',
        image_url: flutter,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 2,
        name: 'React Native',
        image_url: reactNative,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 3,
        name: 'Android Development',
        image_url: android,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: 'paid',
        badge: "Exclusive"
      },
    ]
  },

  {
    title: 'Best Selling Courses',
    module: [
      {
        id: 1,
        name: 'Grapphic Design',
        image_url: graphic,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 2,
        name: 'Unity Game Development',
        image_url: unity_game,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 3,
        name: 'Digital Marketing',
        image_url: social_media,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: 'paid',
        badge: "Exclusive"
      },
      {
        id: 4,
        name: 'SEO',
        image_url: seo,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: 'paid',
        badge: "Exclusive"
      },
      {
        id: 5,
        name: 'Social Media Marketing',
        image_url: social,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },
      {
        id: 6,
        name: 'wordpress',
        image_url: wordpress,
        short_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        long_description: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the state of an application.',
        duration: '6 months',
        language: "Urdu",
        tag: "paid",
        badge: "Exclusive"
      },

    ]
  },
]

export const occupationOptions = [
  "Student (Currently Studying)",
  "Fresh Graduate (Recently Graduated)",
  "Working Professional (Employed)",
  "Entrepreneur (Business Owner)",
  "Freelancer (Self-Employed)",
  "Unemployed (Looking for Opportunities)"
];

export const educationOptions = [
  "Class 1 to 8 (School)",
  "Matric / O-Level (Class 9 - 10)",
  "Intermediate / A-Level / 12th Grade (Class 11 - 12)",
  "Diploma (Technical / Vocational)",
  "Bachelor's Degree (e.g., BS, BSc, BCom, BA)",
  "Master's Degree (e.g., MS, MSc, MCom, MA)",
  "PhD / Doctorate",
  "Other / Not Listed"
];


export const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czechia (Czech Republic)', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini (fmr. Swaziland)', 'Ethiopia', 'Fiji',
  'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
  'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kiribati', 'Korea (North)', 'Korea (South)', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
  'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia (formerly Macedonia)',
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
]

type FooterLinks = {
  title: string
  links: {
    name: string
    link: string
  }[]
}

export const footerLinks: FooterLinks[] = [
  {
    title: 'Company',
    links: [
      {
        name: 'About Us',
        link: '#'
      },
      {
        name: 'Contact Us',
        link: '#'
      },
      {
        name: 'NexusBerry Tech Blog',
        link: '/privacy'
      },
      {
        name: 'Self-Paced courses',
        link: '#'
      },
      {
        name: 'Events',
        link: '#'
      },
    ]
  },
  {
    title: 'Our Programs',
    links: [
      {
        name: 'Data Analytics',
        link: '#'
      },
      {
        name: 'Digital Marketing',
        link: '#'
      },
      {
        name: 'Web Development',
        link: '/privacy'
      },
      {
        name: 'Cyber Security',
        link: '#'
      },
      {
        name: 'App Development',
        link: '#'
      },
    ]
  },
  {
    title: 'Support',
    links: [
      {
        name: 'Over Policy',
        link: '#'
      },
      {
        name: 'Term & Conditions',
        link: '#'
      },
      {
        name: 'Refunnd Policy',
        link: '#'
      },
      {
        name: `FAQ's`,
        link: '#'
      },
    ]
  },

]

type Resources = {
  title: string
  links: {
    label: string
    link: string
  }[]
}

export const resources: Resources[] = [
  {
    title: "Digital Marketing Courses",
    links: [
      { label: "Digital Marketing Course", link: "#" },
      { label: "SEO Course", link: "#" },
      { label: "Social Media Marketing Course", link: "#" },
      { label: "Content Writing Course", link: "#" },
      { label: "YouTube Course", link: "#" },
      { label: "Instagram Marketing Course", link: "#" },
      { label: "Google Ads Course", link: "#" },
      { label: "Copywriting Course", link: "#" },
      { label: "Performance Marketing Course", link: "#" }
    ]
  },
  {
    title: "Web Development Courses",
    links: [
      { label: "Full Stack Developer Course", link: "#" },
      { label: "WordPress Course", link: "#" },
      { label: "MERN Stack Course", link: "#" },
      { label: "Laravel Course", link: "#" },
      { label: "Web Development Course", link: "#" },
      { label: "HTML Course", link: "#" },
      { label: "ReactJS Course", link: "#" },
      { label: "Javascript Course", link: "#" },
      { label: "PHP Course", link: "#" },
      { label: "NodeJS Course", link: "#" },
      { label: "Front-End Development Course", link: "#" },
      { label: "Web Designing Course", link: "#" },
      { label: "CSS Course", link: "#" }
    ]
  },
  {
    title: "More Professional Courses",
    links: [
      { label: "Cyber Security Course", link: "#" },
      { label: "Tableau Course", link: "#" },
      { label: "Android App Development Course", link: "#" },
      { label: "Mobile App Development Course", link: "#" },
      { label: "Power BI Course", link: "#" }
    ]
  },
  {
    title: "Free Courses",
    links: [
      { label: "Semrush Course", link: "#" },
      { label: "Google Tag Manager Course", link: "#" },
      { label: "Blogging Course", link: "#" },
      { label: "Photoshop Course", link: "#" },
      { label: "Video Editing Course", link: "#" },
      { label: "AngularJS Course", link: "#" },
      { label: "Shopify Course", link: "#" },
      { label: "Django Course", link: "#" },
      { label: "Email Marketing Course", link: "#" },
      { label: "Affiliate Marketing Course", link: "#" }
    ]
  },
  {
    title: "Interview Questions",
    links: [
      { label: "HTML Interview Questions", link: "#" },
      { label: "CSS Interview Questions", link: "#" },
      { label: "PHP Interview Questions", link: "#" },
      { label: "JavaScript Interview Questions", link: "#" },
      { label: "Flutter Interview Questions", link: "#" },
      { label: "Data Structure Interview Questions", link: "#" },
      { label: "Java Interview Questions", link: "#" },
      { label: "MySQL Interview Questions", link: "#" },
      { label: "Python Interview Questions", link: "#" },
      { label: "DBMS Interview Questions", link: "#" },
      { label: "Power BI Interview Questions", link: "#" },
      { label: "Angular Interview Questions", link: "#" },
      { label: "ReactJS Interview Questions", link: "#" },
      { label: "C Interview Questions", link: "#" },
      { label: "Django Interview Questions", link: "#" },
      { label: "Email Marketing Interview Questions", link: "#" },
      { label: "Content Writing Interview Questions", link: "#" },
      { label: "NodeJS Interview Questions", link: "#" },
      { label: "SEO Interview Questions", link: "#" },
      { label: "OOPS Interview Questions", link: "#" },
      { label: "SQL Interview Questions", link: "#" },
      { label: "Digital Marketing Interview Questions", link: "#" }
    ]
  },
  {
    title: "Popular Career Resources",
    links: [
      { label: "Professional Courses After 12th", link: "#" },
      { label: "Courses After Graduation", link: "#" },
      { label: "How to Become SEO Freelancer?", link: "#" },
      { label: "High-Income Skills", link: "#" },
      { label: "Digital Marketing Books", link: "#" },
      { label: "Become Google Ads Expert", link: "#" },
      { label: "Build a Career in Digital Marketing", link: "#" },
      { label: "SEO Career Path", link: "#" },
      { label: "Make Money Online", link: "#" },
      { label: "Become Data Analyst", link: "#" },
      { label: "Become a Flutter Developer", link: "#" },
      { label: "Best Programming Languages to Learn", link: "#" },
      { label: "Become Ethical Hacker", link: "#" },
      { label: "Python Developer Salary", link: "#" },
      { label: "Full Stack Developer Salary", link: "#" },
      { label: "Data Analyst Salary", link: "#" },
      { label: "Free Digital Marketing Projects", link: "#" }
    ]
  }
];



export const masterClassBenefits = [

  {
    img: interactiveLearning,
    title: "Interactive Learning",
    description: "Experience live sessions that make learning fun and engaging with Industry maestros."
  },
  {
    img: extraLearn,
    title: "Extra Learning",
    description: "Get access to additional study materials and resources to enhance your learning experience."
  },
  {
    img: Quz,
    title: "Quizzes",
    description: "Test your knowledge with quizzes and assessments to track your progress and understanding."
  },
  {
    img: certificate,
    title: "Certificate",
    description: "Get certified by NexusBerry traing and solutions and showcase your skills to the world."
  }
]