'use client';

import { BaseModal } from '@/components/BaseModal';
import type { Client } from '@/types';

import { ClientActions } from './ClientActions';
import { ClientDetails } from './ClientDetails';
import { ClientModalHeader } from './ClientModalHeader';
import { NextAppointment } from './NextAppointment';

type Props = {
  client: Client;
  currentUserId?: string | null;
  onClose: () => void;
  onClientUpdated: (client: Client) => void;
};

export function ClientModal({ client, currentUserId, onClose, onClientUpdated }: Props) {
  return (
    <BaseModal
      open
      onClose={onClose}
      showCloseButton={false}
      className="rounded-t-[30px] shadow-[0_30px_80px_-30px_rgba(64,46,40,.4)] sm:rounded-[30px]"
      backdropClassName="bg-[#493b36]/20 backdrop-blur-sm"
    >
      <ClientModalHeader client={client} onClose={onClose} />

      <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
        <ClientDetails
          client={client}
          currentUserId={currentUserId}
          onClientUpdated={onClientUpdated}
        />

        {client.lastAppointmentAt && <NextAppointment appointment={client.lastAppointmentAt} />}

        <ClientActions />
      </div>
    </BaseModal>
  );
}
