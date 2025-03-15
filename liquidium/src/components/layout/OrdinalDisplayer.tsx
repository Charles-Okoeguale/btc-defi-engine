"use client"

import { useState } from "react";
import OrdinalCard from "../modules/OrdinalCard";
import { SearchInput } from "../ui/SearchInput";
import { CreateOfferModal } from "../ui/Modals/CreateOfferModal";

const mockOrdinals = [
    {
      id: '1',
      collectionName: "Quantum Cats",
      name: "#4345",
      walletId: "627...9900",
      number: "547382902",
      imageUrl: "/liquid.jpg",
      floorPrice: "₿0.3223",
      currentPrice: "₿0.3423",
    },
    {
      id: '2',
      collectionName: "Quantum Dogs",
      name: "#2231",
      walletId: "627...9901",
      number: "547382903",
      imageUrl: "/liquid.jpg",
      floorPrice: "₿0.4223",
      currentPrice: "₿0.4423",
    },
    {
      id: '3',
      collectionName: "Quantum Birds",
      name: "#7745",
      walletId: "627...9902",
      number: "547382904",
      imageUrl: "/liquid.jpg",
      floorPrice: "₿0.2223",
      currentPrice: "₿0.2423",
    },
    {
      id: '4',
      collectionName: "Quantum Fish",
      name: "#1145",
      walletId: "627...9903",
      number: "547382905",
      imageUrl: "/liquid.jpg",
      floorPrice: "₿0.5223",
      currentPrice: "₿0.5423",
    },
    {
      id: '5',
      collectionName: "Quantum Bears",
      name: "#9945",
      walletId: "627...9904",
      number: "547382906",
      imageUrl: "/liquid.jpg",
      floorPrice: "₿0.6223",
      currentPrice: "₿0.6423",
    },
    {
      id: '6',
      collectionName: "Quantum Lions",
      name: "#3345",
      walletId: "627...9905",
      number: "547382907",
      imageUrl: "/liquid.jpg",
      floorPrice: "₿0.7223",
      currentPrice: "₿0.7423",
    },
  ];

export default function OrdinalsDisplayer() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateOffer = (offerData: { amount: string }) => {
        console.log('Creating offer:', offerData);
        setIsModalOpen(false);
    };

    const ordinalData = {
        collectionName: "Quantum Cats",
        name: "#4345",
        id: "627...9900",
        floorPrice: "₿0.3223",
    };

    return (
        <div className="mt-[83px] flex flex-col items-center gap-6">
            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
            />
            <div className="flex flex-row gap-4 border-[1px] border-solid border-[#2B2B2B] h-[358px] rounded-[25px] items-center px-4">
                {mockOrdinals.map((ordinal) => (
                    <OrdinalCard
                        key={ordinal.id}
                        collectionName={ordinal.collectionName}
                        name={ordinal.name}
                        id={ordinal.walletId}
                        number={ordinal.number}
                        imageUrl={ordinal.imageUrl}
                        floorPrice={ordinal.floorPrice}
                        currentPrice={ordinal.currentPrice}
                        onCreateOffer={() => setIsModalOpen(true)}
                    />
                ))}
            </div>
            
            <CreateOfferModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                ordinalData={ordinalData}
                onSubmit={handleCreateOffer}
            />
        </div>
    );
  }