"use client";

import { useState } from "react";

export interface SeatData {
  id: string;
  label: string;
  x: number;
  y: number;
  status: "free" | "reserved" | "mine";
  reservedBy: string | null;
  reservationId: string | null;
}

interface FloorPlanProps {
  seats: SeatData[];
  onSeatClick: (seat: SeatData) => void;
  loading: boolean;
}

export default function FloorPlan({
  seats,
  onSeatClick,
  loading,
}: FloorPlanProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    seat: SeatData;
  } | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Chargement du plan...</p>
        </div>
      </div>
    );
  }

  const handleMouseEnter = (seat: SeatData, e: React.MouseEvent) => {
    setHoveredSeat(seat.id);
    const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 50,
      seat,
    });
  };

  const handleMouseLeave = () => {
    setHoveredSeat(null);
    setTooltip(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Plan du bureau
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Libre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Réservé
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            Ma place
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 900 520"
          className="w-full h-auto"
          style={{ maxHeight: "520px" }}
        >
          {/* Fond du bureau */}
          <rect
            x="20"
            y="20"
            width="860"
            height="480"
            rx="16"
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {/* Porte d'entrée */}
          <rect x="20" y="220" width="8" height="80" fill="#6366f1" rx="2" />
          <text x="10" y="265" fontSize="10" fill="#6366f1" textAnchor="middle" transform="rotate(-90, 10, 265)">
            ENTRÉE
          </text>

          {/* Zone 1 - Rangée haute gauche (Bureau 1-5) */}
          <rect x="80" y="40" width="360" height="10" rx="3" fill="#cbd5e1" />
          <text x="260" y="37" fontSize="11" fill="#94a3b8" textAnchor="middle" fontWeight="600">
            Bureau A
          </text>

          {/* Zone 2 - Rangée haute droite (Bureau 6-10) */}
          <rect x="500" y="40" width="360" height="10" rx="3" fill="#cbd5e1" />
          <text x="680" y="37" fontSize="11" fill="#94a3b8" textAnchor="middle" fontWeight="600">
            Bureau B
          </text>

          {/* Zone 3 - Rangée basse gauche (Bureau 11-15) */}
          <rect x="80" y="280" width="360" height="10" rx="3" fill="#cbd5e1" />
          <text x="260" y="310" fontSize="11" fill="#94a3b8" textAnchor="middle" fontWeight="600">
            Bureau C
          </text>

          {/* Zone 4 - Rangée basse droite (Bureau 16-20) */}
          <rect x="500" y="280" width="360" height="10" rx="3" fill="#cbd5e1" />
          <text x="680" y="310" fontSize="11" fill="#94a3b8" textAnchor="middle" fontWeight="600">
            Bureau D
          </text>

          {/* Salle de réunion */}
          <rect
            x="660"
            y="370"
            width="200"
            height="110"
            rx="10"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          <text
            x="760"
            y="430"
            fontSize="12"
            fill="#94a3b8"
            textAnchor="middle"
            fontWeight="600"
          >
            Salle de réunion
          </text>

          {/* Espace café */}
          <rect
            x="80"
            y="400"
            width="150"
            height="80"
            rx="10"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          <text
            x="155"
            y="445"
            fontSize="12"
            fill="#94a3b8"
            textAnchor="middle"
            fontWeight="600"
          >
            Espace café
          </text>

          {/* Sièges */}
          {seats.map((seat) => {
            const isHovered = hoveredSeat === seat.id;
            const seatClass =
              seat.status === "mine"
                ? "seat-mine"
                : seat.status === "reserved"
                ? "seat-reserved"
                : "seat-free";

            return (
              <g
                key={seat.id}
                className={`seat ${seatClass}`}
                onClick={() => onSeatClick(seat)}
                onMouseEnter={(e) => handleMouseEnter(seat, e)}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                  transformOrigin: `${seat.x}px ${seat.y}px`,
                  transition: "transform 0.15s ease",
                }}
              >
                <rect
                  x={seat.x - 25}
                  y={seat.y - 20}
                  width="50"
                  height="40"
                  rx="8"
                />
                <text className="seat-label" x={seat.x} y={seat.y}>
                  {seat.label}
                </text>
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect
                x={tooltip.x - 70}
                y={tooltip.y - 10}
                width="140"
                height="36"
                rx="6"
                fill="#1e293b"
                opacity="0.95"
              />
              <text
                x={tooltip.x}
                y={tooltip.y + 4}
                fontSize="11"
                fill="white"
                textAnchor="middle"
                fontWeight="500"
              >
                {tooltip.seat.status === "free"
                  ? `${tooltip.seat.label} - Libre`
                  : tooltip.seat.status === "mine"
                  ? `${tooltip.seat.label} - Ma place`
                  : `${tooltip.seat.reservedBy}`}
              </text>
              <text
                x={tooltip.x}
                y={tooltip.y + 18}
                fontSize="10"
                fill="#94a3b8"
                textAnchor="middle"
              >
                {tooltip.seat.status === "free"
                  ? "Cliquer pour réserver"
                  : tooltip.seat.status === "mine"
                  ? "Cliquer pour annuler"
                  : "Place occupée"}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
