import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'


const AuthContext = createContext()


export function AuthProvider({ children }) {
const [user, setUser] = useLocalStorage('user', null)


const login = (email = 'demo@user.com') => {
setUser({ id: 1, name: 'Demo User', email })
}


const logout = () => setUser(null)


return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
)
}


export function useAuth() {
return useContext(AuthContext)
}