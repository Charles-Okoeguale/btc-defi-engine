// tests/integration/UserFlow.test.tsx
import Home from '@/app/page';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('Complete User Flow', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    // Reset query client
    queryClient.clear();
  });

  it('should complete full user journey', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // 1. Check Portfolio Stats Load
    await waitFor(() => {
      expect(screen.getByText('Total portfolio value')).toBeInTheDocument();
      expect(screen.getByText('Available liquidity')).toBeInTheDocument();
    });

    // 2. Search Ordinals
    const searchInput = screen.getByPlaceholderText('Search ordinals...');
    fireEvent.change(searchInput, { target: { value: 'test ordinal' } });
    
    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText('test ordinal')).toBeInTheDocument();
    });

    // 3. Create Offer
    const createOfferButton = screen.getByText('Create Offer');
    fireEvent.click(createOfferButton);

    // Fill create offer form
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0.5' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Interest'), { target: { value: '10' } });

    // Submit form
    const submitButton = screen.getByText('Create request');
    fireEvent.click(submitButton);

    // Verify offer created
    await waitFor(() => {
      expect(screen.getByText('₿0.5')).toBeInTheDocument();
    });

    // 4. Edit Offer
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Modify offer
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0.6' } });
    
    // Submit edit
    const saveButton = screen.getByText('Save changes');
    fireEvent.click(saveButton);

    // Verify edit
    await waitFor(() => {
      expect(screen.getByText('₿0.6')).toBeInTheDocument();
    });

    // 5. Delete Offer
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Confirm delete in dialog
    const confirmDelete = screen.getByText('Delete');
    fireEvent.click(confirmDelete);

    // Verify deletion
    await waitFor(() => {
      expect(screen.queryByText('₿0.6')).not.toBeInTheDocument();
    });
  });

  it('should handle errors gracefully', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Test API error handling
    await waitFor(() => {
      expect(screen.getByText('Total portfolio value')).toBeInTheDocument();
    });

    // Create offer with API failure
    const createOfferButton = screen.getByText('Create Offer');
    fireEvent.click(createOfferButton);

    // Fill form
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0.5' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Interest'), { target: { value: '10' } });

    // Mock API failure
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    // Submit form
    const submitButton = screen.getByText('Create request');
    fireEvent.click(submitButton);

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText('Failed to create offer')).toBeInTheDocument();
    });
});

it('should validate LTV ratio', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Open create offer modal
    const createOfferButton = screen.getByText('Create Offer');
    fireEvent.click(createOfferButton);

    // Try to create offer with LTV > 100%
    // If floor price is 1 BTC, entering 1.1 BTC would exceed 100% LTV
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '1.1' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Interest'), { target: { value: '10' } });

    // Submit form
    const submitButton = screen.getByText('Create request');
    fireEvent.click(submitButton);

    // Verify validation error
    await waitFor(() => {
      expect(screen.getByText('LTV cannot exceed 100%')).toBeInTheDocument();
    });

    // Test with valid LTV
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0.5' } });
    fireEvent.click(submitButton);

    // Verify successful submission
    await waitFor(() => {
      expect(screen.getByText('Offer created successfully')).toBeInTheDocument();
    });
});
});