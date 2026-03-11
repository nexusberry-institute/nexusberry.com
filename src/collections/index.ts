import { Users } from './Users'
import { Media } from './Media'
import { Pages } from './Pages'
import { Categories } from './Categories'
import { Posts } from './Posts'
// import { Programs } from './programs'
import { WebCourses } from './WebCourses'
import { Instructors } from './Instructor'
import { Departments } from './Departments'
import { Events } from './Events'
// import { EventRegistrations } from './EventRegistrations' // Keeping for now but not actively used
import { EventFeedbacks } from './EventFeedbacks'
import { Staffs } from './Staffs'
import Campaigns from './Campaigns'
import { Messages } from './Messages'
import { Teachers } from './Teachers'
import { Batches } from './Batches'
import { TimeTable } from './TimeTable'
import { Students } from './Students'
import { FeeReceipts } from './FeeReceipts'
import { Attendances } from './Attendences'
import { AttendanceDetails } from './AttendanceDetails'
import { Leads } from './Leads'
import { SOPs } from './SOPs'
import { CoursesCollection } from './CoursesCollection'
import { ContactMessages } from './ContactMessages'
import { Inquiries } from './InquiriesForm'
import { Employees } from './Employees'
import { ClassRecords } from './ClassRecords'
import { PlatformRedirects } from './PlatformRedirects'
import { Quizzes } from './Quizzes'
import { QuizQuestions } from './QuizQuestions'
import { QuizResults } from './QuizResults'
import { Tutorials } from './Tutorials'
import { TutorialSubjects } from './TutorialSubjects'
import { Enrollments } from './Enrollments'
import { AdmissionRequests } from './AdmissionRequests'

const collections = [
   Users, Media, Pages,
   Posts, Categories,
   // Programs,
   Instructors,
   WebCourses,
   Departments,

   Events,
   EventFeedbacks,
   // EventRegistrations, // Keeping for data migration compatibility
   Campaigns,

   Staffs,
   Messages,
   Teachers,
   Batches,
   TimeTable,
   Students,
   FeeReceipts,
   Attendances,
   AttendanceDetails,
   Leads,
   SOPs,
   CoursesCollection,
   ContactMessages,
   Inquiries,
   Employees,
   ClassRecords,
   PlatformRedirects,
   // Classwork
   Quizzes,
   QuizQuestions,
   QuizResults,
   // Tutorials
   Tutorials,
   TutorialSubjects,
   Enrollments,
   AdmissionRequests,
];

export default collections;