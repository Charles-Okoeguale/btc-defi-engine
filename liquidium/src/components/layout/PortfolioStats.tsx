"use client"
import { useQuery } from 'react-query';
import { getWalletData } from '@/services/api';
import { useState, useEffect } from 'react';
import PortfolioValueCard from '../modules/PortfolioValueCard';

const BTC_TO_USD_RATE = 96000;

export default function PortfolioStats() {
  const { data, isLoading, error } = useQuery('walletStats', getWalletData);
  const [btcUsdRate, setBtcUsdRate] = useState(BTC_TO_USD_RATE);
  

//   useEffect(() => {
//     // You could fetch the real rate from an API like CoinGecko
//     // Example: 
//     // fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
//     //   .then(res => res.json())
//     //   .then(data => setBtcUsdRate(data.bitcoin.usd));
//   }, []);
  
  if (isLoading) return <div className="mt-12 flex flex-row gap-2">Loading portfolio stats...</div>;
  if (error) return <div className="mt-12 flex flex-row gap-2">Error loading portfolio stats</div>;
  
  const totalPortfolioValue = data?.stats?.totalPortfolioValue || 0;
  const availableLiquidity = data?.stats?.availableLiquidity || 0;
  
  // Convert BTC values to USD
  const totalPortfolioValueUsd = totalPortfolioValue * btcUsdRate;
  const availableLiquidityUsd = availableLiquidity * btcUsdRate;
  
  return (
    <div className="mt-12 flex flex-row gap-2">
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