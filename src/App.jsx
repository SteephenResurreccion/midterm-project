import { Fragment } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Header from './components/Header'
import Home from './pages/Home'
import SpaceDetail from './pages/SpaceDetail'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Fragment>
      <Header />
        <Container className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/space/:spaceId" element={<SpaceDetail />} />
            <Route path="/dashboard/my-bookings" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
    </Fragment>
  )
}