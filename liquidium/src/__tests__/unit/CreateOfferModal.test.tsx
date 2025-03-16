import CreateOfferModal from '@/components/ui/Modals/CreateOfferModal';
import { BTC_PRICE_USD } from '@/constants';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

const mockOrdinalData = {
  ordinal: {
    inscriptionId: '123',
    name: 'Bitcoin Punk #1',
    collection: 'Bitcoin Punks'
  },
  floorPrice: 1.0 // 1 BTC floor price
};

describe('CreateOfferModal', () => {
  const queryClient = new QueryClient();
  const mockOnSubmit = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateOfferModal 
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          ordinalData={mockOrdinalData}
          onSubmit={mockOnSubmit}
        />
      </QueryClientProvider>
    );
  };

  describe('LTV Validation', () => {
    it('prevents submission when LTV exceeds 100%', async () => {
      renderModal();

      // Try to submit with amount > floor price (LTV > 100%)
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '1.1' } });
      fireEvent.change(screen.getByLabelText('Term'), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText('Interest'), { target: { value: '10' } });

      fireEvent.click(screen.getByText('Create request'));

      expect(screen.getByText('LTV cannot exceed 100%')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('allows submission when LTV is valid', async () => {
      renderModal();

      // Submit with valid LTV (50%)
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0.5' } });
      fireEvent.change(screen.getByLabelText('Term'), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText('Interest'), { target: { value: '10' } });

      fireEvent.click(screen.getByText('Create request'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          amount: 0.5,
          term: 30,
          interest: 10,
          ordinalId: '123',
          userId: expect.any(String)
        });
      });
    });
  });

  describe('Form Field Validations', () => {
    it('validates required fields', async () => {
      renderModal();

      // Try to submit empty form
      fireEvent.click(screen.getByText('Create request'));

      expect(screen.getByText('Amount is required')).toBeInTheDocument();
      expect(screen.getByText('Term is required')).toBeInTheDocument();
      expect(screen.getByText('Interest is required')).toBeInTheDocument();
    });

    it('validates minimum values', async () => {
      renderModal();

      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0' } });
      fireEvent.change(screen.getByLabelText('Term'), { target: { value: '0' } });
      fireEvent.change(screen.getByLabelText('Interest'), { target: { value: '0' } });

      fireEvent.click(screen.getByText('Create request'));

      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
      expect(screen.getByText('Term must be at least 1 day')).toBeInTheDocument();
      expect(screen.getByText('Interest must be greater than 0')).toBeInTheDocument();
    });

    it('validates numeric values', async () => {
      renderModal();

      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: 'abc' } });
      expect(screen.getByLabelText('Amount')).toHaveValue('');
    });
  });

  describe('BTC Balance Conversions', () => {
    it('displays correct USD conversion for amount', async () => {
      renderModal();

      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0.5' } });

      const expectedUsd = (0.5 * BTC_PRICE_USD).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });

      expect(screen.getByText(expectedUsd)).toBeInTheDocument();
    });

    it('displays correct floor price in both BTC and USD', () => {
      renderModal();

      const floorPriceUsd = (mockOrdinalData.floorPrice * BTC_PRICE_USD).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });

      expect(screen.getByText(`₿${mockOrdinalData.floorPrice}`)).toBeInTheDocument();
      expect(screen.getByText(floorPriceUsd)).toBeInTheDocument();
    });

    it('updates USD value when BTC amount changes', async () => {
      renderModal();

      const amountInput = screen.getByLabelText('Amount');
      
      fireEvent.change(amountInput, { target: { value: '0.5' } });
      expect(screen.getByText(`$${(0.5 * BTC_PRICE_USD).toLocaleString()}`)).toBeInTheDocument();

      fireEvent.change(amountInput, { target: { value: '1.0' } });
      expect(screen.getByText(`$${(1.0 * BTC_PRICE_USD).toLocaleString()}`)).toBeInTheDocument();
    });
  });
});