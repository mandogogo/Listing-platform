import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

// POST /api/auth/register
// body: { name, email, password, phone?, countryId?, cityId?, language? }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password, phone, countryId, cityId, language } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      countryId,
      cityId,
      language: language ?? "ar",
    },
    select: {
      id: true,
      name: true,
      email: true,
      language: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ data: user }, { status: 201 });
}
