'use client';

import { useMemo, useState } from 'react';

import {
  ArrowUpRight,
  CalendarDays,
  Check,
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
import { Service } from '@/types';

type AdminServicesPageProps = {
  services: Service[];
};

export default function AdminServicesPage({ services }: AdminServicesPageProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(services.map((service) => service.category)));

    return ['Todos', ...uniqueCategories];
  }, [services]);

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory = category === 'Todos' || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  const activeServices = useMemo(
    () => services.filter((service) => service.active).length,
    [services],
  );

  const totalAppointments = useMemo(
    () => services.reduce((total, service) => total + service.appointments, 0),
    [services],
  );

  const averagePrice = useMemo(() => {
    if (!services.length) return 0;

    return services.reduce((total, service) => total + service.price, 0) / services.length;
  }, [services]);

  const mostPopular = useMemo(() => {
    if (!services.length) return null;

    return [...services].sort((a, b) => b.appointments - a.appointments)[0];
  }, [services]);

  const totalClients = useMemo(
    () => services.reduce((total, service) => total + service.clients, 0),
    [services],
  );

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#66534c]">
        {/* =========================================================
            AMBIENT BACKGROUND
        ========================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#ead7cd]/45 blur-3xl" />

          <div className="absolute -left-48 top-[35%] h-[480px] w-[480px] rounded-full bg-[#f2e8e1]/70 blur-3xl" />

          <div className="absolute bottom-[-180px] right-[18%] h-[430px] w-[430px] rounded-full bg-[#e6d2c8]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-10">
          {/* =======================================================
              HEADER
          ======================================================== */}

          <section className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#b99a8e]">
                  Minea
                </span>

                <span className="h-1 w-1 rounded-full bg-[#d5b9ad]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#c8afa4]">
                  Gestão & Bem-estar
                </span>
              </div>

              <h1 className="mt-3 font-display text-[36px] leading-none tracking-[-0.035em] text-[#604d46] sm:text-[42px]">
                Serviços
              </h1>

              <p className="mt-3 max-w-lg text-[11px] leading-relaxed text-[#a58b81]">
                Cuide do seu catálogo com a mesma atenção aos detalhes que você oferece às suas
                clientes.
              </p>
            </div>

            <button
              type="button"
              className="group flex h-[52px] items-center justify-between gap-5 rounded-[18px] bg-[#3f332f] px-4 text-[11px] font-bold text-white shadow-[0_20px_40px_-22px_rgba(45,32,27,.7)] transition-all hover:-translate-y-0.5 hover:bg-[#332925] active:scale-[.985]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/10">
                  <Plus size={15} strokeWidth={1.8} />
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

          {/* =======================================================
              OVERVIEW
          ======================================================== */}

          <section className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <OverviewCard
              label="Serviços ativos"
              value={String(activeServices)}
              description="Disponíveis para agendamento"
              icon={Sparkles}
            />

            <OverviewCard
              label="Agendamentos"
              value={String(totalAppointments)}
              description="Realizados neste mês"
              icon={CalendarDays}
            />

            <OverviewCard
              label="Ticket médio"
              value={`R$ ${averagePrice.toFixed(0)}`}
              description="Valor médio por serviço"
              icon={Tag}
            />

            <OverviewCard
              label="Mais procurado"
              value={mostPopular?.name ?? '—'}
              description={
                mostPopular ? `${mostPopular.appointments} agendamentos` : 'Nenhum serviço'
              }
              icon={TrendingUp}
              accent
            />
          </section>

          {/* =======================================================
              MAIN CATALOG
          ======================================================== */}

          <section className="mt-8 overflow-hidden rounded-[32px] border border-white/80 bg-white/80 shadow-[0_28px_70px_-45px_rgba(64,46,40,.38)] backdrop-blur-xl">
            <div className="border-b border-[#f1e7e2] px-5 py-6 sm:px-7 lg:px-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#bda096]">
                    Catálogo
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <h2 className="font-display text-[29px] leading-none tracking-[-0.025em] text-[#634f48]">
                      Seus serviços
                    </h2>

                    <span className="rounded-full bg-[#f4ebe7] px-2.5 py-1 text-[9px] font-bold text-[#a98b80]">
                      {filteredServices.length}
                    </span>
                  </div>

                  <p className="mt-3 text-[10px] text-[#ad958b]">
                    Gerencie preços, duração e desempenho dos procedimentos.
                  </p>
                </div>

                <div className="relative w-full xl:max-w-[320px]">
                  <Search
                    size={15}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bca399]"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar serviço..."
                    className="h-12 w-full rounded-[16px] border border-[#eee4df] bg-[#faf6f3] pl-11 pr-10 text-[11px] font-medium text-[#66534c] outline-none transition-all placeholder:text-[#c4afa6] focus:border-[#d7c0b5] focus:bg-white focus:shadow-[0_10px_30px_-25px_rgba(80,55,45,.5)]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#bca399] transition hover:bg-[#f1e6e1] hover:text-[#80665c]"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}

              <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => {
                  const active = category === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={[
                        'shrink-0 rounded-full px-4 py-2 text-[9px] font-bold transition-all',
                        active
                          ? 'bg-[#80665c] text-white shadow-[0_10px_22px_-15px_rgba(80,55,45,.7)]'
                          : 'border border-[#eee5df] bg-[#faf6f3] text-[#ae958b] hover:border-[#dfd0c9] hover:bg-white',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Services */}

            <div className="p-5 sm:p-7 lg:p-8">
              {filteredServices.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => setSelectedService(service)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </section>

          {/* =======================================================
              FEATURED
          ======================================================== */}

          {mostPopular && (
            <section className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_.75fr]">
              <div className="relative min-h-[225px] overflow-hidden rounded-[32px] border border-white/50 shadow-[0_25px_60px_-40px_rgba(64,46,40,.4)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,.75),transparent_30%),linear-gradient(135deg,#f7eee9_0%,#ead7cd_52%,#ddc2b5_100%)]" />

                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/50 bg-white/15" />

                <div className="absolute -bottom-24 -left-12 h-52 w-52 rounded-full bg-[#b99484]/10 blur-2xl" />

                <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#a98b80]">
                        Destaque do mês
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/30 px-3 py-1.5 backdrop-blur">
                        <TrendingUp size={11} className="text-[#97786c]" />

                        <span className="text-[8px] font-bold text-[#8e7064]">Mais procurado</span>
                      </div>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#947568] backdrop-blur">
                      <Sparkles size={15} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-display text-[31px] leading-none tracking-[-0.03em] text-[#634f48]">
                        {mostPopular.name}
                      </p>

                      <p className="mt-3 text-[10px] text-[#a58a80]">
                        {mostPopular.appointments} agendamentos neste mês
                      </p>
                    </div>

                    <div className="rounded-full border border-white/40 bg-white/35 px-4 py-2 backdrop-blur">
                      <span className="text-[9px] font-bold text-[#8c6d61]">+18,4%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick insight */}

              <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/80 p-6 shadow-[0_25px_60px_-40px_rgba(64,46,40,.3)] backdrop-blur-xl">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f2e5df] blur-2xl" />

                <div className="relative">
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#bca095]">
                    Visão rápida
                  </p>

                  <h3 className="mt-3 font-display text-[24px] leading-tight text-[#684f47]">
                    Seu catálogo
                    <br />
                    está saudável.
                  </h3>

                  <p className="mt-3 text-[9px] leading-relaxed text-[#ad9489]">
                    Os procedimentos mais procurados estão concentrados em serviços de sobrancelhas.
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-[#f0e5e0] pt-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f5ebe7] text-[#9e8074]">
                      <Users size={14} strokeWidth={1.6} />
                    </div>

                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#bca095]">
                        Clientes atendidas
                      </p>

                      <p className="mt-1 text-[11px] font-bold text-[#765e55]">{totalClients}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* =========================================================
            SERVICE MODAL
        ========================================================== */}

        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#332925]/35 p-0 backdrop-blur-[7px] sm:items-center sm:p-5">
            <div className="relative w-full max-w-lg overflow-hidden rounded-t-[34px] border border-white/80 bg-[#faf6f3] shadow-[0_35px_100px_-35px_rgba(40,29,25,.7)] sm:rounded-[34px]">
              <div className="absolute left-1/2 top-3 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-white/70 sm:hidden" />

              <div className="relative overflow-hidden bg-[#ead8cf] px-6 pb-7 pt-8">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/40 bg-white/15" />

                <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-[#c5a394]/15 blur-xl" />

                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#947568] backdrop-blur transition hover:bg-white/50"
                >
                  <X size={14} />
                </button>

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/60 bg-white/35 text-[#96776b] backdrop-blur">
                    <Sparkles size={21} strokeWidth={1.5} />
                  </div>

                  <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.28em] text-[#a78a7f]">
                    {selectedService.category}
                  </p>

                  <h2 className="mt-2 max-w-[350px] font-display text-[31px] leading-[1.02] tracking-[-0.03em] text-[#634f48]">
                    {selectedService.name}
                  </h2>

                  {selectedService.popular && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/35 px-3 py-1.5 backdrop-blur">
                      <TrendingUp size={10} />

                      <span className="text-[8px] font-bold text-[#8d7064]">Mais procurado</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <p className="text-[11px] leading-relaxed text-[#a58c82]">
                  {selectedService.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
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

                <div className="mt-4 flex items-center justify-between rounded-[18px] border border-[#eee3de] bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#edf4ed] text-[#77917b]">
                      <Check size={14} strokeWidth={2} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold text-[#80685e]">
                        {selectedService.active ? 'Serviço ativo' : 'Serviço inativo'}
                      </p>

                      <p className="mt-0.5 text-[8px] text-[#b39b91]">
                        {selectedService.active
                          ? 'Disponível para agendamento'
                          : 'Não disponível para agendamento'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#3f332f] text-[10px] font-bold text-white shadow-[0_15px_30px_-18px_rgba(45,32,27,.7)] transition hover:bg-[#332925]"
                  >
                    <Edit3 size={14} />
                    Editar serviço
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#eaded8] bg-white text-[#a98c82] transition hover:bg-[#faf5f2]"
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
      className="group relative overflow-hidden rounded-[26px] border border-[#eee5df] bg-white p-5 text-left shadow-[0_18px_38px_-30px_rgba(64,46,40,.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[#e4d4cc] hover:shadow-[0_26px_50px_-30px_rgba(64,46,40,.38)]"
    >
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#f7eee9] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-[17px] bg-[#f5ebe7] text-[#a88a7e] transition-transform duration-300 group-hover:scale-105">
            <Sparkles size={17} strokeWidth={1.5} />
          </div>

          {service.popular && (
            <span className="rounded-full border border-[#eadbd4] bg-[#faf4f1] px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-[#a18478]">
              Popular
            </span>
          )}
        </div>

        <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.22em] text-[#bea096]">
          {service.category}
        </p>

        <h3 className="mt-2 font-display text-[23px] leading-[1.04] tracking-[-0.025em] text-[#624e47]">
          {service.name}
        </h3>

        <p className="mt-3 line-clamp-2 min-h-[31px] text-[9px] leading-relaxed text-[#ae958b]">
          {service.description}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#c1a69b]">Valor</p>

            <p className="mt-1 font-display text-[25px] tracking-[-0.025em] text-[#80665c]">
              R$ {service.price.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#faf6f3] px-3 py-1.5 text-[#a98c81]">
            <Clock3 size={11} strokeWidth={1.7} />

            <span className="text-[8px] font-bold">{service.duration}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#f1e8e3] pt-4">
          <div className="flex items-center gap-1.5 text-[#b29a90]">
            <CalendarDays size={11} strokeWidth={1.6} />

            <span className="text-[8px] font-semibold">{service.appointments} agendamentos</span>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#c8b0a6] transition-all group-hover:bg-[#faf4f1] group-hover:text-[#97786c]">
            <ArrowUpRight size={14} strokeWidth={1.7} />
          </span>
        </div>
      </div>
    </button>
  );
}

function OverviewCard({
  label,
  value,
  description,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Sparkles;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-[26px] border p-4 shadow-[0_20px_45px_-32px_rgba(64,46,40,.3)] backdrop-blur transition-all hover:-translate-y-0.5 lg:p-5',
        accent ? 'border-[#eadbd4] bg-[#f5ebe6]' : 'border-white/80 bg-white/80',
      ].join(' ')}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f4e9e3]/50 blur-xl" />

      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f5ebe7] text-[#a88a7e] transition-transform group-hover:scale-105">
          <Icon size={16} strokeWidth={1.6} />
        </div>

        <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#bea398]">
          {label}
        </p>

        <p className="mt-1 truncate font-display text-[27px] tracking-[-0.025em] text-[#624f48]">
          {value}
        </p>

        <p className="mt-1 text-[9px] text-[#b1998f]">{description}</p>
      </div>
    </div>
  );
}

function ServiceDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#eee4df] bg-[#faf6f3] p-3.5">
      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#bda095]">{label}</p>

      <p className="mt-1.5 truncate text-[11px] font-semibold text-[#80685e]">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f5ebe7] text-[#aa8b80]">
        <Search size={20} strokeWidth={1.5} />
      </div>

      <p className="mt-5 font-display text-[24px] text-[#80665c]">Nenhum serviço encontrado</p>

      <p className="mx-auto mt-2 max-w-xs text-[10px] leading-relaxed text-[#b39a90]">
        Não encontramos procedimentos para os filtros selecionados. Experimente outra busca ou
        categoria.
      </p>
    </div>
  );
}
