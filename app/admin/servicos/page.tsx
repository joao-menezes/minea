'use client';

import { useEffect, useMemo, useState } from 'react';

import { ArrowUpRight, Clock3, Plus, Search, Sparkles, TrendingUp, X } from 'lucide-react';
import { toast } from 'sonner';

import { NewServiceModal } from '@/app/admin/servicos/NewServiceModal';
import { OverviewCard } from '@/app/admin/servicos/OverviewCard';
import { ServiceCard } from '@/app/admin/servicos/ServiceCard';
import { ServiceModal } from '@/app/admin/servicos/ServiceModal';
import { SummaryRow } from '@/app/admin/servicos/SummaryRow';
import { AdminShell } from '@/components/admin/AdminShell';
import { getServices, updateService } from '@/lib/api/services';
import type { Service } from '@/types';
import { formatCurrency } from '@/utils/utils';

import { EmptyState } from './EmptyState';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newServiceOpen, setNewServiceOpen] = useState<boolean>(false);

  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      try {
        setLoading(true);
        setError(null);

        const data = await getServices();

        if (!mounted) return;

        setServices(data);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);

        if (mounted) {
          setError('Não foi possível carregar os serviços.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    if (!normalizedSearch) {
      return services;
    }

    return services.filter((service) => {
      return (
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.description?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [services, search]);

  const activeServices = useMemo(
    () => services.filter((service) => service.active).length,
    [services],
  );

  const inactiveServices = useMemo(
    () => services.filter((service) => !service.active).length,
    [services],
  );

  const averagePrice = useMemo(() => {
    if (!services.length) {
      return 0;
    }

    return (
      services.reduce((total, service) => total + Number(service.price ?? 0), 0) / services.length
    );
  }, [services]);

  const averageDuration = useMemo(() => {
    if (!services.length) {
      return 0;
    }

    return Math.round(
      services.reduce((total, service) => total + Number(service.duration ?? 0), 0) /
        services.length,
    );
  }, [services]);

  async function handleToggleService(service: Service) {
    try {
      setUpdatingServiceId(service.id);

      const updatedService = await updateService(service.id, {
        active: !service.active,
      });

      setServices((current) =>
        current.map((item) => (item.id === updatedService.id ? updatedService : item)),
      );

      if (selectedService?.id === updatedService.id) {
        setSelectedService(updatedService);
      }

      toast.success(
        updatedService.active ? 'Serviço ativado com sucesso!' : 'Serviço desativado com sucesso!',
      );
    } catch (error) {
      console.error('Erro ao alterar status do serviço:', error);

      toast.error(
        error instanceof Error ? error.message : 'Não foi possível alterar o status do serviço.',
      );
    } finally {
      setUpdatingServiceId(null);
    }
  }

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#66534c]">
        <div className="relative mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-10">
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
                Gerencie os procedimentos oferecidos pela sua clínica.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNewServiceOpen(true)}
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

          <section className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <OverviewCard
              label="Serviços ativos"
              value={String(activeServices)}
              description="Disponíveis para agendamento"
              icon={Sparkles}
            />

            <OverviewCard
              label="Total de serviços"
              value={String(services.length)}
              description="Procedimentos cadastrados"
              icon={TrendingUp}
            />

            <OverviewCard
              label="Ticket médio"
              value={formatCurrency(averagePrice)}
              description="Valor médio por serviço"
              icon={Sparkles}
            />

            <OverviewCard
              label="Duração média"
              value={`${averageDuration} min`}
              description={`${inactiveServices} inativos`}
              icon={Clock3}
              accent
            />
          </section>

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
                    Gerencie preços, duração e disponibilidade dos procedimentos.
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
            </div>

            <div className="p-5 sm:p-7 lg:p-8">
              {filteredServices.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => setSelectedService(service)}
                      onToggleActive={handleToggleService}
                      updating={updatingServiceId === service.id}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="relative min-h-[210px] overflow-hidden rounded-[32px] border border-white/50 shadow-[0_25px_60px_-40px_rgba(64,46,40,.4)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,.75),transparent_30%),linear-gradient(135deg,#f7eee9_0%,#ead7cd_52%,#ddc2b5_100%)]" />

              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/50 bg-white/15" />

              <div className="absolute -bottom-24 -left-12 h-52 w-52 rounded-full bg-[#b99484]/10 blur-2xl" />

              <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#a98b80]">
                    Visão geral
                  </p>

                  <h3 className="mt-3 max-w-md font-display text-[30px] leading-tight tracking-[-0.03em] text-[#634f48]">
                    Seu catálogo está pronto para receber clientes.
                  </h3>

                  <p className="mt-3 max-w-md text-[10px] leading-relaxed text-[#a58a80]">
                    {activeServices} de {services.length} serviços estão disponíveis para
                    agendamento.
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-2">
                  <div className="rounded-full border border-white/50 bg-white/35 px-4 py-2 backdrop-blur">
                    <span className="text-[9px] font-bold text-[#8c6d61]">
                      {activeServices} ativos
                    </span>
                  </div>

                  {inactiveServices > 0 && (
                    <div className="rounded-full border border-white/40 bg-white/25 px-4 py-2 backdrop-blur">
                      <span className="text-[9px] font-bold text-[#9c7e72]">
                        {inactiveServices} inativos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/80 p-6 shadow-[0_25px_60px_-40px_rgba(64,46,40,.3)] backdrop-blur-xl">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f2e5df] blur-2xl" />

              <div className="relative">
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#bca095]">
                  Resumo
                </p>

                <h3 className="mt-3 font-display text-[26px] leading-tight text-[#684f47]">
                  Estrutura do catálogo
                </h3>

                <div className="mt-7 space-y-4">
                  <SummaryRow label="Serviços cadastrados" value={String(services.length)} />

                  <SummaryRow label="Serviços ativos" value={String(activeServices)} />

                  <SummaryRow label="Valor médio" value={formatCurrency(averagePrice)} />

                  <SummaryRow label="Duração média" value={`${averageDuration} min`} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSave={async (updatedService) => {
            const savedService = await updateService(updatedService.id, {
              name: updatedService.name,
              price: updatedService.price,
              duration: updatedService.duration,
            });

            setServices((current) =>
              current.map((service) => (service.id === savedService.id ? savedService : service)),
            );
            setSelectedService(savedService);
            toast.success('Serviço atualizado com sucesso!');
          }}
        />

        <NewServiceModal
          open={newServiceOpen}
          onClose={() => setNewServiceOpen(false)}
          onCreated={(service) => {
            setServices((current) => [service, ...current]);
          }}
        />
      </main>
    </AdminShell>
  );
}
