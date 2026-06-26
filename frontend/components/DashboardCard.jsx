import React from 'react'

const DashboardCard = ({
  title = 'Title Card',
  value = 0,
  icon = <span>Default Icon</span>,
  color = '#0ea5e9'
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1.25rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}
    >
      <div
        data-testid="dashboard-icon"
        style={{
          color,
          marginBottom: '0.75rem'
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '0.25rem'
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: '12px',
          color: '#6b7280'
        }}
      >
        {title}
      </div>
    </div>
  )
}

export default DashboardCard