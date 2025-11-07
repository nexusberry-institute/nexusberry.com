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
import { TrainingCourses } from './TrainingCourses'
import { Modules } from './Modules'
import { Lectures } from './Lectures'
import { Batches } from './Batches'
import { TimeTable } from './TimeTable'
import { Coursework } from './Coursework'
import { Students } from './Students'
import { Enrollments } from './Enrollments'
import { FeeReceipts } from './FeeReceipts'
import { Attendances } from './Attendences'
import { AttendanceDetails } from './AttendanceDetails'
import { Leads } from './Leads'
import { PaymentPlans } from './PaymentPlans'
import { DiscountCodes } from './DiscountCodes'
import { SOPs } from './SOPs'
import { CoursesCollection } from './CoursesCollection'
import { ContactMessages } from './ContactMessages'
import { Inquiries } from './InquiriesForm'
import { Employees } from './Employees'
import { ClassRecords } from './ClassRecords'
import { PlatformRedirects } from './PlatformRedirects'

const collections = [
   Users, Media, Pages,
   Posts, Categories,
   // Programs,
   Instructors,
   WebCourses,
   Departments,
   Events,
   // EventRegistrations, // Keeping for data migration compatibility
   EventFeedbacks,
   Campaigns,
   Staffs,
   Messages,
   Teachers,
   TrainingCourses,
   PaymentPlans, //payment plan for training courses
   DiscountCodes, //discount Code for payment plans
   Modules,
   Lectures,
   Batches,
   TimeTable,
   Coursework,
   Students,
   Enrollments,
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
   PlatformRedirects
];
export default collections;


//remainings => roles, rolepermissions, Events,

// Groups
// Academic Content
//   Departments, Courses, Modules, Batches,
// People Management
// Users, Roles, Students, Teachers, Staffs,
// Academic Operations
// Lectures, TimeTable, AttendanceDetails, Attendances, Enrollments, FeeReceipts,
// Marketing & Outreach
// Leads, Events, Messages, RolePermissions,
// Coursework