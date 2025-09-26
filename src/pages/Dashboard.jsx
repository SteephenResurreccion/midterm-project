import { useBookings } from '../contexts/BookingContext'
import moment from 'moment'
import { Button } from 'react-bootstrap'

export default function Dashboard() {
  const { myBookings, removeBooking } = useBookings()

  return (
    <div>
      <h3 className="mb-3">My Bookings</h3>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Space</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Booked</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myBookings.map(b => (
              <tr key={b.id}>
                <td>{b.spaceName}</td>
                <td>{moment(b.date).format('MMM D, YYYY')}</td>
                <td>{b.timeSlot || b.slot || '—'}</td>
                <td>{moment(b.createdAt).fromNow()}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeBooking(b.id)}
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
            {myBookings.length === 0 && (
              <tr><td colSpan={5} className="text-muted">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}