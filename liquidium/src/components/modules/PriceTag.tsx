import { FC } from 'react';
import { cn } from "@/lib/utils";
import { PriceTagProps } from '@/types';


const PriceTag: FC<PriceTagProps> = ({ label, value, className }) => {
  return (
    <div className={cn(
      "xl:bg-[#212121] xl:text-white xl:rounded-[10px] xl:flex xl:items-center xl:justify-center xl:px-2 xl:h-[28px]",
      className
    )}>
      <p className="xl:text-[9px] xl:whitespace-nowrap xl:tracking-tighter">
        {label}: <span className="xl:ml-[-1px] xl:font-bold">{value}</span>
      </p>
    </div>
  );
};

export default PriceTag;