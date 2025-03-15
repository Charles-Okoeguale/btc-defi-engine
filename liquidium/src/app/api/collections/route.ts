import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Import mock data
    const supportedCollections = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/data/mock/supported_ordinal_collections.json'), 'utf8')
    );

    // Transform the data to match your schema format if needed
    const formattedCollections = supportedCollections.map((collection: any) => ({
      id: collection.id || collection.slug,
      name: collection.name,
      slug: collection.slug,
      floorPrice: collection.floor_price,
      isSupported: true
    }));
    
    return NextResponse.json(formattedCollections);
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching collections data' }, { status: 500 });
  }
}