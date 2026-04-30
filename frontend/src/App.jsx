// frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Gallery from './pages/Gallery'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <PageLoader />
      <Navbar />

      {/* min-height ensures footer is always pushed to the bottom */}
      <div style={{ minHeight: 'calc(100vh - var(--nav-height))' }}>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/upload"  element={<Upload />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  )
}