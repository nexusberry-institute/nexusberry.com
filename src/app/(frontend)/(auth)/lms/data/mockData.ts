import { StudentData } from "../types/types.md";


export const studentData: StudentData = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    courses: [
        {
            id: "1",
            title: "Introduction to Web Development",
            enrollmentDate: "2023-09-01",
            completedModules: 4,
            totalModules: 6,
            attendanceRecord: Array.from({ length: 50 }, (_, i) => ({
                date: new Date(2023, 8, i + 1).toISOString().split('T')[0],
                lecture: `Web Dev Lecture ${i + 1}`,
                attended: Math.random() > 0.2
            }))
        },
        {
            id: "2",
            title: "Advanced JavaScript",
            enrollmentDate: "2023-10-15",
            completedModules: 2,
            totalModules: 8,
            attendanceRecord: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(2023, 9, i + 15).toISOString().split('T')[0],
                lecture: `JS Lecture ${i + 1}`,
                attended: Math.random() > 0.1
            }))
        }
    ]
};

