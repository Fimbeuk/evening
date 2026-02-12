import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/reservations/counts?dates=2026-02-12,2026-02-13,...
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const datesParam = searchParams.get("dates");

  if (!datesParam) {
    return NextResponse.json({ error: "Dates requises" }, { status: 400 });
  }

  const dates = datesParam.split(",");

  const counts = await prisma.reservation.groupBy({
    by: ["date"],
    where: { date: { in: dates } },
    _count: { id: true },
  });

  // Construire un objet { "2026-02-12": 3, "2026-02-13": 0, ... }
  const result: Record<string, number> = {};
  for (const date of dates) {
    const found = counts.find((c) => c.date === date);
    result[date] = found ? found._count.id : 0;
  }

  return NextResponse.json(result);
}
