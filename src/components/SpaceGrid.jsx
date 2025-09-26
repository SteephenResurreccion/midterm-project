import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SpaceCard from './SpaceCard'

export default function SpaceGrid({ spaces = [] }) {
  return (
    <Row className="g-4">
      {spaces.map(space => (
        <Col key={space.id} xs={12} md={6} lg={4}>
          <SpaceCard space={space} />
        </Col>
      ))}
    </Row>
  )
}