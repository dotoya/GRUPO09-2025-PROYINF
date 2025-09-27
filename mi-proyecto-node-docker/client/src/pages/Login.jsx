import React, {useState} from 'react'
import './Login.css'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí podrías enviar credenciales al backend. Por ahora mostramos en consola.
    console.log('login', {email, password})
  // Demo: redirigir a la página que indica que iniciaste sesión
  window.history.pushState({}, '', '/loggedin')
  window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <label>
          Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <button type="submit">Entrar</button>
        <p style={{marginTop:12,fontSize:14}}>¿No tienes cuenta? <a href="/register" onClick={(e)=>{e.preventDefault(); window.history.pushState({}, '', '/register'); window.dispatchEvent(new PopStateEvent('popstate'))}}>Regístrate</a></p>
      </form>
    </div>
  )
}
