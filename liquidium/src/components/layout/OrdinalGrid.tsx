"use client"
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getWalletData, getSupportedCollections } from '@/services/api';
import { CreateOfferModal } from '../ui/Modals/CreateOfferModal';
import OrdinalCard from '../modules/OrdinalCard';
import { Ordinal } from '@/types';

const OrdinalsGrid: React.FC = () => {
  const [selectedOrdinal, setSelectedOrdinal] = useState<Ordinal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const supportedOrdinals = React.useMemo(() => {
    if (!walletData?.ordinals || !collectionsData) return [];
    
    // Create a set of supported collection slugs for faster lookup
    const supportedSlugs = new Set(collectionsData.map((c: any) => c.slug));
    
    // Filter ordinals to only include those from supported collections
    return walletData.ordinals.filter((ordinal: Ordinal) => 
      supportedSlugs.has(ordinal.slug)
    );
  }, [walletData, collectionsData]);

  console.log("Supported ordinals:", supportedOrdinals);

  const handleCreateOffer = (ordinal: Ordinal) => {
    setSelectedOrdinal(ordinal);
    setIsModalOpen(true);
  };

  const isLoading = isLoadingWallet || isLoadingCollections;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="w-[11.5em] h-[19.9em] bg-[#1E1E1E] rounded-[20px] animate-pulse"></div>
        ))}
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
      <div className="flex flex-row overflow-x-auto gap-2 pb-2">
        {supportedOrdinals.slice(0, 6).map((ordinal: Ordinal, index: number) => (
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
          ordinalData={{
            collectionName: selectedOrdinal.collection_name,
            name: selectedOrdinal.inscription_name,
            id: selectedOrdinal.inscription_id,
            floorPrice: (floorPrices[selectedOrdinal.slug] || 0.00065).toString()
          }}
          onSubmit={(offerData) => console.log('Offer submitted:', offerData)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default OrdinalsGrid;