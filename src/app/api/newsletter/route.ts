import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = "homepage" } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { message: "Already subscribed" },
          { status: 200 }
        );
      }
      await prisma.newsletterSubscription.update({
        where: { email },
        data: { isActive: true },
      });
      return NextResponse.json(
        { message: "Subscription reactivated" },
        { status: 200 }
      );
    }

    await prisma.newsletterSubscription.create({
      data: { email, source },
    });

    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
