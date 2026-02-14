// ============================================
// Echo Bank — Applications API
// GET /api/applications — List user's applications
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const decision = searchParams.get("decision") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = {
    submittedById: session.user.id,
  };

  if (decision && decision !== "all") {
    where.decision = decision;
  }

  if (search) {
    where.OR = [
      { applicantName: { contains: search } },
      { loanPurpose: { contains: search } },
    ];
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        status: true,
        audioFileName: true,
        audioDuration: true,
        audioLanguage: true,
        decision: true,
        weightedScore: true,
        applicantName: true,
        loanAmount: true,
        loanCurrency: true,
        loanPurpose: true,
      },
    }),
    prisma.application.count({ where }),
  ]);

  return NextResponse.json({
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
