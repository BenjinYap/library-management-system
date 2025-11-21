import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  fullName: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  userId: number | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch user info for user ID 1 (hardcoded current user)
    // In a real app, this would come from authentication
    fetch('http://localhost:3001/api/user/1')
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching user:', err)
        setLoading(false)
      })
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, userId: user?.id ?? null }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
