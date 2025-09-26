import { useState, useMemo } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import moment from 'moment'
import { useBookings } from '../contexts/BookingContext'

export default function BookingForm({ space }) {
  const { bookings, addBooking } = useBookings()

  const nowGmt8 = useMemo(() => moment().utcOffset(8), [])
  const nowStr   = useMemo(() => nowGmt8.format('YYYY-MM-DD HH:mm'), [nowGmt8])
  const todayStr = useMemo(() => nowGmt8.format('YYYY-MM-DD'),     [nowGmt8])

  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [msg, setMsg]   = useState(null)

  const slots = [
    '08:00–10:00','10:00–12:00','12:00–14:00',
    '14:00–16:00','16:00–18:00','18:00–20:00','20:00–22:00'
  ]

  const slotStartToMinutes = (s) => {
    const [start] = s.split('–')
    const [H,M] = start.split(':').map(Number)
    return H*60 + M
  }

  const availableSlots = useMemo(() => {
    if (!date) return slots
    if (date !== todayStr) return slots
    const nowMins = nowGmt8.hours()*60 + nowGmt8.minutes()
    return slots.filter(s => slotStartToMinutes(s) > nowMins)
  }, [date, todayStr, nowGmt8])

  const noSlotsToday = date && date === todayStr && availableSlots.length === 0

  const handleSubmit = (e) => {
    e.preventDefault()
    setMsg(null)

    if (!date || !slot) {
      setMsg({ type: 'danger', text: 'Please select a date and time slot.' })
      return
    }
    if (moment(date).isBefore(todayStr)) {
      setMsg({ type: 'danger', text: 'You cannot book a past date.' })
      return
    }
    if (date === todayStr && !availableSlots.includes(slot)) {
      setMsg({ type: 'warning', text: 'That time already started. Pick a later slot.' })
      return
    }

    // 🔒 duplicate prevention (accepts both legacy b.slot and canonical b.timeSlot)
    const duplicate = bookings.some(b =>
      String(b.spaceId) === String(space?.id) &&
      (b.date === date) &&
      ((b.timeSlot || b.slot) === slot)
    )
    if (duplicate) {
      setMsg({ type: 'danger', text: 'You already booked this space at that date and time.' })
      return
    }

    // save using canonical field names the Provider expects
    addBooking({
      spaceId: space.id,
      spaceName: space.name,
      price: space.price,
      dateISO: date,     // canonical date
      timeSlot: slot     // canonical time slot
    })

    setMsg({ type: 'success', text: `Booked “${space.name}” on ${date} at ${slot}.` })
    setDate('')
    setSlot('')
  }

  return (
    <div className="booking-form-box p-3 border rounded bg-white">
      <div className="small text-muted mb-2">
        Current time: <strong>{nowStr}</strong> (converted to GMT+8)
      </div>

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            min={todayStr}
            onChange={(e) => { setDate(e.target.value); setSlot(''); setMsg(null) }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Time Slot</Form.Label>
          <Form.Select
            value={slot}
            onChange={(e) => { setSlot(e.target.value); setMsg(null) }}
            disabled={!date || availableSlots.length === 0}
          >
            <option value="">
              {noSlotsToday ? 'No slots left today (GMT+8)' : 'Select…'}
            </option>
            {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">Book Slot</Button>
      </Form>

      {msg && <Alert variant={msg.type} className="mt-3 mb-0">{msg.text}</Alert>}
    </div>
  )
}