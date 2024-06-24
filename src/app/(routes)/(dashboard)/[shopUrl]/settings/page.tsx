'use client'

import { UserProfile } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const Settings = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <UserProfile />
}

export default Settings
