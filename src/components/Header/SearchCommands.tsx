'use client'

import * as React from 'react'
import { CiSearch } from 'react-icons/ci'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { Navigation } from '@/lib/navigations'

export const SearchCommands = () => {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const path = usePathname()
  const segments = path.split('/')
  const shopUrl = segments[1]
  const settingsPath = `/${shopUrl}/settings`

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'j' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const transformNavigation = (originalNav: typeof Navigation) => {
    return originalNav.map(group => {
      const transformedGroup = {
        title: group.title,
        navItems: group.navItems.flatMap(navItem => {
          // If navItem has children, flatten them into navItems
          if (navItem.children) {
            return navItem.children.map(child => ({
              ...child,
              // Add parent's icon to child if it exists
              icon: navItem.icon ? navItem.icon : undefined,
            }));
          }
          // Return navItem directly if no children
          return [{
            ...navItem,
            icon: navItem.icon ? navItem.icon : undefined,
          }];
        }),
      };
      return transformedGroup;
    });
  };

  // Assuming the original Navigation structure is available
  const transformedNavigation = transformNavigation(Navigation);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={'secondary'}
        className="flex items-center justify-between h-8 w-[210px] text-sm px-2"
      >
        <div className="flex items-center gap-x-1 text-neutral-400 font-normal">
          <CiSearch className="h-5 w-5" />
          <span>Search</span>
        </div>
        <div className="text-muted-foreground">
          <span className="text-xs">Press </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span> J or
            <span className="text-xs">/</span>
          </kbd>
        </div>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {transformedNavigation .map((nav) => {
            return (
              <>
                <CommandGroup heading={nav.title} key={nav.title}>
                  {nav.navItems.map((item) => {
                    return (
                      <CommandItem
                        key={item.href}
                        value={item.name}
                        onSelect={() => {
                          runCommand(() => {
                            router.push(`/${shopUrl}${item.href}`)
                          })
                        }}
                        className="flex items-center gap-x-2"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                        {/* <CommandShortcut>{item.shortcut}</CommandShortcut> */}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                <CommandSeparator />
              </>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
