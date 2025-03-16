"use client"
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getWalletData, getSupportedCollections, createOffer } from '@/services/api';
import OrdinalCard from '../modules/OrdinalCard';
import { Ordinal } from '@/types';
import CreateOfferModal from '../ui/Modals/CreateOfferModal';
import { queryClient } from '@/lib/react-query';
import { toast } from "sonner"
import { handleError } from '@/lib/error-handler';

const OrdinalsGrid: React.FC = () => {
  const [selectedOrdinal, setSelectedOrdinal] = useState<Ordinal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch wallet data (ordinals)
  const { data: walletData, isLoading: isLoadingWallet, error: walletError } = 
    useQuery('walletData', getWalletData);

  // Fetch collections data for floor prices
  const { data: collectionsData, isLoading: isLoadingCollections } = 
    useQuery('collections', getSupportedCollections);

  // Create a map of collection slugs to floor prices
  const floorPrices = React.useMemo(() => {
    if (!collectionsData) return {};
    
    return collectionsData.reduce((acc: Record<string, number>, collection: any) => {
      acc[collection.slug] = collection.floorPrice;
      return acc;
    }, {});
  }, [collectionsData]);

    // Filter ordinals to show only those from supported collections
   // Create a set of supported collection slugs for faster lookup
   // Filter ordinals to only include those from supported collections
  const supportedOrdinals = React.useMemo(() => {
    if (!walletData?.ordinals || !collectionsData) return [];
    const supportedSlugs = new Set(collectionsData.map((c: any) => c.slug));
    return walletData.ordinals.filter((ordinal: Ordinal) => 
      supportedSlugs.has(ordinal.slug)
    );
  }, [walletData, collectionsData]);

  const filteredOrdinals = React.useMemo(() => {
    if (!searchTerm) return supportedOrdinals;
    
    return supportedOrdinals.filter((ordinal: Ordinal) => 
      ordinal.collection_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ordinal.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [supportedOrdinals, searchTerm]);


  const handleCreateOffer = (ordinal: Ordinal) => {
    setSelectedOrdinal(ordinal);
    setIsModalOpen(true);
  };

  const isLoading = isLoadingWallet || isLoadingCollections;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <svg 
          className="animate-spin h-8 w-8 text-[#FF5700]" 
          style={{ animation: 'spin 0.6s linear infinite' }}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (walletError) {
    return <div className="text-red-500">Error loading ordinals</div>;
  }

  if (supportedOrdinals.length === 0) {
    return <div className="text-center py-10 text-white font-bold">No supported ordinals found in your wallet.</div>;
  }


  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search ordinals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-[#1E1E1E] border border-[#2B2B2B] rounded-lg text-white"
        />
      </div>

      <div className="flex flex-row overflow-x-auto gap-2 pb-2">
        {filteredOrdinals.slice(0, 6).map((ordinal: Ordinal, index: number) => (
          <div className="flex-shrink-0 w-64" key={index}>
            <OrdinalCard
              key={ordinal.inscription_id}
              ordinal={ordinal}
              floorPrice={Number((floorPrices[ordinal.slug] || 0).toFixed(4))}
              onCreateOffer={() => handleCreateOffer(ordinal)}
            />
          </div>
        ))}
      </div>

      {selectedOrdinal && (
        <CreateOfferModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          ordinalData={selectedOrdinal}
          onSubmit={async (offerData) => {
            try {
              await createOffer(offerData);
              toast.success("Offer created successfully!");
              queryClient.invalidateQueries('offers');
            } catch (error) {
              handleError(error, "creating offer");
            }
          }}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default OrdinalsGrid;