import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    
    const supportedCollections = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/data/mock/supported_ordinal_collections.json'), 'utf8')
    );

    const formattedCollections = supportedCollections.map((collection: any) => {
      // Generate a random floor price between 0.0005 and 0.002 BTC
      const randomFloorPrice = (Math.random() * (0.002 - 0.0005) + 0.0005).toFixed(8);
      
      return {
        id: collection.id || collection.slug,
        name: collection.name,
        slug: collection.slug,
        floorPrice: parseFloat(randomFloorPrice),
        isSupported: true
      };
    });
    
    return NextResponse.json(formattedCollections);
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching collections data' }, { status: 500 });
  }
}