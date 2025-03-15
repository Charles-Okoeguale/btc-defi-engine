import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for offer updates
const updateOfferSchema = z.object({
  amount: z.number().positive().min(0.0001, "Offer amount must be at least 0.0001 BTC").optional(),
  term: z.number().int().positive().min(1, "Term must be at least 1 day").optional(),
  interest: z.number().positive().max(100, "Interest rate cannot exceed 100%").optional(),
});

// Update an offer
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Validate request data
    const validationResult = updateOfferSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { amount, term, interest } = validationResult.data;
    
    // Get the existing offer
    const existingOffer = await prisma.offer.findUnique({
      where: { id },
      include: {
        ordinal: {
          include: {
            collection: true,
          },
        },
      },
    });
    
    if (!existingOffer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }
    
    // Calculate new LTV if amount is being updated
    let ltv = existingOffer.ltv;
    if (amount) {
      const floorPrice = existingOffer.ordinal.collection.floorPrice;
      ltv = (amount / floorPrice) * 100;
      
      // Check if LTV exceeds 100%
      if (ltv > 100) {
        return NextResponse.json(
          { error: "LTV cannot exceed 100%" },
          { status: 400 }
        );
      }
    }
    
    // Update the offer
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        ...(amount && { amount }),
        ...(term && { term }),
        ...(interest && { interest }),
        ...(amount && { ltv }),
      },
      include: {
        ordinal: {
          include: {
            collection: true,
          },
        },
      },
    });
    
    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}

// Delete an offer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if offer exists
    const offer = await prisma.offer.findUnique({
      where: { id },
    });
    
    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }
    
    // Update the offer status to DELETED instead of actually deleting it
    await prisma.offer.update({
      where: { id },
      data: {
        status: "DELETED",
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return NextResponse.json(
      { error: "Failed to delete offer" },
      { status: 500 }
    );
  }
}

// Get a specific offer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        ordinal: {
          include: {
            collection: true,
          },
        },
      },
    });
    
    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(offer);
  } catch (error) {
    console.error("Error fetching offer:", error);
    return NextResponse.json(
      { error: "Failed to fetch offer" },
      { status: 500 }
    );
  }
}