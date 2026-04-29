// frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Gallery from './pages/Gallery'

export default function App() {
  return (
    // BrowserRouter enables client-side navigation (no full page reloads)
    <BrowserRouter>
      {/* Navbar is outside Routes so it appears on every page */}
      <Navbar />

      {/* Routes renders whichever page matches the current URL */}
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/upload"  element={<Upload />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* Catch-all: any unknown URL redirects to home */}
        <Route path="*"        element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}