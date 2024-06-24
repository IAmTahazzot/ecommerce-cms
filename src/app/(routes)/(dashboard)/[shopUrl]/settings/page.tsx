'use client'

import { UserProfile } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { dark } from '@clerk/themes'

const Settings = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <UserProfile
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
      }}
    />
  )
}

export default Settings
