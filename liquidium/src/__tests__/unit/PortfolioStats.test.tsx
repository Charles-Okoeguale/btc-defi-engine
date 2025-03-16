import { QueryClient, QueryClientProvider } from 'react-query';
import PortfolioStats from '@/components/layout/PortfolioStats';
import { getWalletData } from '@/services/api';
import { BTC_PRICE_USD } from '@/constants';
import { render, screen } from '@testing-library/react';


jest.mock('@/lib/api', () => ({
  getWalletData: jest.fn()
}));

const mockWalletData = {
  stats: {
    totalPortfolioValue: 1.5,
    availableLiquidity: 0.5
  }
};

describe('PortfolioStats', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    (getWalletData as jest.Mock).mockReset();
  });

  it('renders loading state', () => {
    (getWalletData as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <PortfolioStats />
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading portfolio stats...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    (getWalletData as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <QueryClientProvider client={queryClient}>
        <PortfolioStats />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Error loading portfolio stats')).toBeInTheDocument();
  });

  it('renders portfolio values correctly', async () => {
    (getWalletData as jest.Mock).mockResolvedValue(mockWalletData);

    render(
      <QueryClientProvider client={queryClient}>
        <PortfolioStats />
      </QueryClientProvider>
    );

    // Test BTC values
    expect(await screen.findByText('₿1.5')).toBeInTheDocument();
    expect(await screen.findByText('₿0.5')).toBeInTheDocument();

    // Test USD values
    const expectedTotalUsd = (1.5 * BTC_PRICE_USD).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    const expectedLiquidityUsd = (0.5 * BTC_PRICE_USD).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    expect(await screen.findByText(expectedTotalUsd)).toBeInTheDocument();
    expect(await screen.findByText(expectedLiquidityUsd)).toBeInTheDocument();
  });

  it('handles null stats gracefully', async () => {
    (getWalletData as jest.Mock).mockResolvedValue({ stats: null });

    render(
      <QueryClientProvider client={queryClient}>
        <PortfolioStats />
      </QueryClientProvider>
    );

    // Should show zero values
    expect(await screen.findByText('₿0')).toBeInTheDocument();
    expect(await screen.findByText('$0.00')).toBeInTheDocument();
  });

  it('calculates USD values correctly', async () => {
    (getWalletData as jest.Mock).mockResolvedValue(mockWalletData);

    render(
      <QueryClientProvider client={queryClient}>
        <PortfolioStats />
      </QueryClientProvider>
    );

    const totalUsd = 1.5 * BTC_PRICE_USD;
    const liquidityUsd = 0.5 * BTC_PRICE_USD;

    expect(await screen.findByText(`$${totalUsd.toLocaleString()}.00`)).toBeInTheDocument();
    expect(await screen.findByText(`$${liquidityUsd.toLocaleString()}.00`)).toBeInTheDocument();
  });
  
  it('calculates total portfolio value including unsupported collections', async () => {
    const mockDataWithUnsupported = {
      ordinals: [
        { slug: 'supported', floorPrice: 1.0 },
        { slug: 'unsupported', floorPrice: 0.5 }
      ]
    };
    (getWalletData as jest.Mock).mockResolvedValue(mockDataWithUnsupported);

    render(
      <QueryClientProvider client={queryClient}>
        <PortfolioStats />
      </QueryClientProvider>
    );

    // Should include both supported and unsupported (1.5 BTC total)
    expect(await screen.findByText('₿1.5')).toBeInTheDocument();
  });

  it('calculates available liquidity with minimum floor price filter', async () => {
    const mockDataWithDifferentFloors = {
      ordinals: [
        { slug: 'supported', floorPrice: 0.0007 }, // Above minimum
        { slug: 'supported', floorPrice: 0.0006 }  // Below minimum
      ]
    };
    (getWalletData as jest.Mock).mockResolvedValue(mockDataWithDifferentFloors);

    render(
      <QueryClientProvider client={queryClient}>
        <PortfolioStats />
      </QueryClientProvider>
    );

    // Should only include ordinal above 0.00065 BTC
    expect(await screen.findByText('₿0.0007')).toBeInTheDocument();
  });
});