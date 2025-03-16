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
      "xl:flex xl:flex-col xl:w-[733.5px] xl:h-[100px] xl:bg-[#141414] xl:py-4 xl:px-4 xl:gap-2 xl:rounded-[20px]",
      className
    )}>
      <p className="xl:text-white xl:text-xs">{title}</p>
      <div className="xl:flex xl:flex-row xl:gap-2 xl:items-center">
        <h1 className="xl:text-white xl:font-bold xl:text-[32px]">₿{formattedBtc}</h1>
        <div className="xl:text-white xl:border xl:border-[#3E3E3E] xl:rounded-[20px] xl:flex xl:items-center xl:justify-center xl:w-[4.375em] xl:h-[1.625em]">
          <p className="xl:text-[14px]">${formattedUsd}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioValueCard;
