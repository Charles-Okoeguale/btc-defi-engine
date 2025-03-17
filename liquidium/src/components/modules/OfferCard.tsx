import React from 'react';
import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { OfferListItemProps } from '@/types';
import PriceTag from './PriceTag';

export const OfferListItem: React.FC<OfferListItemProps> = ({
    imageUrl,
    collectionName,
    name,
    days,
    interest,
    floorPrice,
    currentPrice,
    onEdit,
    onDelete
}) => {

    const calculateLTV = () => {
        const currentPriceValue = parseFloat(currentPrice.replace('₿', ''));
        const floorPriceValue = parseFloat(floorPrice.replace('₿', ''));
        const ltv = (currentPriceValue / floorPriceValue) * 100;
        return `${ltv.toFixed(2)}%`;
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-[10px] bg-[#191919] mb-3 sm:mb-4 gap-4 sm:gap-0 w-full">
        {/* Left side: Image, Collection Name, Name, and all price details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            {/* Image and Names */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-[30px] overflow-hidden flex-shrink-0">
                    <Image
                        src={imageUrl || '/liquid.jpg'}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 min-w-0">
                    <span className="text-white text-sm sm:text-md font-medium truncate">
                        {collectionName}
                    </span>
                    <span className="text-white text-sm sm:text-md font-medium truncate">
                        {name}
                    </span>
                </div>
            </div>
    
            {/* Price Details */}
            <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">
                <PriceTag 
                    label="Offer" 
                    value={`₿${Number(currentPrice.replace('₿', '')).toFixed(4)}`} 
                />
                <PriceTag 
                    label="Floor" 
                    value={`₿${Number(floorPrice.replace('₿', '')).toFixed(4)}`} 
                />
                <PriceTag 
                    label="LTV" 
                    value={calculateLTV()} 
                />
                <PriceTag 
                    label="Days" 
                    value={days.toString()} 
                />
                <PriceTag 
                    label="Interest" 
                    value={`${interest}%`} 
                />
            </div>
        </div>
    
        {/* Right side: Actions */}
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end sm:ml-4 flex-shrink-0">
            <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="border-[#2B2B2B] text-white bg-[#5D5D5D] flex-1 sm:flex-none min-w-[40px]"
            >
                <Edit2 className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="border-[#2B2B2B] text-white bg-[#CD1515] flex-1 sm:flex-none min-w-[40px]"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    </div>
    );
};
