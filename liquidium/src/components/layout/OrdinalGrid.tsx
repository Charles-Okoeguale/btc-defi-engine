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
import { Search } from 'lucide-react'
import { Button } from '../ui/button';
import { OrdinalsBottomSheet } from '../ui/Modals/OrdinalsBottomSheet';

const OrdinalsGrid: React.FC = () => {
  const [selectedOrdinal, setSelectedOrdinal] = useState<Ordinal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

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
    <div className='xl:flex xl:flex-col xl:items-center xl:gap-2'>
      <div className="mb-4 relative w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search inscription"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-[280px] md:w-[320px] xl:w-[336px] h-[36px] p-2 pr-10 bg-[#111111] border border-[#2B2B2B] rounded-lg text-white text-sm placeholder:text-gray-400"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 p-2 border border-[#2B2B2B] w-full rounded-[25px] xl:flex xl:flex-row xl:gap-5 xl:p-3 xl:h-[358px] xl:items-center">
          {filteredOrdinals.slice(0, 6).map((ordinal: Ordinal, index: number) => (
              <div key={index} className="flex justify-center">
                  <OrdinalCard
                      key={ordinal.inscription_id}
                      ordinal={ordinal}
                      floorPrice={Number((floorPrices[ordinal.slug] || 0).toFixed(4))}
                      onCreateOffer={() => handleCreateOffer(ordinal)}
                  />
              </div>
          ))}
      </div>
      <div className="flex justify-center w-full mt-2">
        <Button 
          className='text-[12px]' 
          onClick={() => setIsBottomSheetOpen(true)}
        >
          View all
        </Button>
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

      <OrdinalsBottomSheet
        isOpen={isBottomSheetOpen}
        onOpenChange={setIsBottomSheetOpen}
        ordinals={filteredOrdinals}
        floorPrices={floorPrices}
        onCreateOffer={handleCreateOffer}
      />
    </div>
  );
};

export default OrdinalsGrid;