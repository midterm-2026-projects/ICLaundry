import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import DashboardCard from '../components/DashboardCard'

describe('DashboardCard', () => {

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

  it('renders without value', () => {
    render(
      <DashboardCard
        title="Incomplete Card"
        icon="Info"
      />
    )

    expect(screen.getByText('Incomplete Card')).toBeInTheDocument()
  })

  it('renders without title', () => {
    render(
      <DashboardCard
        value={10}
        icon="Users"
      />
    )

    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders without icon', () => {
    render(
      <DashboardCard
        title="Total Customers"
        value={4}
      />
    )

    expect(screen.getByText('Total Customers')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders with only title', () => {
    render(
      <DashboardCard
        title="Revenue"
      />
    )

    expect(screen.getByText('Revenue')).toBeInTheDocument()
  })

  it('renders with only value', () => {
    render(
      <DashboardCard
        value={100}
      />
    )

    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders even when no props are provided', () => {
    const { container } = render(<DashboardCard />)

    expect(container.firstChild).toBeInTheDocument()
  })

})