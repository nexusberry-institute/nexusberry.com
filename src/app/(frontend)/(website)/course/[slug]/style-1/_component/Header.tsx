import React from 'react'
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronDown, Menu } from 'lucide-react'
import logo from '@/app/(frontend)/(website)/_assets/logo/reverse-logo.png'
import Image from 'next/image'
import { PayloadThemeToggle } from '@/components/ui/theme-provider'

const Header = () => {
    return (
        <div className='p-4 flex justify-between container mx-auto'>
            <div className='top-2 w-48 max-sm:w-32 bg-primary  aspect-[4/1] relative'>
                <Image
                    src={logo}
                    alt='logo'
                    fill
                    className='object-contain' />
            </div>
            <div className='flex gap-4 max-lg:hidden'>
                {/* <PayloadThemeToggle /> */}
                {/* <NavigationMenu>
                    <NavigationMenuList >
                        <NavigationMenuItem className='text-lg'>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className='text-lg text-foreground'>
                                    Explore Courses
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='text-lg text-foreground'>AI Newsletter</NavigationMenuTrigger>
                            <NavigationMenuContent >
                                <ul className="grid grid-cols-2 w-[300px] gap-3 p-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="block text-nowrap select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                href="/"
                                            >
                                                The Batch
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="block text-nowrap select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                href="/"
                                            >
                                                The Batch
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu> */}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className='hover:'>
                        <Button className='bg-background text-foreground'>AI Newsletter<ChevronDown /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56 text-center rounded-xl bg-card font-sans'>
                        <DropdownMenuLabel>AI New</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>AI New</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>AI New</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>AI New</DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button className='bg-secondary hover:bg-secondary-400 rounded-xl py-7 text-xl'>Start Learning</Button>
            </div>
            <Menu size={32} className='lg:hidden text-foreground mt-2 max-sm:size-7' />


        </div>
    )
}

export default Header
