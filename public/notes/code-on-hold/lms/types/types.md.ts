export interface AttendanceRecord {
  date: string | undefined;
  lecture: string;
  attended: boolean;
}

export interface Course {
  id: string;
  title: string;
  enrollmentDate: string;
  completedModules: number;
  totalModules: number;
  attendanceRecord: AttendanceRecord[];
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  courses: Course[];
}

