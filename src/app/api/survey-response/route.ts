import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { surveyResponseSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = surveyResponseSchema.parse(body);

    const { token, ...responseData } = validated;

    // Validate the token and check invitation status within a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Find the invitation by token
      const invitation = await tx.surveyInvitation.findUnique({
        where: { token },
        include: {
          investment: true,
        },
      });

      if (!invitation) {
        throw new Error("INVALID_TOKEN");
      }

      if (invitation.status === "COMPLETED") {
        throw new Error("ALREADY_COMPLETED");
      }

      // Create the survey response
      const surveyResponse = await tx.surveyResponse.create({
        data: {
          surveyInvitationId: invitation.id,
          calendarYear: invitation.calendarYear,
          ...responseData,
        },
      });

      // Update the invitation status to COMPLETED
      await tx.surveyInvitation.update({
        where: { id: invitation.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      return surveyResponse;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error?.message === "INVALID_TOKEN") {
      return NextResponse.json(
        { error: "Invalid or expired survey token" },
        { status: 404 }
      );
    }
    if (error?.message === "ALREADY_COMPLETED") {
      return NextResponse.json(
        { error: "This survey has already been completed" },
        { status: 409 }
      );
    }
    console.error("Error submitting survey response:", error);
    return NextResponse.json(
      { error: "Failed to submit survey response" },
      { status: 500 }
    );
  }
}
