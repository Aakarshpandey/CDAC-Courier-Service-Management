import { createContext, useContext, useState } from 'react'

// create an empty context
const AuthContext = createContext()

function AuthProvider({ children }) {
  // create state to store logged user information
  const [authUser, setAuthUser] = useState(null)

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

// expose the context using custom hook
export function useAuth() {
  return useContext(AuthContext)
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
