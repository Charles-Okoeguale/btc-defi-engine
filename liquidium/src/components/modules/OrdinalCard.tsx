import { FC } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PriceTag from './PriceTag';

interface OrdinalCardProps {
  collectionName: string;
  name: string;
  id: string;
  number: string;
  imageUrl: string;
  floorPrice: string;
  currentPrice: string;
  className?: string;
  onCreateOffer?: () => void;
}

const OrdinalCard: FC<OrdinalCardProps> = ({
  collectionName,
  name,
  id,
  number,
  imageUrl,
  floorPrice,
  currentPrice,
  className,
  onCreateOffer
}) => {
  return (
    <div className={cn(
      "w-[11.5em] h-[19.9em] bg-[#141414] rounded-[20px] p-4 flex flex-col items-center",
      className
    )}>

      <div className="relative w-[100px] h-[130px] mb-3 rounded-[100px] overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <h1 className="text-white font-semibold text-[20px] mb-1 truncate">
          {collectionName}
        </h1>
        
        <p className="text-[#7D7D7D] text-[14px] truncate">Name: {name}</p>
        <p className="text-[#7D7D7D] text-[14px] truncate">ID: {id}</p>
        <p className="text-[#7D7D7D] text-[14px] truncate">Number: {number}</p>

        <div className="flex gap-2 my-2 justify-center">
          <PriceTag label="Floor" value={floorPrice} />
          <PriceTag label="Best" value={currentPrice} />
        </div>

        <Button 
          onClick={onCreateOffer}
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