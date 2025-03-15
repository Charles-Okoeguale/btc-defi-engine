import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function calculateTotalPortfolioValue(ordinals: any[], collections: any[]): number {
  return ordinals.reduce((total, ordinal) => {
    const collection = collections.find((c) => c.slug === ordinal.collection);
    // If collection exists, add its floor price, otherwise add 0
    return total + (collection ? collection.floor_price : 0);
  }, 0);
}

// Calculate available liquidity (only supported collections above minimum floor)
function calculateAvailableLiquidity(ordinals: any[], collections: any[]): number {
  const MINIMUM_FLOOR = 0.00065; // BTC
  
  return ordinals.reduce((total, ordinal) => {
    const collection = collections.find((c) => c.slug === ordinal.collection);
    
    // Only include if collection is supported and above minimum floor
    if (collection && collection.floor_price >= MINIMUM_FLOOR) {
      return total + collection.floor_price;
    }
    return total;
  }, 0);
}

export async function GET() {
  try {
    // Import mock data with the correct path
    const walletDataFile = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/data/mock/your_owned_ordinals.json'), 'utf8')
    );

    const supportedCollections = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/data/mock/supported_ordinal_collections.json'), 'utf8')
    );

    const walletData = walletDataFile.data;

    // Get supported collection slugs for filtering
    const supportedSlugs = supportedCollections.map((collection: any) => collection.slug);
    
    // Filter wallet ordinals to only include supported collections
    const supportedOrdinals = walletData.filter((ordinal: any) => 
      supportedSlugs.includes(ordinal.collection)
    );

    console.log(supportedOrdinals, "supported")
    
    // Calculate portfolio stats
    const totalPortfolioValue = calculateTotalPortfolioValue(walletData, supportedCollections);
    const availableLiquidity = calculateAvailableLiquidity(walletData, supportedCollections);
    
    return NextResponse.json({
      ordinals: supportedOrdinals,
      stats: {
        totalPortfolioValue,
        availableLiquidity
      }
    });
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching wallet data' }, { status: 500 });
  }
}