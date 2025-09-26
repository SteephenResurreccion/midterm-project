import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

export default function SpaceCard({ space }) {
  const imgs = Array.isArray(space.images) && space.images.length
    ? space.images
    : (space.main_image ? [space.main_image] : [])
  const firstImg = imgs[0] || ''

  return (
    <Card className="h-100 card-plain">
      {firstImg && (
        <Card.Img
          variant="top"
          src={firstImg}
          alt={space.name}
          className="card-img-top fixed"
          loading="lazy"
        />
      )}

      <Card.Body className="p-3">
        <Card.Title className="d-flex align-items-baseline justify-content-between gap-2 mb-1">
          <span className="title-2">{space.name}</span>
          <span className="price fw-bold">₱{space.price}</span>
        </Card.Title>

        <p className="meta-line mb-1"><small>{space.location}</small></p>

        <p className="desc-2">{space.description}</p>

        <Button
          as={Link}
          to={`/space/${space.id}`}
          variant="outline-primary"
          size="sm"
          className="btn-row"
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  )
}