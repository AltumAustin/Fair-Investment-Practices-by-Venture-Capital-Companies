import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firmName, headquartersLocation, name, email, password } = body;

    if (!firmName || !name || !email || !password) {
      return NextResponse.json(
        { error: "Firm name, name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create VC firm and admin user in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const vcFirm = await tx.vCFirm.create({
        data: {
          name: firmName,
          headquartersLocation: headquartersLocation || null,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: "ADMIN",
          vcFirmId: vcFirm.id,
        },
      });

      return { vcFirm, user };
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        firmId: result.vcFirm.id,
        userId: result.user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
