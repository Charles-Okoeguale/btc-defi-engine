"use client"
import { useState } from "react";
import { OfferListItem } from "../modules/OfferCard";
import { EditCustomRequest } from "../ui/Modals/EditCustomRequest";
import { useQuery } from "react-query";
import { deleteOffer, getOffers } from "@/services/api";
import { Offer } from "@/types";
import { MOCK_USER_ID } from "@/constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function OfferTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
    
    const { data: offers, refetch } = useQuery({
        queryKey: ['offers', MOCK_USER_ID] as const,
        queryFn: () => getOffers(MOCK_USER_ID)
    });

    if (!offers) {
        return null;
    }

    return (
        <div className="mt-30">
            <p className="text-white font-bold">Your offers</p>
            <div className="w-[99%] bg-[#141414] mt-4 p-8 rounded-[20px]">
            <div className="flex flex-col gap-8">
                {offers?.length ? (
                    offers.slice(0, 3).map((offer: Offer) => (
                        <OfferListItem
                            key={offer.id}
                            imageUrl={offer.ordinal.renderUrl}
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
                    ))
                ) : (
                    <div className="text-center text-gray-400 py-8">
                        No offers available
                    </div>
                )}
            </div>
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="bg-[#0A0A0A] text-white border border-[#2B2B2B]">
                    <DialogHeader>
                        <DialogTitle>Delete Offer</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete this offer? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="border-[#2B2B2B] text-white bg-[#0A0A0A]"
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
                            className="bg-[#FF5700] hover:bg-red-700 text-white"
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
                onSubmit={() => console.log('')}
            />
        </div>
    );
}