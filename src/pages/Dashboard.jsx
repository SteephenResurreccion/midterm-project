import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useBookings } from '../contexts/BookingContext'
import { useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import moment from 'moment'


export default function Dashboard() {
const { myBookings, removeBooking } = useBookings()
const [confirmId, setConfirmId] = useState(null)


return (
<div>
<h2 className="mb-3">My Bookings</h2>
{myBookings.length === 0 ? (
<p className="text-muted">No bookings yet.</p>
) : (
<Table hover responsive className="align-middle">
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
<td>{moment(b.dateISO).format('MMM DD, YYYY')}</td>
<td>{b.timeSlot}</td>
<td><small className="text-muted">{moment(b.createdAt).fromNow()}</small></td>
<td className="text-end">
<Button variant="outline-danger" size="sm" onClick={() => setConfirmId(b.id)}>
Cancel
</Button>
</td>
</tr>
))}
</tbody>
</Table>
)}


<ConfirmModal
show={!!confirmId}
title="Cancel booking?"
body="This action cannot be undone."
onCancel={() => setConfirmId(null)}
onConfirm={() => { if (confirmId) removeBooking(confirmId); setConfirmId(null) }}
/>
</div>
)
}