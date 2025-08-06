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


type SidebarProps = {
    setOpen: (open: boolean) => void;
    courseLinks: {
        slug?: string | null;
        title: string;
    }[];
}

export function Sidebar({ setOpen, courseLinks }: SidebarProps) {
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
                        <Link href={'/'} onClick={handleLinkClick}>
                            <Button>About us</Button>
                        </Link>
                        <div className="grid grid-cols-1 w-full">
                            <CollapsibleTrigger className="flex justify-between text-sm px-4">
                                Departments<ChevronDown className="ml-auto size-5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="grid grid-cols-1 px-5">
                                {courseLinks?.map(({ slug, title }) => (
                                    <Link href={`/departments/${slug}`} key={title} onClick={handleLinkClick}>
                                        <Button className="text-xs text-background">{title}</Button>
                                    </Link>
                                ))}
                            </CollapsibleContent>
                        </div>
                        <Link href='/contact-us' onClick={handleLinkClick}>
                            <Button>Contact us</Button>
                        </Link>
                    </div>
                </div>
                <div className='flex justify-between max-xs:*:px-4 *:py-4 *:border *:rounded-xl *:text-xs *:px-8'>
                    <Link href='/login'>
                        <Button >Login</Button>
                    </Link>
                    <Link href='/register'>
                        <Button >Register Now</Button>
                    </Link>
                </div>
            </Collapsible>
        </SheetContent>
    )
}
