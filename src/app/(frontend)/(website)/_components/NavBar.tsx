'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import logo from '@/app/(frontend)/(website)/_assets/logo/reverse-logo.png'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronsDown, Menu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Sidebar } from './Sidebar'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/app/(frontend)/(auth)/_providers/Auth'


const NavBar = ({ departments }: {
    departments: {
        slug?: string | null;
        title: string;
    }[];
}) => {
    const [open, setOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { user } = useAuth()
    const isLoggedIn = !!user
    const displayRole = user?.roles?.find(r => r !== 'authenticated') ?? 'user'

    return (
        <div className='flex sticky justify-between top-0 bg-primary items-center z-50 px-16 max-md:px-10 max-sm:px-8 max-xs:px-2 py-4'>
            <div className='flex gap-6'>
                <Link href="/" aria-label='home'>
                    <div className='w-48 max-sm:w-36 aspect-[4/1] relative mr-4'>
                        <Image
                            src={logo}
                            alt='logo'
                            fill
                            className='object-contain'
                            sizes='200px'

                        />
                    </div>
                </Link>
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild className='max-lg:hidden'>
                        <Button className='border-2 rounded-xl text-lg p-6 hover:bg-card focus-visible:ring-card focus-visible:ring-0 hover:text-foreground'>Explore Courses <ChevronsDown strokeWidth={3} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-72 space-y-2 p-4 rounded-xl  bg-card font-openSans' onClick={() => setDropdownOpen(false)}>
                        {!departments?.length ?
                            <DropdownMenuLabel className='hover:text-card hover:bg-primary-400 group cursor-pointer p-4 rounded-xl text-base text-muted-foreground flex justify-between'>
                                {'departments are not found'}
                                <ArrowRight strokeWidth={2} className='invisible group-hover:visible' />
                            </DropdownMenuLabel>

                            : departments.map(({ slug, title }) => (
                                <Link href={`/departments/${slug}`} key={title}>
                                    <DropdownMenuLabel className='hover:text-card hover:bg-primary-400 group cursor-pointer p-4 rounded-xl text-base text-muted-foreground flex justify-between'>
                                        {title}
                                        <ArrowRight strokeWidth={2} className='invisible group-hover:visible' />
                                    </DropdownMenuLabel>
                                </Link>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Menu on Computer Screen */}
            <div className='flex items-center space-x-4 max-lg:hidden'>
                <Link href='/events'>
                    <Button className='text-lg text-card hover:underline'>Events</Button>
                </Link>
                <Link href='/tutorials'>
                    <Button className='text-lg text-card hover:underline'>Tutorials</Button>
                </Link>
                <Link href='/blog'>
                    <Button className='text-lg text-card hover:underline'>Blog</Button>
                </Link>
                <Link href='/contact-us'>
                    <Button className='text-lg text-card hover:underline'>Contact us</Button>
                </Link>
                {isLoggedIn ? (
                    <Link href='/logout' className='flex flex-col items-center leading-tight text-card/70 hover:text-card'>
                        <span className='text-[10px] uppercase tracking-wide opacity-70'>{displayRole}</span>
                        <span className='text-base font-medium'>Logout</span>
                        <span className='text-[10px] opacity-70 truncate max-w-[160px]'>{user?.email}</span>
                    </Link>
                ) : (
                    <Link href='/login'>
                        <Button className='border-2 rounded-xl text-lg p-6 hover:bg-card hover:text-foreground focus-visible:ring-card focus-visible:ring-0'>
                            Login</Button>
                    </Link>
                )}
            </div>

            {/* Burger Menu on Mobile Screens */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-«Rdnatb»">
                    <Menu size={32} className='lg:hidden text-card mt-2 max-sm:size-7' />
                </SheetTrigger>
                <Sidebar setOpen={setOpen} courseLinks={departments} user={user} />
            </Sheet>

        </div>
    )
}

export default NavBar
