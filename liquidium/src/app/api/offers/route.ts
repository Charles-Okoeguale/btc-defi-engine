import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for offer creation
const createOfferSchema = z.object({
  amount: z.number().positive().min(0.0001, "Offer amount must be at least 0.0001 BTC"),
  term: z.number().int().positive().min(1, "Term must be at least 1 day"),
  interest: z.number().positive().max(100, "Interest rate cannot exceed 100%"),
  ordinalId: z.string().min(1, "Ordinal ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

// create the offer
export async function POST(request: NextRequest) {
  try {
    // Parse request body
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
    
    // Get the ordinal to calculate LTV
    const ordinal = await prisma.ordinal.findUnique({
      where: { id: ordinalId },
      include: { collection: true },
    });
    
    if (!ordinal) {
      return NextResponse.json(
        { error: "Ordinal not found" },
        { status: 404 }
      );
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
        amount,
        term,
        interest,
        ltv,
        status: "ACTIVE",
        ordinal: { connect: { id: ordinalId } },
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
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}

// Get all offers for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
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
    });
    
    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}