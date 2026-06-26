import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../components/Header'

describe('Header', () => {
  it('renders the shop name', () => {
    render(<Header />)
    expect(screen.getByText("I&C Laundry Shop")).toBeTruthy()
  })

  it('renders admin name', () => {
    render(<Header />)
    expect(screen.getByText("Admin")).toBeTruthy()
  })

  it('renders admin email', () => {
    render(<Header />)
    expect(screen.getByText("admin@iclaundry.com")).toBeTruthy()
  })

  it('renders admin avatar initial', () => {
    render(<Header />)
    expect(screen.getByText("A")).toBeTruthy()
  })
})
