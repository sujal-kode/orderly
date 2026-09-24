import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './components/App.js'
import '../css/app.css'
import 'leaflet/dist/leaflet.css'

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
