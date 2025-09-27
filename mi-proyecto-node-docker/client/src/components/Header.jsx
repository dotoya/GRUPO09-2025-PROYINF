import React from 'react'
import './Header.css'

export default function Header(){
  const navigate = (e, to) => {
    e.preventDefault()
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <header className="site-header">
      <div className="logo">
        <div className="logo-mark" aria-hidden>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#0f62fe" offset="0%" />
                <stop stopColor="#1f6feb" offset="100%" />
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="8" fill="url(#g1)" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">MA</text>
          </svg>
        </div>
        <div className="logo-text">Mi App</div>
      </div>

      <nav>
        <a href="/" onClick={(e)=>navigate(e, '/')}>Inicio</a>
        <a href="/login" onClick={(e)=>navigate(e, '/login')}>Iniciar sesión</a>
        <a href="#prestamo">Prestamo</a>
        <a href="#contact">Contacto</a>
      </nav>
    </header>
  )
}
