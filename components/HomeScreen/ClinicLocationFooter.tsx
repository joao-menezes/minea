import { ArrowUpRight, MapPin } from 'lucide-react';

import { CLINIC, getMapDirectionsUrl, getMapEmbedUrl } from '@/lib/clinic';

export function ClinicLocationFooter() {
  return (
    <footer className="mt-8 overflow-hidden rounded-[20px] border border-[#eaded8] bg-white/75 lg:mt-12">
      <iframe
        title={`Mapa: ${CLINIC.name}`}
        src={getMapEmbedUrl(CLINIC.latitude, CLINIC.longitude)}
        className="block h-48 w-full border-0 sm:h-64 lg:h-80"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <a
        href={getMapDirectionsUrl(CLINIC.latitude, CLINIC.longitude)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-white"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#f4ece8] text-[#98766b]">
          <MapPin size={16} strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#ad958b]">
            Onde estamos
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-[#68534b]">{CLINIC.name}</p>
        </div>

        <span className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-[#98766b]">
          Ver como chegar
          <ArrowUpRight
            size={11}
            strokeWidth={2}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </a>
    </footer>
  );
}
