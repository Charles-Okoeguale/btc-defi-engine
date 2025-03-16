import OrdinalsGrid from '@/components/layout/OrdinalGrid';
import { getSupportedCollections, getWalletData } from '@/services/api';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock the API calls
jest.mock('@/lib/api', () => ({
  getWalletData: jest.fn(),
  getSupportedCollections: jest.fn()
}));

const mockWalletData = {
  ordinals: [
    { 
      inscription_id: '1',
      name: 'Bitcoin Punk #123',
      slug: 'bitcoin-punks',
      image: 'image1.jpg',
      collection: 'Bitcoin Punks'
    },
    { 
      inscription_id: '2',
      name: 'Ordinal Ape #456',
      slug: 'ordinal-apes',
      image: 'image2.jpg',
      collection: 'Ordinal Apes'
    },
    { 
      inscription_id: '3',
      name: 'Unsupported NFT',
      slug: 'unsupported',
      image: 'image3.jpg',
      collection: 'Unsupported'
    }
  ]
};

const mockSupportedCollections = [
  { slug: 'bitcoin-punks', floorPrice: 1.2 },
  { slug: 'ordinal-apes', floorPrice: 0.8 }
];

describe('OrdinalsGrid', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    (getWalletData as jest.Mock).mockReset();
    (getSupportedCollections as jest.Mock).mockReset();
  });

  it('filters and displays only supported collections', async () => {
    (getWalletData as jest.Mock).mockResolvedValue(mockWalletData);
    (getSupportedCollections as jest.Mock).mockResolvedValue(mockSupportedCollections);

    render(
      <QueryClientProvider client={queryClient}>
        <OrdinalsGrid />
      </QueryClientProvider>
    );

    // Should show supported collections
    expect(await screen.findByText('Bitcoin Punk #123')).toBeInTheDocument();
    expect(await screen.findByText('Ordinal Ape #456')).toBeInTheDocument();

    // Should not show unsupported collection
    expect(screen.queryByText('Unsupported NFT')).not.toBeInTheDocument();
  });

  it('search functionality works correctly', async () => {
    (getWalletData as jest.Mock).mockResolvedValue(mockWalletData);
    (getSupportedCollections as jest.Mock).mockResolvedValue(mockSupportedCollections);

    render(
      <QueryClientProvider client={queryClient}>
        <OrdinalsGrid />
      </QueryClientProvider>
    );

    // Wait for initial load
    await screen.findByText('Bitcoin Punk #123');

    // Get search input
    const searchInput = screen.getByPlaceholderText('Search ordinals...');

    // Test search by name
    fireEvent.change(searchInput, { target: { value: 'Punk' } });
    expect(screen.getByText('Bitcoin Punk #123')).toBeInTheDocument();
    expect(screen.queryByText('Ordinal Ape #456')).not.toBeInTheDocument();

    // Test search by collection
    fireEvent.change(searchInput, { target: { value: 'Apes' } });
    expect(screen.queryByText('Bitcoin Punk #123')).not.toBeInTheDocument();
    expect(screen.getByText('Ordinal Ape #456')).toBeInTheDocument();

    // Test empty search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Bitcoin Punk #123')).toBeInTheDocument();
    expect(screen.getByText('Ordinal Ape #456')).toBeInTheDocument();
  });

  it('displays correct ordinal information', async () => {
    (getWalletData as jest.Mock).mockResolvedValue(mockWalletData);
    (getSupportedCollections as jest.Mock).mockResolvedValue(mockSupportedCollections);

    render(
      <QueryClientProvider client={queryClient}>
        <OrdinalsGrid />
      </QueryClientProvider>
    );

    // Check if all ordinal information is displayed correctly
    const ordinal = await screen.findByText('Bitcoin Punk #123');
    const ordinalCard = ordinal.closest('div');

    expect(ordinalCard).toHaveTextContent('Bitcoin Punks'); // Collection name
    expect(ordinalCard).toHaveTextContent('₿1.2'); // Floor price
    expect(ordinalCard?.querySelector('img')).toHaveAttribute('src', 'image1.jpg');
    expect(ordinalCard?.querySelector('button')).toHaveTextContent('Create Offer');
  });

  it('handles loading state', () => {
    (getWalletData as jest.Mock).mockImplementation(() => new Promise(() => {}));
    (getSupportedCollections as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <OrdinalsGrid />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (getWalletData as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <QueryClientProvider client={queryClient}>
        <OrdinalsGrid />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('handles empty state', async () => {
    (getWalletData as jest.Mock).mockResolvedValue({ ordinals: [] });
    (getSupportedCollections as jest.Mock).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <OrdinalsGrid />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/no supported ordinals found/i)).toBeInTheDocument();
  });
});