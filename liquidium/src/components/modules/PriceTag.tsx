import { FC } from 'react';
import { cn } from "@/lib/utils";
import { PriceTagProps } from '@/types';


const PriceTag: FC<PriceTagProps> = ({ label, value, className }) => {
  return (
    <div className={cn(
      "bg-[#212121] text-white rounded-[10px] flex items-center justify-center px-2 h-[28px]",
      className
    )}>
      <p className="text-[12px] whitespace-nowrap tracking-tighter">
        {label}: <span className="ml-[-1px] font-bold">{value}</span>
      </p>
    </div>
  );
};

export default PriceTag;