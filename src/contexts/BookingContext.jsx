import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import moment from 'moment'
import { useAuth } from './AuthContext'


const BookingContext = createContext()


export function BookingProvider({ children }) {
const { user } = useAuth() || {}
const [bookings, setBookings] = useLocalStorage('bookings', [])


const addBooking = (payload) => {
// payload: {spaceId, spaceName, timeSlot, dateISO}
if (!user) return
const booking = {
id: Date.now(),
userId: user.id,
...payload,
createdAt: moment().toISOString()
}
setBookings(prev => [booking, ...prev])
}


const removeBooking = (id) => {
setBookings(prev => prev.filter(b => b.id !== id))
}


const myBookings = useMemo(
() => bookings.filter(b => user && b.userId === user.id),
[bookings, user]
)


return (
<BookingContext.Provider value={{ bookings, addBooking, removeBooking, myBookings }}>
{children}
</BookingContext.Provider>
)
}


export function useBookings() {
return useContext(BookingContext)
}