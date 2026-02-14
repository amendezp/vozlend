// ============================================
// Echo Bank — Single Application API
// GET /api/applications/:id — Get full application data
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Only allow owner or admin to view
  if (application.submittedById !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Log the view
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "view_report",
      entityType: "application",
      entityId: application.id,
      applicationId: application.id,
    },
  });

  // Parse JSON fields and return as FullReport format
  const report = {
    id: application.id,
    createdAt: application.createdAt.toISOString(),
    application: application.extractedData ? JSON.parse(application.extractedData) : null,
    underwriting: application.underwritingResult ? JSON.parse(application.underwritingResult) : null,
  };

  return NextResponse.json(report);
}
