import React, {useState} from 'react'
import './Login.css'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const body = await res.json()
      if (!res.ok) {
        setError(body.message || 'Error en inicio de sesión')
        setLoading(false)
        return
      }

      const { token } = body
      if (token) {
        localStorage.setItem('token', token)
        window.history.pushState({}, '', '/loggedin')
        window.dispatchEvent(new PopStateEvent('popstate'))
      } else {
        setError('No se recibió token del servidor')
      }
    } catch (err) {
      console.error('login error', err)
      setError('Error de red al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        {error && <div className="form-error">{error}</div>}
        <label>
          Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        <p style={{marginTop:12,fontSize:14}}>¿No tienes cuenta? <a href="/register" onClick={(e)=>{e.preventDefault(); window.history.pushState({}, '', '/register'); window.dispatchEvent(new PopStateEvent('popstate'))}}>Regístrate</a></p>
      </form>
    </div>
  )
}
