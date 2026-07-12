import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLocaleFromRequest, localize } from "@/lib/locale";
import { auth } from "@/lib/auth";

// GET /api/organizations?city=dubai&category=printing&q=keyword&page=1
export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const { searchParams } = new URL(request.url);

  const citySlug = searchParams.get("city");
  const categorySlug = searchParams.get("category");
  const query = searchParams.get("q");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = 20;

  const where: any = {
    publishStatus: "PUBLISHED",
  };

  if (citySlug) {
    where.city = { slug: citySlug };
  }

  if (categorySlug) {
    where.categories = {
      some: { category: { slug: categorySlug } },
    };
  }

  if (query) {
    where.OR = [
      { nameAr: { contains: query, mode: "insensitive" } },
      { nameEn: { contains: query, mode: "insensitive" } },
      { descriptionAr: { contains: query, mode: "insensitive" } },
      { descriptionEn: { contains: query, mode: "insensitive" } },
    ];
  }

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      include: {
        city: true,
        country: true,
        categories: { include: { category: true } },
      },
      orderBy: [{ verificationStatus: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.organization.count({ where }),
  ]);

  const data = organizations.map((org) => ({
    id: org.id,
    name: localize(org, "name", locale),
    description: localize(org, "description", locale),
    city: localize(org.city, "name", locale),
    type: org.type,
    phone: org.phone,
    whatsapp: org.whatsapp,
    verified: org.verificationStatus === "VERIFIED",
    categories: org.categories.map((c) => localize(c.category, "name", locale)),
  }));

  return NextResponse.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

// POST /api/organizations - create a new business listing (draft status)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const ownerUserId = (session.user as any).id as string;

  const body = await request.json();

  const required = ["nameAr", "nameEn", "type", "countryId", "cityId"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const organization = await prisma.organization.create({
    data: {
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      legalName: body.legalName,
      type: body.type,
      descriptionAr: body.descriptionAr,
      descriptionEn: body.descriptionEn,
      countryId: body.countryId,
      cityId: body.cityId,
      address: body.address,
      phone: body.phone,
      whatsapp: body.whatsapp,
      email: body.email,
      publishStatus: "PENDING_REVIEW",
      members: {
        create: {
          userId: ownerUserId,
          role: "OWNER",
        },
      },
      ...(body.categoryId && {
        categories: {
          create: { categoryId: body.categoryId },
        },
      }),
    },
  });

  return NextResponse.json({ data: organization }, { status: 201 });
}
