'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation"
import NavStyles from './Nav.module.css'
import { HeartHandshake } from "lucide-react";

interface NavbarMenuProps {
    data: any 
}

type RouteData = { href: string; label?: string, className?: string, children?: React.ReactNode }

export const NavLink = ({ href, label, className, children }: RouteData ) => {
    return (
        <Link
            key={href}
            href={href}
            className={ cn( 'text-black', className, NavStyles.navLink) }
        >
           {children ? children : label} 
        </Link>
    )
}

const NavbarMenu = (
    { data }: NavbarMenuProps
) => {
    const pathname = usePathname()
    const path = usePathname()
    const shopUrl = '/shop/' + path.split('/')[2];

    const routes = data.map((route: any) => {
        return {
            href: `${shopUrl}/category/${route.categoryUrl}`,
            label: route.categoryName,
            active: pathname === `/category/${route.categoryUrl}`
        }
    }).concat(...[
        {
            href: `${shopUrl}/about` ,
            label: 'About us',
            active: pathname === `/about`
        }
    ]);

    return (
        <nav className='flex items-center justify-between space-x-4 lg:space-x-6 w-full'>
            <ul className="flex items-center gap-x-8">
                {
                    routes.map((route: RouteData) => {
                        return (
                            <div key={route.href}>
                                <NavLink href={route.href} label={route.label} />
                            </div>
                        )
                    })
                }
            </ul>
            <div>
                <div className='service-card flex items-center space-x-3'>
                    <div className='service-card__icon'>
                        <HeartHandshake size={44} strokeWidth={1} />
                    </div>
                    <div className='service-card__content'>
                        <h4>Call us</h4>
                        <p aria-label='phone number' className='font-semibold'>+1 234 567 89</p>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavbarMenu