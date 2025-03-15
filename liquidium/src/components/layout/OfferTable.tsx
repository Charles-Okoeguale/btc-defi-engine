"use client"
import { useState } from "react";
import { OfferListItem } from "../modules/OfferCard";
import { EditCustomRequest } from "../ui/Modals/EditCustomRequest";

export default function OfferTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ordinalData = {
        collectionName: "Quantum Cats",
        name: "#4345",
        id: "627...9900",
        floorPrice: "₿0.3223",
    };

    const offers = [
        {
          imageUrl: "/liquid.jpg",
          collectionName: "Quantum Cats",
          name: "#4345",
          id: "627...9940",
          number: "547382902",
          floorPrice: "₿0.3223",
          currentPrice: "₿0.3423",
        },
        {
            imageUrl: "/liquid.jpg",
            collectionName: "Quantum Cats",
            name: "#4345",
            id: "627...9920",
            number: "547382902",
            floorPrice: "₿0.3223",
            currentPrice: "₿0.3423",
          },
          {
            imageUrl: "/liquid.jpg",
            collectionName: "Quantum Cats",
            name: "#4345",
            id: "627...9901",
            number: "547382902",
            floorPrice: "₿0.3223",
            currentPrice: "₿0.3423",
          },
    ];

    const handleEditOffer = (offerData: { amount: string }) => {
        console.log('Creating offer:', offerData);
        setIsModalOpen(false);
    };

 
    return (
        <div className="mt-30">
            <p className="text-white font-bold">Your offers</p>
            <div className="w-[99%] bg-[#141414] mt-4 p-8 rounded-[20px]">
                <div className="flex flex-col gap-8">
                    {offers.map((offer) => (
                        <OfferListItem
                            key={offer.id}
                            {...offer}
                            onEdit={() => setIsModalOpen(true)}
                            onDelete={() => console.log(`Delete ${offer.id}`)}
                        />
                    ))}
                </div>
            </div>

            <EditCustomRequest
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                ordinalData={ordinalData}
                onSubmit={() => console.log('')}
            />
        </div>
        
    );
  }