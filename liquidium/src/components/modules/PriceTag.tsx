import { FC } from 'react';
import { cn } from "@/lib/utils";
import { PriceTagProps } from '@/types';


const PriceTag: FC<PriceTagProps> = ({ label, value, className }) => {
  return (
    <div className={cn(
      "bg-[#212121] text-white rounded-[10px] flex items-center justify-center px-2 h-[28px] xl:bg-[#212121] xl:text-white xl:rounded-[10px] xl:flex xl:items-center xl:justify-center xl:px-2 xl:h-[28px]",
      className
    )}>
      <p className="text-[10px] whitespace-nowrap tracking-tighter xl:text-[10px] xl:whitespace-nowrap xl:tracking-tighter">
        {label}: <span className="ml-[-1px] font-bold xl:ml-[-1px] xl:font-bold">{value}</span>
      </p>
    </div>
  );
};

export default PriceTag;