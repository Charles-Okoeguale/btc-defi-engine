import OfferTable from '@/components/layout/OfferTable';
import { deleteOffer, getOffers, updateOffer } from '@/services/api';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock API calls
jest.mock('@/lib/api', () => ({
  getOffers: jest.fn(),
  deleteOffer: jest.fn(),
  updateOffer: jest.fn()
}));

const mockOffers = [
  {
    id: '1',
    ordinalId: 'ord1',
    ordinalName: 'Bitcoin Punk #1',
    amount: 0.5,
    floorPrice: 1.0, // LTV should be 50%
    term: 30,
    interest: 10,
    collection: 'Bitcoin Punks'
  },
  {
    id: '2',
    ordinalId: 'ord2',
    ordinalName: 'Ordinal Ape #2',
    amount: 0.8,
    floorPrice: 1.0, // LTV should be 80%
    term: 60,
    interest: 15,
    collection: 'Ordinal Apes'
  }
];

describe('OfferTable', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('Loading and Data States', () => {
    it('shows loading state', () => {
      (getOffers as jest.Mock).mockImplementation(() => new Promise(() => {}));

      render(
        <QueryClientProvider client={queryClient}>
          <OfferTable />
        </QueryClientProvider>
      );

      expect(screen.getByText('Loading offers...')).toBeInTheDocument();
    });

    it('shows error state', async () => {
      (getOffers as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      render(
        <QueryClientProvider client={queryClient}>
          <OfferTable />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading offers')).toBeInTheDocument();
      });
    });

    it('shows empty state', async () => {
      (getOffers as jest.Mock).mockResolvedValueOnce([]);

      render(
        <QueryClientProvider client={queryClient}>
          <OfferTable />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('No offers found')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Functionality', () => {
    beforeEach(() => {
      (getOffers as jest.Mock).mockResolvedValue(mockOffers);
    });

    it('opens edit modal with correct offer data', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <OfferTable />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Bitcoin Punk #1')).toBeInTheDocument();
      });

      // Click edit button on first offer
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      // Verify modal opens with correct data
      expect(screen.getByDisplayValue('0.5')).toBeInTheDocument(); // Amount
      expect(screen.getByDisplayValue('30')).toBeInTheDocument(); // Term
      expect(screen.getByDisplayValue('10')).toBeInTheDocument(); // Interest
    });

    it('updates offer successfully', async () => {
      (updateOffer as jest.Mock).mockResolvedValueOnce({ success: true });

      render(
        <QueryClientProvider client={queryClient}>
          <OfferTable />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Bitcoin Punk #1')).toBeInTheDocument();
      });

      // Open edit modal
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      // Update values
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0.6' } });
      fireEvent.change(screen.getByLabelText('Term'), { target: { value: '45' } });
      
      // Submit changes
      fireEvent.click(screen.getByText('Save changes'));

      await waitFor(() => {
        expect(updateOffer).toHaveBeenCalledWith('1', expect.objectContaining({
          amount: 0.6,
          term: 45
        }));
        expect(screen.getByText('Offer updated successfully')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Functionality', () => {
    beforeEach(() => {
      (getOffers as jest.Mock).mockResolvedValue(mockOffers);
    });

    it('deletes offer successfully', async () => {
      (deleteOffer as jest.Mock).mockResolvedValueOnce({ success: true });

      render(
        <QueryClientProvider client={queryClient}>
          <OfferTable />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Bitcoin Punk #1')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      // Confirm deletion
      fireEvent.click(screen.getByText('Confirm'));

      await waitFor(() => {
        expect(deleteOffer).toHaveBeenCalledWith('1');
        expect(screen.getByText('Offer deleted successfully')).toBeInTheDocument();
      });
    });
  });

  describe('LTV Calculations', () => {
    beforeEach(() => {
      (getOffers as jest.Mock).mockResolvedValue(mockOffers);
    });

    it('displays correct LTV percentages', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <OfferTable />
        </QueryClientProvider>
      );

      await waitFor(() => {
        // First offer: 0.5/1.0 = 50% LTV
        expect(screen.getByText('50%')).toBeInTheDocument();
        // Second offer: 0.8/1.0 = 80% LTV
        expect(screen.getByText('80%')).toBeInTheDocument();
      });
    });
  });
});