import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import DashboardCard from '../components/DashboardCard'

describe('DashboardCard', () => {

  it('renders title and value', () => {
    render(
      <DashboardCard
        title="Total Customers"
        value={4}
      />
    )

    expect(screen.getByText('Total Customers')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders string and numeric values correctly', () => {
    const { rerender } = render(
      <DashboardCard
        title="Revenue"
        value="P0"
      />
    )

    expect(screen.getByText('P0')).toBeInTheDocument()

    rerender(
      <DashboardCard
        title="Revenue"
        value={100}
      />
    )

    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders without crashing when optional props are missing', () => {
    render(
      <DashboardCard
        title="Active Orders"
        value={6}
      />
    )

    expect(screen.getByText('Active Orders')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(
      <DashboardCard
        title="Low Stock"
        value={2}
        icon="Warning"
      />
    )

    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('handles missing value gracefully', () => {
    render(
      <DashboardCard
        title="Incomplete Card"
      />
    )

    expect(screen.getByText('Incomplete Card')).toBeInTheDocument()
  })

})