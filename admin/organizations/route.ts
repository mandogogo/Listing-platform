import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getLocaleFromRequest, localize } from "@/lib/locale";

function requireStaff(session: any) {
  const role = session?.user?.platformRole;
  return role === "ADMIN" || role === "MODERATOR";
}

// GET /api/admin/organizations?status=PENDING_REVIEW
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !requireStaff(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const locale = getLocaleFromRequest(request);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "PENDING_REVIEW";

  const organizations = await prisma.organization.findMany({
    where: { publishStatus: status as any },
    include: {
      city: true,
      country: true,
      categories: { include: { category: true } },
      members: { include: { user: true }, where: { role: "OWNER" } },
    },
    orderBy: { createdAt: "asc" },
  });

  const data = organizations.map((org: (typeof organizations)[number]) => ({
    id: org.id,
    name: localize(org, "name", locale),
    description: localize(org, "description", locale),
    type: org.type,
    city: localize(org.city, "name", locale),
    country: localize(org.country, "name", locale),
    phone: org.phone,
    email: org.email,
    categories: org.categories.map((c) => localize(c.category, "name", locale)),
    owner: org.members[0]?.user
      ? { name: org.members[0].user.name, email: org.members[0].user.email }
      : null,
    createdAt: org.createdAt,
  }));

  return NextResponse.json({ data });
}
