'use client';

import type { Client } from '@/types';

import { ClientActions } from './ClientActions';
import { ClientDetails } from './ClientDetails';
import { ClientModalHeader } from './ClientModalHeader';
import { NextAppointment } from './NextAppointment';

type Props = {
  client: Client;
  onClose: () => void;
};

export function ClientModal({ client, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#493b36]/20 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[30px] border border-white/80 bg-[#faf6f3] shadow-[0_30px_80px_-30px_rgba(64,46,40,.4)] sm:max-h-[90vh] sm:rounded-[30px]">
        <ClientModalHeader client={client} onClose={onClose} />

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <ClientDetails client={client} />

          {client.lastAppointmentAt && <NextAppointment appointment={client.lastAppointmentAt} />}

          <ClientActions />
        </div>
      </div>
    </div>
  );
}
