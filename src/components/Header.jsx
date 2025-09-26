import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BsBookmarks, BsDoorOpen, BsDoorClosed } from 'react-icons/bs'
import useScrollDirection from '../hooks/useScrollDirection'

export default function Header() {
  const { user, login, logout } = useAuth()
  const { direction, isAtTop } = useScrollDirection()

  const navClasses = [
    'site-nav',
    direction === 'down' ? 'nav-hide' : 'nav-show',
    isAtTop ? '' : 'nav-elevated nav-rounded'
  ].join(' ').trim()

  return (
    <Navbar expand="md" className={navClasses}>
      <Container className="px-3">
        <Navbar.Brand as={Link} to="/" className="brand">
        ThinkSpace
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard/my-bookings">
              <BsBookmarks className="me-1" />
              My Bookings
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="nav-user small text-muted d-none d-md-inline">
                  Signed in as <strong>{user.name}</strong>
                </span>
                <Button variant="outline-danger" size="sm" onClick={logout}>
                  <BsDoorClosed className="me-1" /> Logout
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => login()}>
                <BsDoorOpen className="me-1" /> Demo Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}