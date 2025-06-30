'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

const AuthContext = createContext<{ isUserCreated: boolean }>({ isUserCreated: false })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser()
  const [isUserCreated, setIsUserCreated] = useState(false)

  useEffect(() => {
    const createUser = async () => {
      if (user && !isUserCreated) {
        await axios.post('/api/create-user', {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName
        })
        setIsUserCreated(true)
      }
    }

    createUser()
  }, [user, isUserCreated])

  return (
    <AuthContext.Provider value={{ isUserCreated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
