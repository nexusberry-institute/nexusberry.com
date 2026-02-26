import { Button } from "@/components/ui/button"
import logo from '@/app/(frontend)/(website)/_assets/logo/reverse-logo.png'
import {
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import type { User } from "@/payload-types"
import { rolePriority } from '@/constants'


type SidebarProps = {
    setOpen: (open: boolean) => void;
    courseLinks: {
        slug?: string | null;
        title: string;
    }[];
    user: User | null | undefined;
}

export function Sidebar({ setOpen, courseLinks, user }: SidebarProps) {
    const isLoggedIn = !!user
    const handleLinkClick = () => {
        setOpen(false)
    }
    return (
        <SheetContent side={"right"} className="bg-primary text-card">
            <Collapsible className="group/collapsible h-full justify-between flex flex-col">
                <div>
                    <SheetHeader>
                        <SheetTitle className="sr-only">Side bar</SheetTitle>
                        <div className='w-48 max-sm:w-36 aspect-[4/1] relative mr-4'>
                            <Image
                                src={logo}
                                alt='logo'
                                fill
                                className='object-contain' />
                        </div>
                    </SheetHeader>
                    <div className="grid grid-cols-1 space-y-4 pt-8 ">
                        <div className="grid grid-cols-1 w-full">
                            <CollapsibleTrigger className="flex justify-between text-sm px-4">
                                Explore Courses
                                <ChevronDown className="ml-auto size-5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="grid grid-cols-1 px-5">
                                {courseLinks?.map(({ slug, title }) => (
                                    <Link href={`/departments/${slug}`} key={title} onClick={handleLinkClick}>
                                        <Button className="text-xs text-background">{title}</Button>
                                    </Link>
                                ))}
                            </CollapsibleContent>
                        </div>
                        <Link href='/events' onClick={handleLinkClick}>
                            <Button>Events</Button>
                        </Link>
                        <Link href='/tutorials' onClick={handleLinkClick}>
                            <Button>Tutorials</Button>
                        </Link>
                        <Link href='/blog' onClick={handleLinkClick}>
                            <Button>Blog</Button>
                        </Link>
                        <Link href='/contact-us' onClick={handleLinkClick}>
                            <Button>Contact us</Button>
                        </Link>
                    </div>
                </div>
                <div className='flex justify-center'>
                    {isLoggedIn ? (
                        <Link href='/logout' onClick={handleLinkClick} className='flex flex-col items-center leading-tight text-card/70 hover:text-card'>
                            <span className='text-[10px] uppercase tracking-wide opacity-70'>{rolePriority.find(r => user?.roles?.includes(r)) ?? 'user'}</span>
                            <span className='text-sm font-medium'>Logout</span>
                            <span className='text-[10px] opacity-70 truncate max-w-[140px]'>{user?.email}</span>
                        </Link>
                    ) : (
                        <Link href='/login' onClick={handleLinkClick}>
                            <Button className='text-xs border rounded-xl px-8 py-4'>Login</Button>
                        </Link>
                    )}
                </div>
            </Collapsible>
        </SheetContent>
    )
}
