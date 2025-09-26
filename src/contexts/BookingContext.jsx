import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import moment from 'moment'
import { useAuth } from './AuthContext'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const { user } = useAuth() || {}
  const [bookings, setBookings] = useLocalStorage('bookings', [])

  // Normalize payloads from older/newer forms
  const addBooking = (payload) => {
    if (!user) return
    // accepted: { spaceId, spaceName, price, date, slot } OR { ..., dateISO, timeSlot }
    const dateISO = payload.dateISO || payload.date // store ISO YYYY-MM-DD if possible
    const timeSlot = payload.timeSlot || payload.slot

    const booking = {
      id: Date.now(),
      userId: user.id,
      spaceId: payload.spaceId,
      spaceName: payload.spaceName,
      price: payload.price,
      date: dateISO,            // keep as 'YYYY-MM-DD' string
      timeSlot,                 // always the canonical field
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
export default BookingContext