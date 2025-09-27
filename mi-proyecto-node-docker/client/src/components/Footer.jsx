import React from 'react'
import './Footer.css'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="inner">© {new Date().getFullYear()} Mi App</div>
    </footer>
  )
}
