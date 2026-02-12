"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { format, startOfDay, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import Header from "@/components/Header";
import DatePicker from "@/components/DatePicker";
import FloorPlan, { SeatData } from "@/components/FloorPlan";
import ReservationPanel from "@/components/ReservationPanel";

const TOTAL_SEATS = 20;

export default function Home() {
  const { data: session, status } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(new Date())
  );
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reservationCounts, setReservationCounts] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const selectedDateLabel = format(selectedDate, "EEEE d MMMM yyyy", {
    locale: fr,
  });

  const fetchCounts = useCallback(async () => {
    if (status !== "authenticated") return;
    const today = startOfDay(new Date());
    const dates = Array.from({ length: 8 }, (_, i) =>
      format(addDays(today, i), "yyyy-MM-dd")
    );
    try {
      const res = await fetch(`/api/reservations/counts?dates=${dates.join(",")}`);
      if (res.ok) {
        const data = await res.json();
        setReservationCounts(data);
      }
    } catch {}
  }, [status]);

  const fetchSeats = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reservations?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setSeats(data);
      }
    } catch {
      showToast("Erreur lors du chargement des places", "error");
    } finally {
      setLoading(false);
    }
  }, [dateStr, status]);

  useEffect(() => {
    fetchSeats();
    fetchCounts();
  }, [fetchSeats, fetchCounts]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSeatClick = async (seat: SeatData) => {
    if (actionLoading) return;

    if (seat.status === "reserved") {
      showToast(`Place réservée par ${seat.reservedBy}`, "error");
      return;
    }

    if (seat.status === "mine") {
      // Annuler la réservation
      await handleCancel(seat.reservationId!);
      return;
    }

    // Réserver
    setActionLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatId: seat.id, date: dateStr }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Place ${seat.label} réservée avec succès !`, "success");
        await fetchSeats();
        await fetchCounts();
      } else {
        showToast(data.error || "Erreur lors de la réservation", "error");
      }
    } catch {
      showToast("Erreur de connexion", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (reservationId: string) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Réservation annulée avec succès !", "success");
        await fetchSeats();
        await fetchCounts();
      } else {
        const data = await res.json();
        showToast(data.error || "Erreur lors de l'annulation", "error");
      }
    } catch {
      showToast("Erreur de connexion", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Header />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Bienvenue sur Evening
            </h2>
            <p className="text-slate-500 mb-6">
              Connectez-vous avec votre compte professionnel pour réserver votre
              place au bureau.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          reservationCounts={reservationCounts}
          totalSeats={TOTAL_SEATS}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FloorPlan
              seats={seats}
              onSeatClick={handleSeatClick}
              loading={loading}
            />
          </div>
          <div>
            <ReservationPanel
              seats={seats}
              onCancel={handleCancel}
              selectedDateLabel={selectedDateLabel}
            />
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 z-50 animate-slide-up ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
          style={{
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {toast.type === "success" ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Loading overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-4 shadow-xl">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
