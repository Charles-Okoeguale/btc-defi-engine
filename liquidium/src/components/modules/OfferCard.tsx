import { FC } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { OfferListItemProps } from '@/types';
import PriceTag from './PriceTag';

export const OfferListItem: FC<OfferListItemProps> = ({
  imageUrl,
  collectionName,
  name,
  id,
  number,
  floorPrice,
  currentPrice,
  onEdit,
  onDelete,
  className
}) => {
  return (
    <div className={cn(
      "w-full flex items-center justify-between p-4 border border-none rounded-[20px] bg-[#191919]",
      className
    )}>
    
      <div className="flex items-center gap-4">
        <div className="relative w-[60px] h-[60px] rounded-[96px] overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl || "/liquid.jpg"}
            alt={name || ""}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex gap-6">
            <h3 className="text-white font-semibold">{collectionName}</h3>
            <PriceTag label="Name" value={name} />
            <PriceTag label="ID" value={id} />
            <PriceTag label="Number" value={number} />
            <PriceTag label="Floor" value={floorPrice} />
            <PriceTag label="Current" value={currentPrice} />
          </div>
        </div>
      </div>


      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="bg-[#5D5D5D]"
        >
          <Edit2 className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="bg-[#CD1515]"
        >
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
};
