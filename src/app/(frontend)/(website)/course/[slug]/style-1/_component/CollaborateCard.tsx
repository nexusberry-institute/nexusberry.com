import React from 'react'
import Image from 'next/image'
import beginer from '@/app/(frontend)/(website)/_assets/images/beginer.svg'
import { Clock, Code, Play, Users } from "lucide-react";
import logo from '@/app/(frontend)/(website)/_assets/logo/logo-blue.png'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CollaboratCard({ title, courseFormat, duration, instructorName, projects, totalLectures }: any) {
  return (
    <div className='lg:border border-y lg:rounded-xl lg:shadow-lg p-4 bg-card space-y-8 max-md:space-y-6 max-sm:space-y-4'>
      <h2 className='text-2xl font-semibold max-lg:hidden'>{title} with NexusBerry</h2>
      <ul className='space-y-2 text-lg max-sm:text-base'>
        <li className="flex gap-1 capitalize"><Image src={beginer} alt='beginer' className=' inline-block' />{courseFormat}</li>
        <li><Clock size={18} className="inline mr-1" /> {duration} Weeks</li>
        <li><Play size={14} className="inline mr-1" />  {totalLectures} Lessons</li>
        <li><Code size={18} className="inline mr-1" /> {projects} Projects</li>
        <li><Users size={18} className="inline mr-1" /> Instructor: {instructorName || "NexusBerry"}</li>
        <li className="w-32 relative aspect-[4/1] "><Image src={logo} fill alt='logo' className='object-cover' /></li>
      </ul>
      <Link href="#registration-form" className='block'><Button className='w-full text-lg py-7 rounded-xl bg-secondary hover:bg-secondary-400 max-lg:hidden'>Book Free Demo</Button></Link>
    </div>
  )
}
