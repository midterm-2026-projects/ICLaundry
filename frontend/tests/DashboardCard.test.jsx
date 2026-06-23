import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DashboardCard from "../components/DashboardCard";

describe('DashboardCard', () => {
  it('displays title and value correctly', () => {
    render(
      <DashboardCard
        title="Today's Revenue"
        value="P0"
        icon="P"
      
      />
    )
    expect(screen.getByText("Today's Revenue")).toBeTruthy()
    expect(screen.getByText("P0")).toBeTruthy()
  })

  it('renders total customers correctly', () => {
    render(
      <DashboardCard
        title="Total Customers"
        value={4}
      
        
      />
    )
    expect(screen.getByText("Total Customers")).toBeTruthy()
    expect(screen.getByText("4")).toBeTruthy()
  })

  it('renders with default color when no color prop', () => {
    render(
      <DashboardCard
        title="Active Orders"
        value={6}
        icon="Clock"
      />
    )
    expect(screen.getByText("Active Orders")).toBeTruthy()
    expect(screen.getByText("6")).toBeTruthy()
  })

  it('renders icon correctly', () => {
    render(
      <DashboardCard
        title="Low Stock"
        value={2}
        icon="Warning"
        color="#f59e0b"
      />
    )
    expect(screen.getByText("Warning")).toBeTruthy()
  })
})
