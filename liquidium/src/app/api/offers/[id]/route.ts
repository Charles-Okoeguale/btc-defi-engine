import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to mock offers data file
const OFFERS_FILE_PATH = path.join(process.cwd(), 'data/mock/offers.json');

// Get offers from file
function getOffers() {
  if (!fs.existsSync(OFFERS_FILE_PATH)) {
    return [];
  }
  const offersData = fs.readFileSync(OFFERS_FILE_PATH, 'utf8');
  return JSON.parse(offersData);
}

// Save offers to file
function saveOffers(offers: any[]) {
  // Ensure directory exists
  if (!fs.existsSync(path.dirname(OFFERS_FILE_PATH))) {
    fs.mkdirSync(path.dirname(OFFERS_FILE_PATH), { recursive: true });
  }
  fs.writeFileSync(OFFERS_FILE_PATH, JSON.stringify(offers, null, 2));
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const offers = getOffers();
    const offer = offers.find((o: any) => o.id === id);
    
    if (!offer) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }
    
    return NextResponse.json(offer);
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching offer' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const offers = getOffers();
    const offerIndex = offers.findIndex((o: any) => o.id === id);
    
    if (offerIndex === -1) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }
    
    // Update offer
    offers[offerIndex] = {
      ...offers[offerIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    saveOffers(offers);
    
    return NextResponse.json(offers[offerIndex]);
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error updating offer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const offers = getOffers();
    const offerIndex = offers.findIndex((o: any) => o.id === id);
    
    if (offerIndex === -1) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }
    
    // Remove offer
    const removedOffer = offers.splice(offerIndex, 1)[0];
    saveOffers(offers);
    
    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error deleting offer' }, { status: 500 });
  }
}