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
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        <div className="xl:mt-30">
            <p className="xl:text-white xl:font-bold">Your offers</p>
            <div className="xl:w-[99%] xl:bg-[#141414] xl:mt-4 xl:p-8 xl:rounded-[20px]">
                <div className="xl:flex xl:flex-col xl:gap-8">
                    {offers.length ? (
                        <>
                            {offers.map((offer: Offer) => (
                                <OfferListItem
                                    key={offer.id}
                                    imageUrl={offer.ordinal.renderUrl ?? null}
                                    collectionName={offer.ordinal.collection.name}
                                    name={offer.ordinal.name}
                                    id={offer.id}
                                    number={offer.ordinalId}
                                    floorPrice={`₿${offer.ordinal.collection.floorPrice}`}
                                    currentPrice={`₿${offer.amount}`}
                                    onEdit={() => {
                                        setSelectedOffer(offer);
                                        setIsModalOpen(true);
                                    }}
                                    onDelete={async () => {
                                        setOfferToDelete(offer.id);
                                        setIsDeleteModalOpen(true);
                                    }}
                                />
                            ))}
                            
                            {totalPages > 1 && (
                                <div className="xl:flex xl:justify-between xl:items-center xl:mt-6">
                                    <div className="xl:flex xl:gap-2">
                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1 || isLoading}
                                            className="xl:bg-[#212121] xl:text-white xl:hover:bg-[#2b2b2b]"
                                        >
                                            Previous
                                        </Button>
                                        
                                        <div className="xl:flex xl:items-center xl:gap-2">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    disabled={isLoading}
                                                    className={`xl:min-w-[40px] ${
                                                        currentPage === page 
                                                            ? 'xl:bg-[#FF5700] xl:text-white' 
                                                            : 'xl:bg-[#212121] xl:text-white xl:hover:bg-[#2b2b2b]'
                                                    }`}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages || isLoading}
                                            className="xl:bg-[#212121] xl:text-white xl:hover:bg-[#2b2b2b]"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    
                                    <div className="xl:text-gray-400">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="xl:text-center xl:text-gray-400 xl:py-8">
                            No offers available
                        </div>
                    )}
                </div>

                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="xl:bg-[#0A0A0A] xl:text-white xl:border xl:border-[#2B2B2B]">
                        <DialogHeader>
                            <DialogTitle>Delete Offer</DialogTitle>
                            <DialogDescription className="xl:text-gray-400">
                                Are you sure you want to delete this offer? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="xl:flex xl:justify-end xl:gap-3 xl:mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="xl:border-[#2B2B2B] xl:text-white xl:bg-[#0A0A0A]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    if (offerToDelete) {
                                        await deleteOffer(offerToDelete);
                                        refetch();
                                        setIsDeleteModalOpen(false);
                                    }
                                }}
                                className="xl:bg-[#FF5700] xl:hover:bg-red-700 xl:text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <EditCustomRequest
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                ordinalData={selectedOffer}
                onSubmit={async (offerData) => {
                    if (selectedOffer) {
                        try {
                            await updateOffer(selectedOffer.id, offerData);
                            toast.success("Offer updated successfully!");
                            refetch();
                            setIsModalOpen(false);
                        } catch (error) {
                            toast.error("Failed to update offer");
                        }
                    }
                }}
            />
        </div>
    );
}