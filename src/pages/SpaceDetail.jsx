import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import BookingForm from '../components/BookingForm'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from 'react-bootstrap'
import { BsStarFill, BsStar } from 'react-icons/bs'

export default function SpaceDetail() {
const { spaceId } = useParams()
const [space, setSpace] = useState(null)

useEffect(() => {
axios.get('/data/spaces.json').then(({ data }) => {
const found = (Array.isArray(data) ? data : []).find(s => String(s.id) === String(spaceId))
setSpace(found || null)
})
}, [spaceId])

const imgs = useMemo(() => {
if (!space) return []
return Array.isArray(space.images) && space.images.length ? space.images : [space.main_image]
}, [space])

// ===== gallery state =====
const [[page, dir], setPage] = useState([0, 0])
const index = imgs.length ? (page % imgs.length + imgs.length) % imgs.length : 0

const variants = {
enter: d => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
center: { x: 0, opacity: 1, zIndex: 1 },
exit: d => ({ x: d > 0 ? -300 : 300, opacity: 0, zIndex: 0 }),
}

const paginate = (delta) => setPage(([p]) => [p + delta, delta])

// auto scroll timer
const timerRef = useRef(null)
const startAuto = () => {
clearInterval(timerRef.current)
if (imgs.length > 1) timerRef.current = setInterval(() => paginate(1), 4000)
}
useEffect(() => {
startAuto()
return () => clearInterval(timerRef.current)
}, [imgs])

const goPrev = () => { paginate(-1); startAuto() }
const goNext = () => { paginate(1); startAuto() }
const goIndex = (i) => {
const cur = index
const delta = (i - cur + imgs.length) % imgs.length
setPage([i, delta === 0 ? 1 : (delta <= imgs.length / 2 ? 1 : -1)])
startAuto()
}

// thumbs centering
const thumbsRef = useRef(null)
useEffect(() => {
const el = thumbsRef.current; if (!el) return
const active = el.querySelector('[data-active="true"]'); if (!active) return
const a = active.getBoundingClientRect(), e = el.getBoundingClientRect()
el.scrollBy({ left: (a.left + a.right - e.left - e.right) / 2, behavior: 'smooth' })
}, [index])

// sample reviews
const sampleReviews = [
{ name: 'Aira P.', rating: 5, date: '2025-08-11', text: 'Quiet space, strong Wi-Fi, and lots of outlets. Coffee nearby was a plus.' },
{ name: 'Ken L.', rating: 4, date: '2025-07-02', text: 'Clean and well-lit. AC is good. Would love a few more soft chairs.' },
{ name: 'Migs R.', rating: 5, date: '2025-06-18', text: 'Booked a 2-hour slot for a call—room was spotless and staff was friendly.' },
{ name: 'Jules C.',rating: 4, date: '2025-05-30', text: 'Plenty of desk space and power strips. Gets busy late afternoon.' }
]
const Stars = ({ rating }) => (
<span className="stars">
{Array.from({ length: 5 }).map((_, i) => i < rating ? <BsStarFill key={i}/> : <BsStar key={i}/> )}
</span>
)

if (!space) return <p className="py-4">Loading…</p>

return (
<div className="space-detail-grid">
{/* LEFT */}
<section>
{imgs.length > 0 && (
<>
<div className="gallery-hero-wrap">
<AnimatePresence initial={false} custom={dir} mode="wait">
<motion.img
key={page}
src={imgs[index]}
alt={space.name}
className="gallery-hero"
custom={dir}
variants={variants}
initial="enter"
animate="center"
exit="exit"
transition={{ duration: 0.55, ease: 'easeInOut' }}
/>
</AnimatePresence>
{imgs.length > 1 && (
<>
<button className="gallery-arrow left" onClick={goPrev}>‹</button>
<button className="gallery-arrow right" onClick={goNext}>›</button>
</>
)}
</div>

{imgs.length > 1 && (
<div className="thumbs-row" ref={thumbsRef}>
{imgs.map((src, i) => (
<button
key={src+i}
className={`thumb ${i===index?'active':''}`}
onClick={() => goIndex(i)}
data-active={i===index}
>
<img src={src} alt={`Thumb ${i+1}`} />
</button>
))}
</div>
)}
</>
)}

<h2 className="mb-1">{space.name}</h2>
<div className="text-muted mb-2">{space.location} · <strong>₱{space.price}</strong></div>
<p>{space.description}</p>

{space.amenities?.length > 0 && (
<div className="amenities-wrap mb-3">
{space.amenities.map(a => <span key={a} className="amenity-pill">{a}</span>)}
</div>
)}
{space.hours && typeof space.hours === 'object' && (
  <div className="hours-box mt-3">
    <h6 className="mb-2">Opening Hours</h6>
    <table className="hours-table">
      <tbody>
        {Object.entries(space.hours).map(([day, hours]) => (
          <tr key={day}>
            <td className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</td>
            <td className="hours">{hours}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
</section>

{/* RIGHT */}
<aside>
<h5 className="mb-2">Book this space</h5>
<BookingForm space={space} />

{/* feedback / reviews */}
<div className="reviews mt-4">
<div className="d-flex justify-content-between align-items-center mb-2">
<h6 className="mb-0">Recent reviews</h6>
<small className="text-muted">Example data only</small>
</div>
<ul className="list-unstyled m-0">
{sampleReviews.map((r, idx) => (
<li key={idx} className="review">
<div className="d-flex justify-content-between">
<strong>{r.name}</strong>
<small className="text-muted">{r.date}</small>
</div>
<Stars rating={r.rating} />
<p className="mb-0">{r.text}</p>
</li>
))}
</ul>
<small className="text-muted d-block mt-2">
These reviews are examples for design/testing purposes only.
</small>
</div>
</aside>
</div>
)
}
