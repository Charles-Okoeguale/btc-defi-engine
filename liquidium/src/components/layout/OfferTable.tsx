"use client"
import { useState } from "react";
import { OfferListItem } from "../modules/OfferCard";
import { EditCustomRequest } from "../ui/Modals/EditCustomRequest";
import { useQuery } from "react-query";
import { deleteOffer, getOffers, updateOffer } from "@/services/api";
import { Offer, PaginatedResponse } from "@/types";
import { MOCK_USER_ID } from "@/constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function OfferTable() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    const { data, refetch, isLoading } = useQuery<PaginatedResponse, Error>({
        queryKey: ['offers', MOCK_USER_ID, currentPage],
        queryFn: async (): Promise<PaginatedResponse> => {
            return getOffers(MOCK_USER_ID, currentPage, ITEMS_PER_PAGE);
        },
        keepPreviousData: true,
    });

    console.log(data, 'ofdersfsdf')
    
    const offers = data?.offers || [];
    const totalPages = data?.pagination.totalPages || 1;

    
    if (!data) {
        return null;
    }

    return (
        <div className="mt-8 sm:mt-16 xl:mt-30">
            <p className="text-white font-bold px-4 sm:px-0">Your offers</p>
            {/* Changed the width classes and added overflow-x-hidden */}
            <div className="w-[calc(100%-32px)] mx-auto sm:w-[calc(100%-16px)] md:w-[calc(100%-32px)] xl:w-[99%] bg-[#141414] mt-4 p-4 sm:p-6 xl:p-8 rounded-[20px] overflow-x-hidden">
                <div className="flex flex-col gap-4 sm:gap-6 xl:gap-8">
                    {offers.length ? (
                        <>
                            {offers.map((offer) => (
                                <OfferListItem
                                    key={offer.id}
                                    imageUrl={offer.ordinal.renderUrl}
                                    collectionName={offer.ordinal.collection.name}
                                    name={offer.ordinal.name}
                                    id={offer.id}
                                    floorPrice={`₿${(offer.ordinal.collection.floorPrice / 100000000).toFixed(8)}`}
                                    currentPrice={`₿${(offer.amount / 100000000).toFixed(8)}`}
                                    days={offer.term}
                                    interest={offer.interest}
                                    onEdit={() => {
                                        setSelectedOffer(offer);
                                        setIsEditModalOpen(true);
                                    }}
                                    onDelete={() => {
                                        setOfferToDelete(offer.id);
                                        setIsDeleteModalOpen(true);
                                    }}
                                />
                            ))}

                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-4 sm:gap-0">
                                    {/* Modified pagination container */}
                                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 px-2">
                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1 || isLoading}
                                            className="bg-[#212121] text-white hover:bg-[#2b2b2b] min-w-[80px] shrink-0"
                                        >
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    disabled={isLoading}
                                                    className={`min-w-[40px] ${
                                                        currentPage === page
                                                            ? 'bg-[#FF5700] text-white'
                                                            : 'bg-[#212121] text-white hover:bg-[#2b2b2b]'
                                                    }`}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages || isLoading}
                                            className="bg-[#212121] text-white hover:bg-[#2b2b2b] min-w-[80px] shrink-0"
                                        >
                                            Next
                                        </Button>
                                    </div>

                                    <div className="text-gray-400 text-sm shrink-0">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-400 py-4 sm:py-6 xl:py-8">
                            No offers available
                        </div>
                    )}
                </div>

                {/* Dialogs remain unchanged */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    {/* ... Delete dialog content ... */}
                </Dialog>
            </div>

            <EditCustomRequest
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                ordinalData={selectedOffer}
                onSubmit={async (offerData) => {
                    if (selectedOffer) {
                        try {
                            await updateOffer(selectedOffer.id, offerData);
                            toast.success("Offer updated successfully!");
                            refetch();
                            setIsEditModalOpen(false);
                        } catch (error) {
                            toast.error("Failed to update offer");
                        }
                    }
                }}
            />
        </div>
    );
}