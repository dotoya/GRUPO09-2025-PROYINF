import React from 'react'
import './Hero.css'

export default function Hero(){
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1>Bienvenido al Banco</h1>
        <p>Donde somos tu mayor apoyo.</p>
        <a className="cta" href="#products">Conoce más</a>
        <div style={{marginTop:24}} aria-hidden>
          <svg width="320" height="80" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lg2" x1="0" x2="1"><stop offset="0" stopColor="#e6f0ff"/><stop offset="1" stopColor="#ffffff"/></linearGradient>
            </defs>
            <rect rx="12" width="320" height="80" fill="url(#lg2)" />
          </svg>
        </div>
      </div>
    </section>
  )
}
