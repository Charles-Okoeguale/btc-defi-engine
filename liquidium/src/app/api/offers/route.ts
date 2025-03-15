import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Path to mock offers data file
const OFFERS_FILE_PATH = path.join(process.cwd(), 'data/mock/offers.json');

// Initialize offers file if it doesn't exist
function initializeOffersFile() {
  if (!fs.existsSync(path.dirname(OFFERS_FILE_PATH))) {
    fs.mkdirSync(path.dirname(OFFERS_FILE_PATH), { recursive: true });
  }
  
  if (!fs.existsSync(OFFERS_FILE_PATH)) {
    fs.writeFileSync(OFFERS_FILE_PATH, JSON.stringify([], null, 2));
  }
}

// Read offers from file
function getOffers() {
  initializeOffersFile();
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

export async function GET() {
  try {
    const offers = getOffers();
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching offers data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const offers = getOffers();
    
    // Create new offer with UUID
    const newOffer = {
      id: uuidv4(),
      ...body,
      createdAt: new Date().toISOString()
    };
    
    offers.push(newOffer);
    saveOffers(offers);
    
    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error creating offer' }, { status: 500 });
  }
}