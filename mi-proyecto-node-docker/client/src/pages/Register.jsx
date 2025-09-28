import React, {useState} from 'react'
import './Register.css'

// Valida RUT chileno (cálculo dígito verificador)
function cleanRut(value){
  if(!value) return ''
  return value.toUpperCase().replace(/\./g,'').replace(/\s/g,'').replace(/-/g,'')
}

function computeDv(rutBody){
  // rutBody expected as string of digits
  let sum = 0
  let multiplier = 2
  for(let i = rutBody.length - 1; i >= 0; i--) {
    sum += parseInt(rutBody.charAt(i), 10) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const mod = 11 - (sum % 11)
  if(mod === 11) return '0'
  if(mod === 10) return 'K'
  return String(mod)
}

function validateRut(rut){
  const cleaned = cleanRut(rut)
  if(!cleaned) return false
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  if(!/^[0-9]+$/.test(body)) return false
  const expected = computeDv(body)
  return expected === dv
}

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rut, setRut] = useState('')
  const [rutError, setRutError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!validateRut(rut)){
      setRutError('RUT inválido. Verifica el número y el dígito verificador (ej: 12.345.678-5)')
      return
    }
    setRutError('')
    const cleanedRut = cleanRut(rut)
    const payload = {
      nombre_completo: name,
      gmail: email,
      contraseña: password,
      rut: cleanedRut
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        alert('Registro exitoso')
        // Opcional: limpiar campos
        setName('')
        setEmail('')
        setPassword('')
        setRut('')
      } else {
        const data = await res.json()
        alert('Error: ' + (data.error || 'No se pudo registrar'))
      }
    } catch (err) {
      alert('Error de conexión con el servidor')
    }
  }

  const handleRutChange = (e) => {
    // Forzar que el usuario ingrese sin puntos: eliminamos puntos y espacios en tiempo real
    const raw = e.target.value
    const cleanedInput = raw.replace(/\./g, '').replace(/\s/g, '').toUpperCase()
    setRut(cleanedInput)
    if(rutError) setRutError('')
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Registro</h2>
        <label>
          Nombre y apellido
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </label>
        <label>
          RUT (sin puntos)
          <input value={rut} onChange={handleRutChange} placeholder="12345678-9" required />
        </label>
        {rutError && <div className="field-error">{rutError}</div>}
        <label>
          Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <button type="submit">Crear cuenta</button>
      </form>
    </div>
  )
}
