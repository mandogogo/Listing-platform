import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLocaleFromRequest, localize } from "@/lib/locale";
import { auth } from "@/lib/auth";

// GET /api/organizations/:id - full business profile page data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const locale = getLocaleFromRequest(request);

  const org = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      city: true,
      country: true,
      categories: { include: { category: true } },
      media: { orderBy: { sortOrder: "asc" } },
      workingHours: { orderBy: { dayOfWeek: "asc" } },
    },
  });

  if (!org || org.publishStatus !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: org.id,
      name: localize(org, "name", locale),
      description: localize(org, "description", locale),
      type: org.type,
      city: localize(org.city, "name", locale),
      address: org.address,
      latitude: org.latitude,
      longitude: org.longitude,
      website: org.website,
      phone: org.phone,
      whatsapp: org.whatsapp,
      email: org.email,
      verified: org.verificationStatus === "VERIFIED",
      categories: org.categories.map((c) => localize(c.category, "name", locale)),
      media: org.media.map((m) => ({ url: m.url, type: m.type, isPrimary: m.isPrimary })),
      workingHours: org.workingHours,
    },
  });
}

// PATCH /api/organizations/:id - update (owner/admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;
  const platformRole = (session.user as any).platformRole as string;

  const isPlatformStaff = platformRole === "ADMIN" || platformRole === "MODERATOR";

  if (!isPlatformStaff) {
    const membership = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: params.id, userId } },
    });

    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const body = await request.json();

  const updated = await prisma.organization.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ data: updated });
}
