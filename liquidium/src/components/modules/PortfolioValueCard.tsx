import { FC } from 'react';
import { cn } from "@/lib/utils";
import { PortfolioValueCardProps } from '@/types';

const PortfolioValueCard: FC<PortfolioValueCardProps> = ({
  title,
  btcValue,
  usdValue,
  className
}) => {
  const formattedBtc = btcValue.toFixed(6);

  const formattedUsd = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(usdValue);

  return (
    <div className={cn(
      "flex flex-col w-full md:w-[500px] lg:w-[600px] xl:w-[733.5px] h-[80px] xl:h-[100px] bg-[#141414] py-3 xl:py-4 px-3 xl:px-4 gap-1 xl:gap-2 rounded-[20px]",
      className
    )}>
      <p className="text-white text-[10px] sm:text-[11px] xl:text-xs">{title}</p>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-white font-bold text-[20px] sm:text-[24px] md:text-[28px] xl:text-[32px]">₿{formattedBtc}</h1>
        <div className="text-white border border-[#3E3E3E] rounded-[20px] flex items-center justify-center w-[3.5em] sm:w-[4em] xl:w-[4.375em] h-[1.4em] sm:h-[1.5em] xl:h-[1.625em]">
          <p className="text-[11px] sm:text-[12px] xl:text-[14px]">${formattedUsd}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioValueCard;
