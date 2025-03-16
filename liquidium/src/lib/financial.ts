import { BTC_PRICE_USD } from "@/constants";

export const calculateRates = (interestRate: number | null, termDays: number | null) => {
  if (!interestRate || !termDays || termDays === 0) {
    return { apr: null, apy: null };
  }

  const rateDecimal = interestRate / 100;
  
  // APR calculation
  const apr = rateDecimal * 365 / termDays;
  
  // APY calculation
  const periodicRate = rateDecimal / termDays;
  const apy = Math.pow(1 + periodicRate, 365) - 1;
  
  return {
    apr: apr * 100,
    apy: apy * 100
  };
};


export const calculateInterest = (
  amount: number | null, 
  interestRate: number | null, 
  termDays: number | null,
  btcPrice: number = BTC_PRICE_USD
) => {
  if (amount === null || interestRate === null || termDays === null) {
    return { totalInterestBTC: null, totalInterestUSD: null };
  }

  const interestRateDecimal = interestRate / 100;
  const dailyInterestRate = interestRateDecimal / 365;
  const totalInterestBTC = amount * dailyInterestRate * termDays;
  const totalInterestUSD = totalInterestBTC * btcPrice;

  return { totalInterestBTC, totalInterestUSD };
};


export const calculateLTV = (loanAmount: number, collateralValue: number) => {
  if (!loanAmount || !collateralValue) return 0;
  return (loanAmount / collateralValue) * 100;
};


export const btcToUsd = (btcAmount: number | null, btcPrice: number = BTC_PRICE_USD) => {
  if (btcAmount === null) return null;
  return btcAmount * btcPrice;
};


export const formatBtc = (amount: number | null, precision: number = 5) => {
  if (amount === null) return '';
  return `₿ ${amount.toFixed(precision)}`;
};

export const formatUsd = (amount: number | null, precision: number = 2) => {
  if (amount === null) return '';
  return `$${amount.toFixed(precision)}`;
};