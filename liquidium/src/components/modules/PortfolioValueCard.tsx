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
      "flex flex-col w-[733.5px] h-[100px] bg-[#141414] py-4 px-4 gap-2 rounded-[20px]",
      className
    )}>
      <p className="text-white text-xs">{title}</p>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-white font-bold text-[32px]">₿{formattedBtc}</h1>
        <div className="text-white border border-[#3E3E3E] rounded-[20px] flex items-center justify-center w-[4.375em] h-[1.625em]">
          <p className="text-[14px]">${formattedUsd}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioValueCard;
