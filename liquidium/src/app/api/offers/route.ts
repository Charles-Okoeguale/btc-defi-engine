import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Ordinal } from '@/types';

const prisma = new PrismaClient();

// Validation schema for offer creation
const createOfferSchema = z.object({
  amount: z.number().positive().min(0.0001, "Offer amount must be at least 0.0001 BTC"),
  term: z.number().int().positive().min(1, "Term must be at least 1 day"),
  interest: z.number().positive().max(100, "Interest rate cannot exceed 100%"),
  ordinalId: z.string().min(1, "Ordinal ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

async function getOrdinalDetails(inscriptionId: string): Promise<Ordinal | undefined> {
  try {
    const imported = await import('@/data/mock/your_owned_ordinals.json').then(module => module.default);
    let mockOrdinalsData: any[] = [];

    if (Array.isArray(imported)) {
      mockOrdinalsData = imported;
    } else if (Array.isArray(imported.data)) {
      mockOrdinalsData = imported.data;
    } else {
      console.error("Mock data is not an array or does not contain a data property array.");
      return undefined;
    }
    
    const found = mockOrdinalsData.find(
      ordinal => ordinal.inscription_id === inscriptionId
    );
    return found;
  } catch (error) {
    console.error("Error fetching ordinal details:", error);
    return undefined;
  }
}
  
// create the offer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = createOfferSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { amount, term, interest, ordinalId, userId } = validationResult.data;
    
    // Find ordinal by inscriptionId
    let ordinal = await prisma.ordinal.findUnique({
      where: { inscriptionId: ordinalId },
      include: { collection: true },
    });
    
    // If ordinal doesn't exist, create it
    if (!ordinal) {
      const ordinalDetails = await getOrdinalDetails(ordinalId);
      
      if (!ordinalDetails) {
        return NextResponse.json(
          { error: "Ordinal not found in walletss" },
          { status: 404 }
        );
      }
      
      // Find or create the collection based on the slug
      const collectionSlug = ordinalDetails.slug || ordinalDetails.collection_name.toLowerCase().replace(/\s+/g, '-');
      
      let collection = await prisma.collection.findUnique({
        where: { slug: collectionSlug }
      });
      
      if (!collection) {
        collection = await prisma.collection.create({
          data: {
            name: ordinalDetails.collection_name,
            slug: collectionSlug,
            floorPrice: ordinalDetails.last_sale_price || 1000000,
            isSupported: true
          }
        });
      }
      
      // Create the ordinal with correct field mapping
      ordinal = await prisma.ordinal.create({
        data: {
          inscriptionId: ordinalDetails.inscription_id,
          inscriptionNumber: ordinalDetails.inscription_number || 0,
          name: ordinalDetails.inscription_name || null,
          contentUrl: ordinalDetails.content_url || null,
          renderUrl: ordinalDetails.render_url || null,
          lastSalePrice: ordinalDetails.last_sale_price || null,
          ownerWalletAddr: ordinalDetails.owner_wallet_addr || "unknown",
          collectionId: collection.id
        },
        include: { collection: true }
      });
    }
    
    // Calculate LTV (Loan to Value ratio)
    const floorPrice = ordinal.collection.floorPrice;
    const ltv = (amount / floorPrice) * 100;
    
    // Check if LTV exceeds 100%
    if (ltv > 100) {
      return NextResponse.json(
        { error: "LTV cannot exceed 100%" },
        { status: 400 }
      );
    }
    
    // Create the offer
    const offer = await prisma.offer.create({
      data: {
        amount: amount,
        term: term,
        interest: interest,
        ltv,
        status: "ACTIVE",
        ordinal: { connect: { id: ordinal.id } },
        user: { connect: { id: userId } },
      },
      include: {
        ordinal: {
          include: {
            collection: true,
          },
        },
      },
    });
    
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("Error creating offer:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to create offer", details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to create offer", details: "Unknown error" },
        { status: 500 }
      );
    }
  }
}

// Get all offers for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '16');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get total count for pagination
    const totalItems = await prisma.offer.count({
      where: {
        userId,
        status: "ACTIVE",
      }
    });

    // Get paginated offers
    const offers = await prisma.offer.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        ordinal: {
          include: {
            collection: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      offers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}