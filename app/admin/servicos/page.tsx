'use client';

import { useMemo, useState } from 'react';

import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Edit3,
  Plus,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

import { AdminShell } from '@/components/admin/AdminShell';

type Service = {
  id: number;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  appointments: number;
  clients: number;
  active: boolean;
  popular?: boolean;
};

const SERVICES: Service[] = [
  {
    id: 1,
    name: 'Design + Henna',
    category: 'Sobrancelhas',
    description: 'Design personalizado com aplicação de henna para realçar o olhar.',
    duration: '45 min',
    price: 75,
    appointments: 42,
    clients: 31,
    active: true,
    popular: true,
  },
  {
    id: 2,
    name: 'Design + Tintura',
    category: 'Sobrancelhas',
    description: 'Modelagem e tintura para um resultado natural e sofisticado.',
    duration: '40 min',
    price: 65,
    appointments: 36,
    clients: 28,
    active: true,
    popular: true,
  },
  {
    id: 3,
    name: 'Design de Sobrancelha',
    category: 'Sobrancelhas',
    description: 'Design personalizado respeitando o formato natural do rosto.',
    duration: '30 min',
    price: 45,
    appointments: 29,
    clients: 24,
    active: true,
  },
  {
    id: 4,
    name: 'Manutenção de Tintura',
    category: 'Sobrancelhas',
    description: 'Manutenção da coloração para preservar o resultado do procedimento.',
    duration: '25 min',
    price: 40,
    appointments: 24,
    clients: 19,
    active: true,
  },
];

const CATEGORIES = ['Todos', 'Sobrancelhas', 'Facial', 'Cílios'];

export default function AdminServicesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const insight = false;

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return SERVICES.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory = category === 'Todos' || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const activeServices = SERVICES.filter((service) => service.active).length;

  const totalAppointments = SERVICES.reduce((total, service) => total + service.appointments, 0);

  const averagePrice =
    SERVICES.reduce((total, service) => total + service.price, 0) / SERVICES.length;

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />

          <div className="absolute -left-40 top-[38%] h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />

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
                Serviços
              </h1>

              <p className="mt-3 max-w-md text-xs leading-relaxed text-[#a48a7f]">
                Organize seu catálogo, preços e serviços oferecidos pela clínica.
              </p>
            </div>

            <button
              type="button"
              className="group flex h-12 items-center justify-between gap-4 rounded-[17px] bg-[#8a6f63] px-4 text-[12px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156] active:scale-[.985]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/15">
                  <Plus size={16} strokeWidth={1.8} />
                </span>
                Novo serviço
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
            <ServiceStat
              label="Serviços ativos"
              value={String(activeServices)}
              description="Disponíveis para agendamento"
              icon={Sparkles}
            />

            <ServiceStat
              label="Agendamentos"
              value={String(totalAppointments)}
              description="Neste mês"
              icon={CalendarDays}
            />

            <ServiceStat
              label="Ticket médio"
              value={`R$ ${averagePrice.toFixed(0)}`}
              description="Valor médio dos serviços"
              icon={Tag}
            />

            <ServiceStat
              label="Mais procurado"
              value="Henna"
              description="Design + Henna"
              icon={TrendingUp}
            />
          </section>

          {/* TOOLBAR */}
          <section className="mt-7 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Catálogo
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <h2 className="font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                    Seus serviços
                  </h2>

                  <span className="rounded-full bg-[#f6ede8] px-2.5 py-1 text-[9px] font-bold text-[#a98d81]">
                    {filteredServices.length}
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
                  placeholder="Buscar serviço..."
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

            {/* Categories */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((item) => {
                const active = category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={[
                      'shrink-0 rounded-full px-4 py-2 text-[9px] font-bold transition-all',
                      active
                        ? 'bg-[#8a6f63] text-white shadow-[0_8px_18px_-12px_rgba(138,111,99,.6)]'
                        : 'border border-[#eee5df] bg-[#faf6f3] text-[#ad9489] hover:bg-white',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* SERVICES GRID */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => setSelectedService(service)}
                />
              ))}
            </div>

            {/* Empty */}
            {filteredServices.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f6ede8] text-[#b89a8d]">
                  <Sparkles size={20} strokeWidth={1.5} />
                </div>

                <p className="mt-4 font-display text-[23px] text-[#8a6f63]">
                  Nenhum serviço encontrado
                </p>

                <p className="mt-2 text-[10px] text-[#b49b90]">
                  Tente alterar sua busca ou categoria.
                </p>
              </div>
            )}
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
            <div className="relative min-h-[180px] overflow-hidden rounded-[30px] border border-white/30 bg-[#e8d4c9] p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.55),transparent_28%),linear-gradient(135deg,#f7eee9_0%,#ead7cd_52%,#dfc5b9_100%)]" />

              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/40 bg-white/15" />

              <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[#c9ac9e]/15 blur-xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#a98d81]">
                    Destaque do mês
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#9b7c6e] backdrop-blur">
                    <TrendingUp size={14} />
                  </div>
                </div>

                <div className="mt-7 flex items-end justify-between gap-5">
                  <div>
                    <p className="font-display text-[32px] tracking-[-0.03em] text-[#6b5850]">
                      Design + Henna
                    </p>

                    <p className="mt-2 text-[10px] text-[#a48a7f]">42 agendamentos este mês</p>
                  </div>

                  <div className="rounded-full bg-white/40 px-3 py-1.5 text-[9px] font-bold text-[#8f7165] backdrop-blur">
                    +18,4%
                  </div>
                </div>
              </div>
            </div>

            {insight ? (
              <div className="relative overflow-hidden rounded-[30px] border border-[#f1e8e2] bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur">
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#f4e9e3]/60 blur-2xl" />

                <div className="relative">
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                    Dica
                  </p>

                  <div className="mt-6 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#f6ede8] text-[#a98d81]">
                      <Sparkles size={16} strokeWidth={1.7} />
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-[#80685e]">
                        Seu catálogo está performando bem
                      </p>

                      <p className="mt-2 text-[9px] leading-relaxed text-[#b49b90]">
                        Considere destacar os serviços mais procurados na tela de agendamento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </section>
        </div>

        {/* SERVICE MODAL */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#493b36]/20 p-0 backdrop-blur-sm sm:items-center sm:p-5">
            <div className="w-full max-w-lg overflow-hidden rounded-t-[30px] border border-white/80 bg-[#faf6f3] shadow-[0_30px_80px_-30px_rgba(64,46,40,.4)] sm:rounded-[30px]">
              {/* Modal hero */}
              <div className="relative overflow-hidden bg-[#ead8cf] p-6">
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/40 bg-white/15" />

                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#9b7c6e] backdrop-blur transition hover:bg-white/50"
                >
                  <X size={15} />
                </button>

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/60 bg-white/35 text-[#9b7c6e] backdrop-blur">
                    <Sparkles size={21} strokeWidth={1.5} />
                  </div>

                  <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.25em] text-[#a98d81]">
                    {selectedService.category}
                  </p>

                  <h2 className="mt-2 max-w-[340px] font-display text-[30px] leading-[1.05] tracking-[-0.025em] text-[#6b5850]">
                    {selectedService.name}
                  </h2>

                  {selectedService.popular && (
                    <span className="mt-4 inline-flex rounded-full bg-white/40 px-3 py-1.5 text-[8px] font-bold text-[#8f7165] backdrop-blur">
                      Mais procurado
                    </span>
                  )}
                </div>
              </div>

              {/* Modal body */}
              <div className="p-6">
                <p className="text-[11px] leading-relaxed text-[#a48a7f]">
                  {selectedService.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <ServiceDetail
                    label="Valor"
                    value={`R$ ${selectedService.price.toFixed(2).replace('.', ',')}`}
                  />

                  <ServiceDetail label="Duração" value={selectedService.duration} />

                  <ServiceDetail
                    label="Agendamentos"
                    value={String(selectedService.appointments)}
                  />

                  <ServiceDetail label="Clientes" value={String(selectedService.clients)} />
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[15px] bg-[#8a6f63] text-[10px] font-bold text-white transition hover:bg-[#7c6156]"
                  >
                    <Edit3 size={14} />
                    Editar serviço
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex h-11 w-11 items-center justify-center rounded-[15px] border border-[#eee2dc] bg-white text-[#a98d81] transition hover:bg-[#faf4f1]"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminShell>
  );
}

function ServiceCard({ service, onClick }: { service: Service; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[25px] border border-[#f1e8e2] bg-white/90 p-5 text-left shadow-[0_15px_35px_-28px_rgba(64,46,40,.28)] transition-all hover:-translate-y-1 hover:border-[#eadbd4] hover:shadow-[0_22px_42px_-26px_rgba(64,46,40,.32)]"
    >
      {/* Decorative circle */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f8eee9] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#f6ede8] text-[#ab8f83] transition-transform group-hover:scale-[1.04]">
            <Sparkles size={17} strokeWidth={1.6} />
          </div>

          {service.popular && (
            <span className="rounded-full bg-[#f6ede8] px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-wide text-[#a98d81]">
              Popular
            </span>
          )}
        </div>

        <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#c2a99d]">
          {service.category}
        </p>

        <h3 className="mt-2 font-display text-[22px] leading-[1.05] tracking-[-0.02em] text-[#6b5850]">
          {service.name}
        </h3>

        <p className="mt-3 line-clamp-2 min-h-[30px] text-[9px] leading-relaxed text-[#b49b90]">
          {service.description}
        </p>

        {/* Price / duration */}
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#c2a99d]">
              A partir de
            </p>

            <p className="mt-1 font-display text-[24px] tracking-[-0.02em] text-[#8a6f63]">
              R$ {service.price.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#faf6f3] px-3 py-1.5 text-[#a98d81]">
            <Clock3 size={11} />

            <span className="text-[8px] font-bold">{service.duration}</span>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-5 flex items-center justify-between border-t border-[#f3ebe7] pt-4">
          <div className="flex items-center gap-1.5 text-[#b49b90]">
            <CalendarDays size={11} />

            <span className="text-[8px] font-semibold">{service.appointments} agendamentos</span>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#cdb9ae] transition-all group-hover:bg-[#faf4f1] group-hover:text-[#a98d81]">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}

function ServiceStat({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Sparkles;
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
  );
}

function ServiceDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[17px] bg-[#faf6f3] p-3">
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#c2a99d]">{label}</p>

      <p className="mt-1.5 truncate text-[11px] font-semibold text-[#80685e]">{value}</p>
    </div>
  );
}
