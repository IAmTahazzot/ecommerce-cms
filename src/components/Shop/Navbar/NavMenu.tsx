'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavStyles from './Nav.module.css'
import { HeartHandshake } from 'lucide-react'
import { useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp   } from 'react-icons/io'

interface NavbarMenuProps {
  data: any
}

type RouteData = { href: string; label?: string; className?: string; children?: React.ReactNode }

export const NavLink = ({ href, label, className, children }: RouteData) => {
  return (
    <Link key={href} href={href} className={cn('text-black', className, NavStyles.navLink)}>
      {children ? children : label}
    </Link>
  )
}

const NavbarMenu = ({ data }: NavbarMenuProps) => {
  const pathname = usePathname()
  const path = usePathname()
  const shopUrl = '/shop/' + path.split('/')[2]
  const [navActive, setNavActive] = useState(false)

  const categories = data.map((category: any) => {
    return {
      href: `${shopUrl}/category/${category.categoryUrl}`,
      label: category.categoryName,
      active: pathname === `/category/${category.categoryUrl}`,
    }
  })

  const pages = [
    {
      href: `${shopUrl}/about`,
      label: 'About us',
      active: pathname === `/about`,
    },
  ]

  return (
    <nav className="relative flex items-center justify-between space-x-4 lg:space-x-6 w-full">
      <div>
        <ul className="flex items-center gap-x-8">
          <li className="px-4 md:hidden">
            <div className="cursor-pointer flex gap-x-2 items-center" onClick={() => setNavActive(!navActive)}>
              <span>Categories </span>
              {navActive ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {navActive && (
              <ul className="absolute top-[105%] left-0 w-full px-4 py-10 shadow-lg bg-white flex-col gap-x-8 z-10 space-y-6">
                {categories.map((route: RouteData) => {
                  return (
                    <li key={route.href}>
                      <NavLink href={route.href} label={route.label} />
                    </li>
                  )
                })}
              </ul>
            )}
          </li>

          <ul className="hidden md:flex items-center gap-x-8">
            {categories.map((route: RouteData) => {
              return (
                <li key={route.href}>
                  <NavLink href={route.href} label={route.label} />
                </li>
              )
            })}
          </ul>

          {pages.map((page: RouteData) => {
            return (
              <li key={page.href}>
                <NavLink href={page.href} label={page.label} />
              </li>
            )
          })}
        </ul>
      </div>

      <div className="hidden md:block">
        <div className="service-card flex items-center space-x-3">
          <div className="service-card__icon">
            <HeartHandshake size={44} strokeWidth={1} />
          </div>
          <div className="service-card__content">
            <h4>Call us</h4>
            <p aria-label="phone number" className="font-semibold">
              +1 234 567 89
            </p>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarMenu
