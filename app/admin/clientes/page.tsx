'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Search,
  Sparkles,
  UserPlus,
  Users,
  X,
} from 'lucide-react'

import { AdminShell } from '@/components/admin/AdminShell'

type Client = {
  id: number
  initials: string
  name: string
  phone: string
  email: string
  appointments: number
  lastAppointment: string
  nextAppointment?: string
  favoriteService: string
  status: 'Ativa' | 'Inativa'
}

const CLIENTS: Client[] = [
  {
    id: 1,
    initials: 'AS',
    name: 'Ana Silva',
    phone: '(11) 99999-1234',
    email: 'ana.silva@email.com',
    appointments: 12,
    lastAppointment: '14 ago',
    nextAppointment: '22 ago · 09:00',
    favoriteService: 'Design + Henna',
    status: 'Ativa',
  },
  {
    id: 2,
    initials: 'MC',
    name: 'Mariana Costa',
    phone: '(11) 98888-2345',
    email: 'mariana@email.com',
    appointments: 8,
    lastAppointment: '12 ago',
    nextAppointment: '20 ago · 10:30',
    favoriteService: 'Design + Tintura',
    status: 'Ativa',
  },
  {
    id: 3,
    initials: 'CS',
    name: 'Camila Souza',
    phone: '(11) 97777-3456',
    email: 'camila.souza@email.com',
    appointments: 15,
    lastAppointment: '10 ago',
    nextAppointment: '25 ago · 14:00',
    favoriteService: 'Design de Sobrancelha',
    status: 'Ativa',
  },
  {
    id: 4,
    initials: 'JA',
    name: 'Juliana Alves',
    phone: '(11) 96666-4567',
    email: 'juliana@email.com',
    appointments: 6,
    lastAppointment: '08 ago',
    favoriteService: 'Design + Henna',
    status: 'Ativa',
  },
  {
    id: 5,
    initials: 'BF',
    name: 'Beatriz Ferreira',
    phone: '(11) 95555-5678',
    email: 'beatriz@email.com',
    appointments: 3,
    lastAppointment: '02 ago',
    favoriteService: 'Manutenção de tintura',
    status: 'Ativa',
  },
  {
    id: 6,
    initials: 'LM',
    name: 'Larissa Martins',
    phone: '(11) 94444-6789',
    email: 'larissa@email.com',
    appointments: 1,
    lastAppointment: '28 jul',
    favoriteService: 'Design de Sobrancelha',
    status: 'Inativa',
  },
]

export default function AdminClientsPage() {
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativa' | 'Inativa'>('Todos')

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return CLIENTS.filter((client) => {
      const matchesSearch =
        !normalizedSearch ||
        client.name.toLowerCase().includes(normalizedSearch) ||
        client.phone.includes(normalizedSearch) ||
        client.email.toLowerCase().includes(normalizedSearch)

      const matchesStatus = statusFilter === 'Todos' || client.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />
          <div className="absolute top-[38%] -left-40 h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />
          <div className="absolute bottom-0 right-[18%] h-80 w-80 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-9">
          {/* HEADER */}
          <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
                  Minea
                </span>

                <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#cdb9ae]">
                  Gestão & Bem-estar
                </span>
              </div>

              <h1 className="mt-3 font-display text-[34px] leading-none tracking-[-0.03em] text-[#6b5850] lg:text-[40px]">
                Clientes
              </h1>

              <p className="mt-3 max-w-md text-xs leading-relaxed text-[#a48a7f]">
                Gerencie seus clientes, acompanhe históricos e mantenha relacionamentos mais
                próximos.
              </p>
            </div>

            <button
              type="button"
              className="group flex h-12 items-center justify-between gap-4 rounded-[17px] bg-[#8a6f63] px-4 text-[12px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156] active:scale-[.985]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/15">
                  <UserPlus size={16} strokeWidth={1.8} />
                </span>
                Novo cliente
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </section>

          {/* STATS */}
          <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <ClientStat label="Clientes ativos" value="248" description="Neste mês" icon={Users} />

            <ClientStat
              label="Novos clientes"
              value="18"
              description="Nos últimos 30 dias"
              icon={UserPlus}
            />

            <ClientStat
              label="Agendamentos"
              value="126"
              description="Este mês"
              icon={CalendarDays}
            />

            <ClientStat
              label="Retorno"
              value="78%"
              description="Clientes recorrentes"
              icon={Clock3}
            />
          </section>

          {/* MAIN */}
          <section className="mt-7 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Base de clientes
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <h2 className="font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                    Todas as clientes
                  </h2>

                  <span className="rounded-full bg-[#f6ede8] px-2.5 py-1 text-[9px] font-bold text-[#a98d81]">
                    {filteredClients.length}
                  </span>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full lg:max-w-[310px]">
                <Search
                  size={15}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bda79d]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar cliente..."
                  className="h-11 w-full rounded-[15px] border border-[#f0e6df] bg-[#faf6f3] pl-11 pr-10 text-[11px] font-medium text-[#6b5850] outline-none placeholder:text-[#c4afa5] focus:border-[#d9c3b8] focus:bg-white"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#bda79d] hover:bg-[#f3e9e4]"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
              {(['Todos', 'Ativa', 'Inativa'] as const).map((filter) => {
                const active = statusFilter === filter

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={[
                      'shrink-0 rounded-full px-4 py-2 text-[9px] font-bold transition-all',
                      active
                        ? 'bg-[#8a6f63] text-white shadow-[0_8px_18px_-12px_rgba(138,111,99,.6)]'
                        : 'border border-[#eee5df] bg-[#faf6f3] text-[#ad9489] hover:bg-white',
                    ].join(' ')}
                  >
                    {filter}
                  </button>
                )
              })}
            </div>

            {/* Desktop table */}
            <div className="mt-5 hidden overflow-hidden rounded-[22px] border border-[#f1e8e2] lg:block">
              <div className="grid grid-cols-[2fr_1.3fr_1.3fr_1.3fr_1fr_40px] items-center bg-[#faf6f3] px-5 py-3">
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
                  Cliente
                </span>

                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
                  Último atendimento
                </span>

                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
                  Próximo
                </span>

                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
                  Serviço favorito
                </span>

                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
                  Status
                </span>

                <span />
              </div>

              <div className="divide-y divide-[#f1e8e2]">
                {filteredClients.map((client) => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    onClick={() => setSelectedClient(client)}
                  />
                ))}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="mt-5 flex flex-col gap-3 lg:hidden">
              {filteredClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onClick={() => setSelectedClient(client)}
                />
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f6ede8] text-[#b89a8d]">
                  <Users size={20} strokeWidth={1.5} />
                </div>

                <p className="mt-4 font-display text-[23px] text-[#8a6f63]">
                  Nenhuma cliente encontrada
                </p>

                <p className="mt-2 text-[10px] text-[#b49b90]">
                  Tente buscar por outro nome ou telefone.
                </p>
              </div>
            )}
          </section>
        </div>

        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#493b36]/20 p-0 backdrop-blur-sm sm:items-center sm:p-5">
            <div className="w-full max-w-lg overflow-hidden rounded-t-[30px] border border-white/80 bg-[#faf6f3] shadow-[0_30px_80px_-30px_rgba(64,46,40,.4)] sm:rounded-[30px]">
              <div className="relative overflow-hidden bg-[#ead8cf] p-6">
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/40 bg-white/15" />

                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="absolute z-10 right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#9b7c6e] backdrop-blur transition hover:bg-white/50"
                >
                  <X size={15} />
                </button>

                <div className="relative flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/60 bg-[#c9afa5] text-[14px] font-bold text-white shadow-sm">
                    {selectedClient.initials}
                  </div>

                  <div>
                    <p className="font-display text-[28px] leading-none tracking-[-0.025em] text-[#6b5850]">
                      {selectedClient.name}
                    </p>

                    <p className="mt-2 text-[10px] text-[#a48a7f]">Cliente desde janeiro de 2026</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Telefone" value={selectedClient.phone} />

                  <DetailItem label="Atendimentos" value={`${selectedClient.appointments} vezes`} />

                  <DetailItem label="Último atendimento" value={selectedClient.lastAppointment} />

                  <DetailItem label="Serviço favorito" value={selectedClient.favoriteService} />
                </div>

                {selectedClient.nextAppointment && (
                  <div className="mt-4 rounded-[21px] bg-[#f6ede8] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-[#a98d81]">
                        <CalendarDays size={16} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-[#80685e]">Próximo atendimento</p>

                        <p className="mt-1 text-[10px] text-[#b49b90]">
                          {selectedClient.nextAppointment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[15px] bg-[#8a6f63] text-[10px] font-bold text-white transition hover:bg-[#7c6156]"
                  >
                    <CalendarDays size={14} />
                    Novo agendamento
                  </button>

                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-[15px] border border-[#eee2dc] bg-white text-[#a98d81] transition hover:bg-[#faf4f1]"
                  >
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminShell>
  )
}

function ClientStat({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string
  value: string
  description: string
  icon: typeof Users
}) {
  return (
    <div className="group rounded-[25px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_-30px_rgba(64,46,40,.28)] backdrop-blur transition-all hover:-translate-y-0.5 lg:p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f6ede8] text-[#ab8f83] transition-transform group-hover:scale-[1.03]">
        <Icon size={16} strokeWidth={1.7} />
      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
        {label}
      </p>

      <p className="mt-1 font-display text-[27px] tracking-[-0.02em] text-[#6b5850]">{value}</p>

      <p className="mt-1 text-[9px] text-[#b49b90]">{description}</p>
    </div>
  )
}

function ClientRow({ client, onClick }: { client: Client; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group grid w-full grid-cols-[2fr_1.3fr_1.3fr_1.3fr_1fr_40px] items-center px-5 py-4 text-left transition-colors hover:bg-[#fdf9f7]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d6beb5] text-[9px] font-bold text-white">
          {client.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-[#6b5850]">{client.name}</p>

          <p className="mt-1 truncate text-[9px] text-[#b49b90]">{client.phone}</p>
        </div>
      </div>

      <span className="text-[10px] text-[#a48a7f]">{client.lastAppointment}</span>

      <span className="text-[10px] text-[#a48a7f]">{client.nextAppointment || '—'}</span>

      <span className="truncate pr-3 text-[10px] text-[#a48a7f]">{client.favoriteService}</span>

      <span
        className={[
          'w-fit rounded-full px-3 py-1.5 text-[8px] font-bold',
          client.status === 'Ativa' ? 'bg-[#f3e9e4] text-[#8f7165]' : 'bg-[#f5f1ee] text-[#b4a098]',
        ].join(' ')}
      >
        {client.status}
      </span>

      <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#d0beb5] transition-all group-hover:bg-[#faf4f1] group-hover:text-[#a98d81]">
        <ChevronRight size={14} />
      </span>
    </button>
  )
}

function ClientCard({ client, onClick }: { client: Client; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-[22px] border border-[#f1e8e2] bg-white/90 p-4 text-left shadow-[0_13px_30px_-25px_rgba(64,46,40,.25)] transition-all hover:-translate-y-0.5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d6beb5] text-[9px] font-bold text-white">
        {client.initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[12px] font-bold text-[#6b5850]">{client.name}</p>

          <span
            className={[
              'shrink-0 rounded-full px-2 py-1 text-[7px] font-bold',
              client.status === 'Ativa'
                ? 'bg-[#f3e9e4] text-[#8f7165]'
                : 'bg-[#f5f1ee] text-[#b4a098]',
            ].join(' ')}
          >
            {client.status}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-3">
          <span className="flex items-center gap-1 text-[9px] text-[#b49b90]">
            <CalendarDays size={10} />
            {client.appointments} atendimentos
          </span>

          <span className="truncate text-[9px] text-[#b49b90]">{client.favoriteService}</span>
        </div>
      </div>

      <ChevronRight
        size={15}
        className="shrink-0 text-[#cdb9ae] transition-transform group-hover:translate-x-0.5"
      />
    </button>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[17px] bg-[#faf6f3] p-3">
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#c2a99d]">{label}</p>

      <p className="mt-1.5 truncate text-[10px] font-semibold text-[#80685e]">{value}</p>
    </div>
  )
}
