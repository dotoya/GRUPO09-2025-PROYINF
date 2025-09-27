import React from 'react'
import './Products.css'

export default function Products(){
  const items = [
    {id:1,title:'Prestamo',desc:'Prestamos sencillos y seguros.'},
    {id:2,title:'Pagos',desc:'Formas de pago justas y con recordatorios apropiados.'},
    {id:3,title:'Ayuda al cliente',desc:'Porque sabemos los confuso que puede ser hacer un prestamo.'}
  ]

  return (
    <section id="products" className="products">
      <div className="grid">
        {items.map(it=> (
          <article key={it.id} className="card">
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#eef6ff" />
                <path d="M7 12h10M7 8h10M7 16h6" stroke="#1f6feb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h3>{it.title}</h3>
                <p>{it.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
