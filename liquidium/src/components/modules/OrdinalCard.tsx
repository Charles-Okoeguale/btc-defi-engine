import React, { FC } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PriceTag from './PriceTag';
import { OrdinalCardProps } from '@/types';

const OrdinalCard: FC<OrdinalCardProps> = ({
  ordinal,
  floorPrice,
  className,
  onCreateOffer
}) => {
  const imageUrl = ordinal.render_url 
  
  // Convert satoshis to BTC for last sale price
  const lastSalePrice = Number((ordinal.last_sale_price / 100000000).toFixed(4));

  return (
    <div className={cn(
      "w-[11.5em] h-[19.9em] bg-[#141414] rounded-[20px] p-4 flex flex-col items-center",
      className
    )}>
      <div className="relative w-[100px] h-[130px] mb-3 rounded-[100px] overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={ordinal.inscription_name}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <h1 className="text-white font-semibold text-[20px] mb-1 truncate">
          {ordinal.collection_name}
        </h1>
        
        <p className="text-[#7D7D7D] text-[14px] truncate">Name: {ordinal.inscription_name}</p>
        <p className="text-[#7D7D7D] text-[14px] truncate">ID: {ordinal.inscription_id.substring(0, 8)}...</p>
        <p className="text-[#7D7D7D] text-[14px] truncate">Number: {ordinal.inscription_number}</p>

        <div className="flex gap-2 my-2 justify-center">
          <PriceTag label="Floor" value={`₿${(floorPrice || 0).toFixed(4)}`} />
          <PriceTag label="Last Sale" value={`₿${(lastSalePrice || 0).toFixed(4)}`} />
        </div>

        <Button 
          onClick={() => onCreateOffer(ordinal)}
          className="w-full bg-[#FF5700] hover:bg-[#FF5700]/90 text-white font-bold rounded-[20px]"
          variant="secondary"
        >
          Create Offer
        </Button>
      </div>
    </div>
  );
};

export default OrdinalCard;