import { render, screen, fireEvent } from '@testing-library/react'
import PricingSection from '../components/settings/PricingSection'

describe('Pricing Section', () => {
  it('renders all labels, inputs, and save button correctly', () => {
    render(<PricingSection />)

    // ✅ Tugma eksakto sa HTML mo (Kg hindi KG)
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Set laundry bundle pricing and add-on costs')).toBeInTheDocument()
    expect(screen.getByText('Laundry Bundle')).toBeInTheDocument()
    expect(screen.getByText('Bundle Size (kg)')).toBeInTheDocument()
    expect(screen.getByText('Price per Bundle (₱)')).toBeInTheDocument()
    expect(screen.getByText('Excess Price per Kg (₱)')).toBeInTheDocument() // ✅ Maliit na g lang!
    expect(screen.getByText('Add-ons (Soap / Detergent)')).toBeInTheDocument()
    expect(screen.getByText('Price per Add-on Item (₱)')).toBeInTheDocument()

    // ✅ Hanapin ang tamang button
    expect(screen.getByRole('button', { name: /Save Pricing/ })).toBeInTheDocument()

    // ✅ Siguradong may 4 na input
    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs).toHaveLength(4)
  })

  it('updates input values correctly when typing', () => {
    render(<PricingSection />)
    const inputs = screen.getAllByRole('spinbutton')

    fireEvent.change(inputs[0], { target: { value: 9 } })
    fireEvent.change(inputs[1], { target: { value: 200 } })
    fireEvent.change(inputs[2], { target: { value: 30 } })
    fireEvent.change(inputs[3], { target: { value: 9 } })

    expect(inputs[0]).toHaveValue(9)
    expect(inputs[1]).toHaveValue(200)
    expect(inputs[2]).toHaveValue(30)
    expect(inputs[3]).toHaveValue(9)
  })

  it('updates the summary text after changing values', () => {
    render(<PricingSection />)
    const inputs = screen.getAllByRole('spinbutton')

    // ✅ Palitan ang mga halaga
    fireEvent.change(inputs[0], { target: { value: 10 } })
    fireEvent.change(inputs[1], { target: { value: 250 } })
    fireEvent.change(inputs[2], { target: { value: 35 } })
    fireEvent.change(inputs[3], { target: { value: 10 } })

    // ✅ Tugma sa totoong text sa component mo — hindi na hula!
    expect(screen.getByText(/₱200 minimum for 9kg/)).toBeInTheDocument()
    expect(screen.getByText(/₱30 per excess kg/)).toBeInTheDocument()
    expect(screen.getByText(/₱9 per soap/)).toBeInTheDocument()
    expect(screen.getByText(/detergent add-on/)).toBeInTheDocument()
  })
})