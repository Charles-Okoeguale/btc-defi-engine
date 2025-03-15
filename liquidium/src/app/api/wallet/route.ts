import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


function calculateTotalPortfolioValue(ordinals: any[], collections: any[]): number {
  // Create a map for faster lookups
  const floorPriceMap = collections.reduce((map: Record<string, number>, collection) => {
    // Ensure floorPrice is a number
    map[collection.slug] = Number(collection.floorPrice);
    return map;
  }, {});

  // Calculate the total as a single number
  const total = ordinals.reduce((sum, ordinal) => {
    const slug = ordinal.slug;
    // Ensure floorPrice is a number
    const floorPrice = Number(floorPriceMap[slug] || 0);
    
    // Log each addition for debugging
    console.log(`Adding ${floorPrice} to ${sum}, result: ${sum + floorPrice}`);
    
    return sum + floorPrice;
  }, 0);

  console.log("Final total:", total);
  
  // Return the total as a number
  return total;
}

function calculateAvailableLiquidity(ordinals: any[], collections: any[]): number {
  const MINIMUM_FLOOR = 0.00065; // BTC
  
  // Create a map for faster lookups, only including supported collections above minimum floor
  const eligibleCollections = collections.reduce((map: Record<string, number>, collection) => {
    // Ensure floorPrice is a number
    const floorPrice = Number(collection.floorPrice);
    if (floorPrice >= MINIMUM_FLOOR) {
      map[collection.slug] = floorPrice;
    }
    return map;
  }, {});
  
  // Calculate the total as a single number
  const total = ordinals.reduce((sum, ordinal) => {
    const slug = ordinal.slug;
    // Ensure floorPrice is a number
    const floorPrice = Number(eligibleCollections[slug] || 0);
    
    // For debugging
    if (floorPrice > 0) {
      console.log(`Adding eligible ordinal with floor price: ${floorPrice}`);
    }
    
    return sum + floorPrice;
  }, 0);

  console.log("Final available liquidity:", total);
  
  // Return the total as a number
  return total;
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
    
    const walletData = walletDataFile.data 

    // // Add floor prices to collections if they don't exist
    const collectionsWithFloorPrices = supportedCollections.map((collection: any) => ({
      ...collection,
      floorPrice: collection.floorPrice || 
        parseFloat((Math.random() * (0.002 - 0.0005) + 0.0005).toFixed(8))
    }));

    // // Get supported collection slugs for filtering
    const supportedSlugs = collectionsWithFloorPrices.map((collection: any) => collection.slug);
    
    // // Filter wallet ordinals to only include supported collections
    const supportedOrdinals = walletData.filter((ordinal: any) => {
      const slug = ordinal.slug
      return supportedSlugs.includes(slug);
    });
    
    // // Calculate portfolio stats
    const totalPortfolioValue = calculateTotalPortfolioValue(walletData, collectionsWithFloorPrices);
    const availableLiquidity = calculateAvailableLiquidity(walletData, collectionsWithFloorPrices);
    
    return NextResponse.json({
      ordinals: supportedOrdinals,
      stats: {
        totalPortfolioValue: totalPortfolioValue,
        availableLiquidity: availableLiquidity
      }
    });
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching wallet data' }, { status: 500 });
  }
}