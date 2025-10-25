import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import { CalendarDays, BookOpen, ChevronRight } from 'lucide-react';
import { Course } from '../types/types.md';
import { motion } from 'framer-motion';

interface CourseAccordionProps {
    courses: Course[];
    setSelectedCourse: (id: string) => void;
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({ courses, setSelectedCourse }) => {
    return (
        <Accordion type="single" collapsible className="w-full">

            {courses.map((course) => (
                <AccordionItem value={course.id} key={course.id}>
                    
                    <AccordionTrigger className="text-white hover:text-primary transition-colors duration-300 flex items-center justify-between">
                        <span>{course.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <motion.div 
                            className="space-y-4 p-4 bg-gray-800 rounded-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-2 text-gray-300">
                                <CalendarDays className="text-primary" />
                                <span>Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <BookOpen className="text-primary" />
                                <span>{course.completedModules} of {course.totalModules} modules completed</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Course Progress</span>
                                    <span className="text-white font-medium">
                                        {Math.round((course.completedModules / course.totalModules) * 100)}%
                                    </span>
                                </div>
                                <Progress
                                    value={(course.completedModules / course.totalModules) * 100}
                                    className="w-full h-2"
                                />
                            </div>
                            <Button
                                onClick={() => setSelectedCourse(course.id)}
                                variant='secondary'
                                className="w-full mt-2 text-customgreys-darkGrey"
                            >
                                View Attendance
                            </Button>
                        </motion.div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default CourseAccordion;

