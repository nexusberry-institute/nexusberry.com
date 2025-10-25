"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Course } from '../../../types/types.md';
import { Badge } from '@/components/ui/badge';

const ITEMS_PER_PAGE = 10;

interface AttendanceRecordProps {
    course: Course;
}

const AttendanceRecord: React.FC<AttendanceRecordProps> = ({ course }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAttendanceRecord = useMemo(() => {
        return course.attendanceRecord.filter(record =>
            record.lecture.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (record.date?.includes(searchTerm) || false)
        );
    }, [searchTerm, course.attendanceRecord]);

    const totalPages = Math.ceil(filteredAttendanceRecord.length / ITEMS_PER_PAGE);
    const paginatedAttendanceRecord = filteredAttendanceRecord.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <Card className="bg-customgreys-secondarybg border-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white-50">Detailed Attendance Record: {course.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-64">
                        <Input
                            type="text"
                            placeholder="Search lectures..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-customgreys-primarybg text-white-50 w-full"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-customgreys-dirtyGrey" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            variant="outline"
                            className="text-white-50"
                        >
                            Previous
                        </Button>
                        <span className="text-white-50">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            className="text-white-50"
                        >
                            Next
                        </Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white-50 w-1/4">Date</TableHead>
                                <TableHead className="text-white-50 w-1/2">Lecture</TableHead>
                                <TableHead className="text-white-50 w-1/4">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedAttendanceRecord.map((record, index) => (

                                <TableRow key={index}>
                                    <TableCell className="text-customgreys-dirtyGrey">{record.date}</TableCell>
                                    <TableCell className="text-customgreys-dirtyGrey">{record.lecture}</TableCell>
                                    <TableCell>
                                        {record.attended ? (
                                            <Badge className="bg-green-500/20 text-green-500">Present</Badge>
                                        ) : (
                                            <Badge className="bg-red-500/20 text-red-500">Absent</Badge>
                                        )}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default AttendanceRecord;