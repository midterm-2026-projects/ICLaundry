import React from 'react'
export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  return (
    <div className="dashboard-header">
      <h1>I&C Laundry Shop</h1>
      <div className="header-right">
        <span className="date-text">{today}</span>
        <div className="admin-avatar">A</div>
        <div className="admin-info">
          <div className="name">Admin</div>
          <div className="email">admin@iclaundry.com</div>
        </div>
      </div>
    </div>
  )
}