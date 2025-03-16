"use client"
import { useQuery } from 'react-query';
import { getWalletData } from '@/services/api';
import PortfolioValueCard from '../modules/PortfolioValueCard';
import { BTC_PRICE_USD } from '@/constants';

export default function PortfolioStats() {
  const { data, isLoading, error } = useQuery('walletStats', getWalletData);
  
  if (isLoading) return <div className="mt-12 flex flex-row gap-2">Loading portfolio stats...</div>;
  if (error) return <div className="mt-12 flex flex-row gap-2">Error loading portfolio stats</div>;
  
  const totalPortfolioValue = data?.stats?.totalPortfolioValue || 0;
  const availableLiquidity = data?.stats?.availableLiquidity || 0;
  
  // Convert BTC values to USD
  const totalPortfolioValueUsd = totalPortfolioValue * BTC_PRICE_USD;
  const availableLiquidityUsd = availableLiquidity * BTC_PRICE_USD;
  
  return (
    <div className="xl:mt-12 xl:flex xl:flex-row xl:gap-2 xl:mb-12">
      <PortfolioValueCard
        title="Total portfolio value"
        btcValue={totalPortfolioValue}
        usdValue={totalPortfolioValueUsd}
      />
      
      <PortfolioValueCard
        title="Available liquidity"
        btcValue={availableLiquidity}
        usdValue={availableLiquidityUsd}
      />
    </div>
  );
}