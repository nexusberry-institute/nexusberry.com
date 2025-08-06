"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

import { transformStudent } from '../actions/transformStudent';
import { updateStudentData } from '../actions/updateStudentData';
import ProfileImageSection from './ProfileImageSection';
import PhoneVerificationField from './PhoneVerificationField';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


// Define form schema
const personalInfoSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  education: z.string().min(2, { message: "Education must be at least 2 characters" }),
  phoneNumber: z.string().min(10, { message: "Enter a valid phone number" }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"]),
  homeAddress: z.string().optional(),
  city: z.string().min(3, { message: "City must be at least 3 characters" }),
  state: z.string().optional(),
  country: z.string().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

const PersonalInfoTab: React.FC<{ student: ReturnType<typeof transformStudent> }> = ({ student }) => {

  const [formHasChanged, setFormHasChanged] = useState(false);

  const { toast } = useToast();

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      email: student.email,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      education: student.education,
      homeAddress: student.homeAddress,
      city: student.city,
      state: student.state,
      country: student.country,
    },
  });

  useEffect(() => {
    setFormHasChanged(form.formState.isDirty);
  }, [form.formState.isDirty])

  const handleSubmit = async (updatedData: PersonalInfoValues) => {

    const changedFields = Object.entries(updatedData).filter(([key, value]) => {

      if (!value || value === student[key as keyof typeof student]) {
        return false;
      }

      return true
    })

    const data = Object.fromEntries(changedFields)

    if (Object.keys(data).length === 0) {
      toast({
        title: "No changes made",
        variant: "warning",
        description: "No changes were made to your personal information.",
      });
      return;
    }

    const { success, message } = await updateStudentData(student.id, data);

    toast({
      title: success ? "Profile Updated" : "Error updating profile",
      variant: success ? "success" : "destructive",
      description: message,
    });
  };

  return (
    <Card className="bg-customgreys-primarybg border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Personal Information</CardTitle>
        <CardDescription className="text-gray-400">
          Update your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">

              <ProfileImageSection student={student} />

              <Separator className="my-6 bg-gray-700" />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        <Mail className="inline mr-2 h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="bg-gray-800 text-gray-400" />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Your email address cannot be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 required">
                        <User className="inline mr-2 h-4 w-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-800 border-gray-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="education"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel className="text-gray-300 required">
                        <GraduationCap className="inline mr-2 h-4 w-4" />
                        Highest Education
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder='i.e. BSCS, BSIT, MSc Mathematics etc'
                          className="bg-gray-800 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <PhoneVerificationField />

                <FormField
                  name="dateOfBirth"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        <Calendar className="inline mr-2 h-4 w-4" />
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="bg-gray-800 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="gender"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className='required'>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup className="flex space-x-4" onValueChange={field.onChange} value={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <FormLabel htmlFor="male">Male</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <FormLabel htmlFor="female">Female</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <Separator className="my-6 bg-gray-700" />

              {/* Address Information */}
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Address Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="homeAddress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Home Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-800 border-gray-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 required">City</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-800 border-gray-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="state"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">State/Province</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-800 border-gray-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel className="text-gray-300">Country</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-800 border-gray-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </div>

            <div className="flex justify-end mt-8">
              <Button type="submit" disabled={!formHasChanged} className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      {form.formState.isSubmitting && (
        <div className='loadingBlock'>
          <div className='loadingSpinner' />
        </div>
      )}
    </Card >
  );
};

export default PersonalInfoTab;
