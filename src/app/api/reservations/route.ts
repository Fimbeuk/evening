import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays, startOfDay, format, parseISO, differenceInCalendarDays } from "date-fns";

// GET /api/reservations?date=2025-01-15
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date requise" }, { status: 400 });
  }

  const reservations = await prisma.reservation.findMany({
    where: { date },
    include: { seat: true },
  });

  const seats = await prisma.seat.findMany();

  const seatsWithStatus = seats.map((seat) => {
    const reservation = reservations.find((r) => r.seatId === seat.id);
    return {
      ...seat,
      status: reservation
        ? reservation.userId === session.user!.id
          ? "mine"
          : "reserved"
        : "free",
      reservedBy: reservation?.userName || null,
      reservationId: reservation?.id || null,
    };
  });

  return NextResponse.json(seatsWithStatus);
}

// POST /api/reservations
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { seatId, date } = body;

  if (!seatId || !date) {
    return NextResponse.json(
      { error: "seatId et date sont requis" },
      { status: 400 }
    );
  }

  // Vérifier la règle J-7 : on ne peut réserver que 7 jours à l'avance max
  const today = startOfDay(new Date());
  const reservationDate = startOfDay(parseISO(date));
  const diff = differenceInCalendarDays(reservationDate, today);

  if (diff < 0) {
    return NextResponse.json(
      { error: "Impossible de réserver une date passée" },
      { status: 400 }
    );
  }

  if (diff > 7) {
    return NextResponse.json(
      { error: "La réservation n'est possible que 7 jours à l'avance maximum (J-7)" },
      { status: 400 }
    );
  }

  // Vérifier si le siège est déjà réservé pour cette date
  const existingSeatReservation = await prisma.reservation.findUnique({
    where: { date_seatId: { date, seatId } },
  });

  if (existingSeatReservation) {
    return NextResponse.json(
      { error: "Ce siège est déjà réservé pour cette date" },
      { status: 409 }
    );
  }

  // Vérifier si l'utilisateur a déjà une réservation pour cette date
  const existingUserReservation = await prisma.reservation.findUnique({
    where: { date_userId: { date, userId: session.user.id } },
  });

  if (existingUserReservation) {
    return NextResponse.json(
      { error: "Vous avez déjà une réservation pour cette date" },
      { status: 409 }
    );
  }

  const reservation = await prisma.reservation.create({
    data: {
      date,
      seatId,
      userId: session.user.id,
      userName: session.user.name || session.user.email || "Inconnu",
    },
    include: { seat: true },
  });

  return NextResponse.json(reservation, { status: 201 });
}
