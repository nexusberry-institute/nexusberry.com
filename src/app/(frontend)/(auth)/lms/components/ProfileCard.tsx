import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail } from 'lucide-react';
import { transformStudent } from '../(dashboard)/profile/actions/transformStudent';

interface ProfileCardProps {
  student: ReturnType<typeof transformStudent>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ student }) => {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-none shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="w-24 h-24 mr-6 ring-2 ring-primary shadow-lg">
              <AvatarImage src={student.picture} alt={student.pictureAlt} />
              <AvatarFallback className='text-4xl'>{student.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{student.fullName}</h2>
              <div className="flex items-center text-gray-300 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                <p>{student.email}</p>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                Active Student
              </Badge>
            </div>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-gray-300 flex items-center justify-end">
              <span className="font-semibold mr-2">Student ID:</span>
              <span className="text-primary">{student.id}</span>
            </p>
            <p className="text-gray-300 flex items-center justify-end mt-2">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span className="font-semibold mr-2">Joined:</span>
              <span className="text-primary">{new Date(student.joinDate).toLocaleDateString() || ("")} </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

