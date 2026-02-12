"use client";

import { SeatData } from "./FloorPlan";

interface ReservationPanelProps {
  seats: SeatData[];
  onCancel: (reservationId: string) => void;
  selectedDateLabel: string;
}

export default function ReservationPanel({
  seats,
  onCancel,
  selectedDateLabel,
}: ReservationPanelProps) {
  const myReservation = seats.find((s) => s.status === "mine");
  const freeCount = seats.filter((s) => s.status === "free").length;
  const reservedCount = seats.filter(
    (s) => s.status === "reserved" || s.status === "mine"
  ).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Statistiques */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          {selectedDateLabel}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{freeCount}</p>
            <p className="text-xs text-green-500 font-medium">Libres</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{reservedCount}</p>
            <p className="text-xs text-red-500 font-medium">Réservées</p>
          </div>
        </div>
      </div>

      {/* Ma réservation */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Ma réservation
        </h3>
        {myReservation ? (
          <div className="bg-indigo-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {myReservation.label}
                </span>
              </div>
              <div>
                <p className="font-semibold text-indigo-700">
                  Place {myReservation.label}
                </p>
                <p className="text-xs text-indigo-400">{selectedDateLabel}</p>
              </div>
            </div>
            <button
              onClick={() =>
                myReservation.reservationId &&
                onCancel(myReservation.reservationId)
              }
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Annuler ma réservation
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <svg
              className="w-8 h-8 text-slate-300 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-sm text-slate-400">
              Aucune réservation pour cette date
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Cliquez sur une place libre dans le plan
            </p>
          </div>
        )}
      </div>

      {/* Liste des réservations */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Toutes les réservations
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {seats
            .filter((s) => s.status === "reserved" || s.status === "mine")
            .map((seat) => (
              <div
                key={seat.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg ${
                  seat.status === "mine" ? "bg-indigo-50" : "bg-slate-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white ${
                    seat.status === "mine" ? "bg-indigo-500" : "bg-red-500"
                  }`}
                >
                  {seat.label}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {seat.reservedBy}
                  </p>
                  <p className="text-xs text-slate-400">Place {seat.label}</p>
                </div>
                {seat.status === "mine" && (
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                    Moi
                  </span>
                )}
              </div>
            ))}
          {seats.filter(
            (s) => s.status === "reserved" || s.status === "mine"
          ).length === 0 && (
            <p className="text-sm text-slate-400 text-center py-3">
              Aucune réservation
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
