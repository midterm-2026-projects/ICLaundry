import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import DashboardCard from '../components/DashboardCard'

describe('DashboardCard', () => {

  it('renders provided title, value, and icon', () => {
    // Arrange
    const icon = (
      <svg data-testid="warning-icon">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )

    // Act
    render(
      <DashboardCard
        title="Low Stock"
        value={2}
        icon={icon}
      />
    )

    // Assert
    expect(screen.getByText('Low Stock')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
  })

  it('renders default value when value is not provided', () => {
    // Arrange
    const icon = (
      <svg data-testid="info-icon">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )

    // Act
    render(
      <DashboardCard
        title="Incomplete Card"
        icon={icon}
      />
    )

    // Assert
    expect(screen.getByText('Incomplete Card')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByTestId('info-icon')).toBeInTheDocument()
  })

  it('renders default title when title is not provided', () => {
    // Arrange
    const icon = (
      <svg data-testid="users-icon">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )

    // Act
    render(
      <DashboardCard
        value={10}
        icon={icon}
      />
    )

    // Assert
    expect(screen.getByText('Title Card')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
  })

  it('renders default icon when icon is not provided', () => {
    // Arrange

    // Act
    render(
      <DashboardCard
        title="Total Customers"
        value={4}
      />
    )

    // Assert
    expect(screen.getByText('Total Customers')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('Default Icon')).toBeInTheDocument()
  })

  it('renders all default values when no props are provided', () => {
  
    // Act
    render(<DashboardCard />)

    // Assert
    expect(screen.getByText('Title Card')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Default Icon')).toBeInTheDocument()
  })

})