import userEvent from '@testing-library/user-event'

import { Card } from '../../../components/ui/card'
import { render, screen } from '../../utils/test-utils'

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Test Content</Card>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>)
    const card = screen.getByText('Content').closest('div')
    expect(card).toHaveClass('custom-class')
  })

  it('supports semantic roles for accessibility', () => {
    render(<Card role="article">Accessible Card</Card>)
    expect(screen.getByRole('article')).toHaveTextContent('Accessible Card')
  })

  it('forwards click handlers when used interactively', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    render(<Card onClick={handleClick}>Clickable</Card>)

    await user.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
