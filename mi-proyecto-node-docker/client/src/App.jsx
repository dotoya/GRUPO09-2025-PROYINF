import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import LoggedIn from './pages/LoggedIn'
import {useState, useEffect} from 'react'

export default function App(){
  const [path, setPath] = useState(window.location.pathname)
  useEffect(()=>{
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return ()=> window.removeEventListener('popstate', onPop)
  }, [])

  if (path === '/login') {
    return (
      <div>
        <Header />
        <Login />
      </div>
    )
  }

  if (path === '/register') {
    return (
      <div>
        <Header />
        <Register />
      </div>
    )
  }

  if (path === '/loggedin') {
    return (
      <div>
        <LoggedIn />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <Hero />

      <main className="container" style={{paddingTop:20}}>
        <h2 className="section-title">Estamos aqui para ti</h2>
        <p className="text-muted">Nos basamos en los principales servicios:</p>
      </main>

      <Products />
      <Footer />
    </div>
  )
}
