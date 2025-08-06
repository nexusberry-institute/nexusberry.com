"use client"

import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Upload,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { studentImageUpload } from '../actions/studentImageUpload';
import { useToast } from '@/hooks/use-toast';
import { transformStudent } from "../actions/transformStudent";

export default function ProfileImageSection({ student }: {
  student: ReturnType<typeof transformStudent>
}) {

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          variant: "destructive",
          description: "Profile image must be less than 5MB.",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          variant: "destructive",
          description: "Please upload an image file.",
        });
        return;
      };

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          setIsDefaultImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const handleImageUpload = async () => {

    const file = fileInputRef.current?.files?.[0];

    if (!file) return;

    setIsLoading(true);
    const { success, message } = await studentImageUpload(student.id, file)
    setIsLoading(false);

    if (success) {
      setIsDefaultImage(true);
    }

    toast({
      title: success ? "Successfully uploaded" : "Failed to upload",
      variant: success ? "success" : "destructive",
      description: message,
    });
  }

  const removeProfileImage = () => {
    setProfileImage(null);
    setIsDefaultImage(true);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast({
      title: "Image Removed",
      variant: "success",
      description: "Your profile image has been removed. Don't forget to save your changes.",
    });
  };


  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <Avatar className="w-32 h-32 mb-4 ring-2 ring-primary shadow-lg">
          <AvatarImage src={profileImage || student.picture} alt={student.pictureAlt} className='object-cover' />
          <AvatarFallback className='text-4xl'>{student.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>

        {/* Delete Confirmation */}
        {!isDefaultImage && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Remove Profile Picture?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will remove your custom profile picture and revert to the default avatar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={removeProfileImage}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

      </div>
      <div className="flex flex-col items-center">
        <div className='flex gap-2'>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Change Profile Picture
          </Button>
          {!isDefaultImage && <Button
            type="button"
            onClick={handleImageUpload}
            disabled={isLoading}
            className="flex items-center bg-green-700 hover:bg-green-800"
          >
            <Check className="mr-1 h-4 w-4" />
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          size={1024 * 1024 * 5}

          accept="image/*"
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-2">
          Recommended: Square image, max 5MB
        </p>
      </div>
    </div>
  );
}