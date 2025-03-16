import PortfolioValueCard from '@/components/modules/PortfolioValueCard';
import { render, screen } from '@testing-library/react';

describe('PortfolioValueCard', () => {
  it('renders correctly with given values', () => {
    render(
      <PortfolioValueCard
        title="Test Card"
        btcValue={1.5}
        usdValue={94500}
      />
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('₿1.5')).toBeInTheDocument();
    expect(screen.getByText('$94,500.00')).toBeInTheDocument();
  });

  it('formats numbers correctly', () => {
    render(
      <PortfolioValueCard
        title="Test Card"
        btcValue={0.00123}
        usdValue={77.49}
      />
    );

    expect(screen.getByText('₿0.00123')).toBeInTheDocument();
    expect(screen.getByText('$77.49')).toBeInTheDocument();
  });
});