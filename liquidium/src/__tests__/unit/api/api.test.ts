import { createOffer, deleteOffer, getSupportedCollections, getWalletData, updateOffer } from "@/services/api";
  global.fetch = jest.fn();
  
  describe('API Endpoints', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });
  
    describe('getWalletData', () => {
      const mockWalletResponse = {
        ordinals: [
          {
            inscription_id: '1',
            name: 'Bitcoin Punk #123',
            collection: 'Bitcoin Punks',
            slug: 'bitcoin-punks'
          }
        ]
      };
  
      it('fetches wallet data successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockWalletResponse
        });
  
        const data = await getWalletData();
        
        expect(data).toEqual(mockWalletResponse);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/wallet',
          expect.objectContaining({ method: 'GET' })
        );
      });
  
      it('handles error response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500
        });
  
        await expect(getWalletData()).rejects.toThrow('Failed to fetch wallet data');
      });
    });
  
    describe('getSupportedCollections', () => {
      const mockCollections = [
        {
          slug: 'bitcoin-punks',
          floorPrice: 1.2
        }
      ];
  
      it('fetches supported collections successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockCollections
        });
  
        const data = await getSupportedCollections();
        
        expect(data).toEqual(mockCollections);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/collections',
          expect.objectContaining({ method: 'GET' })
        );
      });
  
      it('handles error response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500
        });
  
        await expect(getSupportedCollections()).rejects.toThrow('Failed to fetch collections');
      });
    });
  
    describe('createOffer', () => {
      const mockOffer = {
        amount: 0.5,
        term: 30,
        interest: 10,
        ordinalId: '123',
        userId: 'user1'
      };
  
      it('creates offer successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '1', ...mockOffer })
        });
  
        const data = await createOffer(mockOffer);
        
        expect(data).toEqual({ id: '1', ...mockOffer });
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/offers',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockOffer)
          })
        );
      });
  
      it('validates offer data before sending', async () => {
        const invalidOffer = {
          ...mockOffer,
          amount: -1 // Invalid amount
        };
  
        await expect(createOffer(invalidOffer)).rejects.toThrow('Invalid offer data');
      });
  
      it('handles error response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500
        });
  
        await expect(createOffer(mockOffer)).rejects.toThrow('Failed to create offer');
      });
    });
  
    describe('updateOffer', () => {
      const mockUpdate = {
        amount: 0.6,
        term: 45,
        interest: 12
      };
  
      it('updates offer successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '1', ...mockUpdate })
        });
  
        const data = await updateOffer('1', mockUpdate);
        
        expect(data).toEqual({ id: '1', ...mockUpdate });
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/offers/1',
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(mockUpdate)
          })
        );
      });
  
      it('validates update data before sending', async () => {
        const invalidUpdate = {
          ...mockUpdate,
          amount: -1 // Invalid amount
        };
  
        await expect(updateOffer('1', invalidUpdate)).rejects.toThrow('Invalid offer data');
      });
  
      it('handles error response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500
        });
  
        await expect(updateOffer('1', mockUpdate)).rejects.toThrow('Failed to update offer');
      });
    });
  
    describe('deleteOffer', () => {
      it('deletes offer successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });
  
        const data = await deleteOffer('1');
        
        expect(data).toEqual({ success: true });
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/offers/1',
          expect.objectContaining({ method: 'DELETE' })
        );
      });
  
      it('handles error response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500
        });
  
        await expect(deleteOffer('1')).rejects.toThrow('Failed to delete offer');
      });
  
      it('validates offer ID', async () => {
        await expect(deleteOffer('')).rejects.toThrow('Invalid offer ID');
      });
    });
  
    describe('API Error Handling', () => {
      it('handles network errors', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
  
        await expect(getWalletData()).rejects.toThrow('Network error');
      });
  
      it('handles rate limiting', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 429
        });
  
        await expect(getWalletData()).rejects.toThrow('Rate limit exceeded');
      });
  
      it('handles unauthorized access', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 401
        });
  
        await expect(getWalletData()).rejects.toThrow('Unauthorized');
      });
    });
  });