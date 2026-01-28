import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      website,
      description,
      shortDescription,
      category,
      pricingInfo,
      submitterName,
      submitterEmail,
    } = body;

    if (!name || !website || !description || !shortDescription || !category || !submitterName || !submitterEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submitterEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const existingSubmission = await prisma.toolSubmission.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { website: { equals: website, mode: "insensitive" } },
        ],
        status: { in: ["pending", "approved"] },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "A tool with this name or website has already been submitted" },
        { status: 409 }
      );
    }

    const submission = await prisma.toolSubmission.create({
      data: {
        name,
        website,
        description,
        shortDescription,
        pricingInfo: pricingInfo || null,
        submitterName,
        submitterEmail,
        status: "pending",
        enrichedData: { category },
      },
    });

    return NextResponse.json(
      {
        message: "Tool submitted successfully",
        submissionId: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to submit tool" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const skip = (page - 1) * pageSize;

    const [submissions, total] = await Promise.all([
      prisma.toolSubmission.findMany({
        where: { status },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.toolSubmission.count({ where: { status } }),
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
