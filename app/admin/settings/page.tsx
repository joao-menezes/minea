'use client';

import { useEffect, useState } from 'react';

import {
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  Globe2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Save,
  Settings2,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AdminShell } from '@/components/admin/AdminShell';
import { signOut } from '@/lib/api/auth';

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

type SettingsSectionId =
  'clinica' | 'agenda' | 'notificacoes' | 'privacidade' | 'conta' | 'preferencias';

type SettingsNavigationItem = {
  id: SettingsSectionId;
  label: string;
  icon: LucideIcon;
};

const SETTINGS_NAVIGATION: SettingsNavigationItem[] = [
  {
    id: 'clinica',
    label: 'Clínica',
    icon: Building2,
  },
  {
    id: 'agenda',
    label: 'Agenda',
    icon: CalendarClock,
  },
  {
    id: 'notificacoes',
    label: 'Notificações',
    icon: Bell,
  },
  {
    id: 'privacidade',
    label: 'Privacidade',
    icon: ShieldCheck,
  },
  {
    id: 'conta',
    label: 'Minha conta',
    icon: UserRound,
  },
  {
    id: 'preferencias',
    label: 'Preferências',
    icon: Settings2,
  },
];

const SCHEDULE = [
  { day: 'Segunda-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Terça-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Quarta-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Quinta-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Sexta-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Sábado', enabled: true, start: '08:00', end: '13:00' },
  { day: 'Domingo', enabled: false, start: '—', end: '—' },
];

const SETTINGS_STORAGE_KEY = 'minea_admin_settings';

type ClinicSettings = {
  clinicName: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  showAddress: boolean;
  schedule: typeof SCHEDULE;
  notifications: boolean;
  reminders: boolean;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  autoConfirm: boolean;
  language: string;
  appearance: string;
};

const DEFAULT_SETTINGS: ClinicSettings = {
  clinicName: 'Minea',
  phone: '(19) 99999-9999',
  email: 'contato@minea.com.br',
  instagram: '@minea.estetica',
  address: 'Rua das Flores, 120 — Centro',
  showAddress: true,
  schedule: SCHEDULE,
  notifications: true,
  reminders: true,
  emailNotifications: false,
  whatsappNotifications: true,
  autoConfirm: false,
  language: 'Português (Brasil)',
  appearance: 'Automática',
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('clinica');

  const [settings, setSettings] = useState<ClinicSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!storedSettings) return;

    try {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
    } catch {
      window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-settings-section]'));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

        const current = visibleSections[0];

        if (!current) return;

        const id = current.target.getAttribute('data-settings-section') as SettingsSectionId | null;

        if (id) {
          setActiveSection(id);
        }
      },
      {
        /*
         * A região considerada "ativa" começa abaixo do header
         * e termina aproximadamente no meio da tela.
         */
        rootMargin: '-110px 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: SettingsSectionId) {
    const section = document.querySelector<HTMLElement>(`[data-settings-section="${id}"]`);

    if (!section) return;

    setActiveSection(id);

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  useEffect(() => {
    function scrollToHashSection() {
      const requestedSection = window.location.hash.slice(1) as SettingsSectionId;

      if (!requestedSection || !SETTINGS_NAVIGATION.some((item) => item.id === requestedSection)) {
        return;
      }

      window.setTimeout(() => scrollToSection(requestedSection), 0);
    }

    scrollToHashSection();
    window.addEventListener('hashchange', scrollToHashSection);

    return () => window.removeEventListener('hashchange', scrollToHashSection);
  }, []);

  function handleSave() {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  }

  function updateSetting<K extends keyof ClinicSettings>(key: K, value: ClinicSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function updateSchedule(
    index: number,
    values: Partial<(typeof SCHEDULE)[number]>,
  ) {
    setSettings((current) => ({
      ...current,
      schedule: current.schedule.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...values } : item,
      ),
    }));
  }

  async function handleLogout() {
    await signOut();
    router.push('/admin/login');
  }

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        <SettingsBackground />

        <div className="relative mx-auto max-w-[1200px] px-4 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-9">
          <SettingsHeader saved={saved} onSave={handleSave} />

          <div className="mt-5 lg:mt-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-5">
            <SettingsSidebar activeSection={activeSection} onNavigate={scrollToSection} />

            <div className="min-w-0 space-y-4 sm:space-y-5">
              <section data-settings-section="clinica" className="scroll-mt-24">
                <SettingsSection
                  eyebrow="Informações"
                  title="Sua clínica"
                  description="Essas informações aparecem para seus clientes durante o agendamento."
                  icon={Building2}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      label="Nome da clínica"
                      value={settings.clinicName}
                      onChange={(value) => updateSetting('clinicName', value)}
                    />

                    <InputField
                      label="Telefone"
                      value={settings.phone}
                      onChange={(value) => updateSetting('phone', value)}
                    />

                    <InputField
                      label="E-mail"
                      value={settings.email}
                      type="email"
                      onChange={(value) => updateSetting('email', value)}
                    />

                    <InputField
                      label="Instagram"
                      value={settings.instagram}
                      onChange={(value) => updateSetting('instagram', value)}
                    />
                  </div>

                  <div className="mt-4">
                    <InputField
                      label="Endereço"
                      value={settings.address}
                      onChange={(value) => updateSetting('address', value)}
                    />
                  </div>

                  <div className="mt-4">
                    <SettingRow
                      icon={MapPin}
                      title="Mostrar endereço para clientes"
                      description="Permite que o cliente veja como chegar até a clínica."
                      checked={settings.showAddress}
                      onChange={(value) => updateSetting('showAddress', value)}
                    />
                  </div>
                </SettingsSection>
              </section>

              <section
                data-settings-section="agenda"
                className="scroll-mt-24 space-y-4 sm:space-y-5"
              >
                <SettingsSection
                  eyebrow="Funcionamento"
                  title="Horários de atendimento"
                  description="Defina quando sua clínica está disponível para novos agendamentos."
                  icon={Clock3}
                >
                  <div className="space-y-2">
                    {settings.schedule.map((schedule, index) => (
                      <ScheduleRow
                        key={schedule.day}
                        {...schedule}
                        onToggle={(enabled) => updateSchedule(index, { enabled })}
                        onTimeChange={(field, value) => updateSchedule(index, { [field]: value })}
                      />
                    ))}
                  </div>
                </SettingsSection>

                <SettingsSection
                  eyebrow="Agendamentos"
                  title="Preferências da agenda"
                  description="Controle como novos horários são recebidos e confirmados."
                  icon={CalendarClock}
                >
                  <div className="divide-y divide-[#f1e8e2]">
                    <SettingRow
                      icon={CalendarClock}
                      title="Confirmação automática"
                      description="Novos agendamentos são confirmados automaticamente."
                      checked={settings.autoConfirm}
                      onChange={(value) => updateSetting('autoConfirm', value)}
                    />

                    <SettingRow
                      icon={Clock3}
                      title="Lembrete de atendimento"
                      description="Enviar lembrete antes do horário agendado."
                      checked={settings.reminders}
                      onChange={(value) => updateSetting('reminders', value)}
                    />
                  </div>
                </SettingsSection>
              </section>

              <section data-settings-section="notificacoes" className="scroll-mt-24">
                <SettingsSection
                  eyebrow="Comunicação"
                  title="Notificações"
                  description="Escolha como você e seus clientes recebem atualizações."
                  icon={Bell}
                >
                  <div className="divide-y divide-[#f1e8e2]">
                    <SettingRow
                      icon={Bell}
                      title="Notificações da agenda"
                      description="Receber avisos quando um novo agendamento for criado."
                      checked={settings.notifications}
                      onChange={(value) => updateSetting('notifications', value)}
                    />

                    <SettingRow
                      icon={Smartphone}
                      title="WhatsApp"
                      description="Enviar confirmações e lembretes pelo WhatsApp."
                      checked={settings.whatsappNotifications}
                      onChange={(value) => updateSetting('whatsappNotifications', value)}
                    />

                    <SettingRow
                      icon={Mail}
                      title="E-mail"
                      description="Receber atualizações e relatórios por e-mail."
                      checked={settings.emailNotifications}
                      onChange={(value) => updateSetting('emailNotifications', value)}
                    />
                  </div>
                </SettingsSection>
              </section>

              <section data-settings-section="privacidade" className="scroll-mt-24">
                <SettingsSection
                  eyebrow="Segurança"
                  title="Privacidade"
                  description="Controle quais informações da sua clínica ficam visíveis para seus clientes."
                  icon={ShieldCheck}
                >
                  <div className="divide-y divide-[#f1e8e2]">
                    <SettingRow
                      icon={MapPin}
                      title="Mostrar endereço"
                      description="Permitir que clientes visualizem o endereço da clínica."
                      checked={settings.showAddress}
                      onChange={(value) => updateSetting('showAddress', value)}
                    />

                    <SettingRow
                      icon={Lock}
                      title="Dados protegidos"
                      description="Informações administrativas ficam disponíveis somente para sua equipe."
                      checked
                      onChange={() => undefined}
                    />
                  </div>
                </SettingsSection>
              </section>

              <section id="conta" data-settings-section="conta" className="scroll-mt-24">
                <SettingsSection
                  eyebrow="Conta"
                  title="Minha conta"
                  description="Informações do administrador responsável pela clínica."
                  icon={UserRound}
                >
                  <AccountContent />
                </SettingsSection>
              </section>

              <section data-settings-section="preferencias" className="scroll-mt-24">
                <SettingsSection
                  eyebrow="Sistema"
                  title="Preferências"
                  description="Algumas preferências gerais da plataforma."
                  icon={Settings2}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PreferenceCard
                      icon={Globe2}
                      label="Idioma"
                      value={settings.language}
                      onClick={() =>
                        updateSetting(
                          'language',
                          settings.language === 'Português (Brasil)' ? 'English' : 'Português (Brasil)',
                        )
                      }
                    />

                    <PreferenceCard
                      icon={Moon}
                      label="Aparência"
                      value={settings.appearance}
                      onClick={() =>
                        updateSetting(
                          'appearance',
                          settings.appearance === 'Automática' ? 'Clara' : 'Automática',
                        )
                      }
                    />
                  </div>
                </SettingsSection>
              </section>

              <DangerZone onLogout={handleLogout} />

              <SettingsFooter />
            </div>
          </div>
        </div>
      </main>
    </AdminShell>
  );
}

function SettingsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-20 -top-40 h-72 w-72 rounded-full bg-[#f0e0d7]/45 blur-3xl sm:h-96 sm:w-96" />

      <div className="absolute -left-40 top-[42%] h-72 w-72 rounded-full bg-[#f4ede6]/60 blur-3xl sm:h-96 sm:w-96" />

      <div className="absolute bottom-0 right-[15%] h-64 w-64 rounded-full bg-[#e9d9d0]/25 blur-3xl sm:h-80 sm:w-80" />
    </div>
  );
}

function SettingsHeader({ saved, onSave }: { saved: boolean; onSave: () => void }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#c2a99d] sm:text-[9px]">
            Minea
          </span>

          <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

          <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#cdb9ae] sm:text-[9px]">
            Configurações
          </span>
        </div>

        <h1 className="mt-3 font-display text-[32px] leading-none tracking-[-0.035em] text-[#6b5850] sm:text-[36px] lg:text-[42px]">
          Configurações
        </h1>

        <p className="mt-3 max-w-xl text-[11px] leading-relaxed text-[#a48a7f] sm:text-xs">
          Personalize a experiência da sua clínica e defina como sua agenda funciona.
        </p>
      </div>

      <button
        type="button"
        onClick={onSave}
        className={[
          'flex h-11 w-full items-center justify-center gap-2 rounded-[15px] px-5 text-[10px] font-bold text-white sm:w-auto',
          'shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all',
          saved ? 'bg-[#718678]' : 'bg-[#8a6f63] hover:-translate-y-0.5 hover:bg-[#7c6156]',
        ].join(' ')}
      >
        {saved ? (
          <>
            <Check size={14} />
            Alterações salvas
          </>
        ) : (
          <>
            <Save size={14} />
            Salvar alterações
          </>
        )}
      </button>
    </header>
  );
}

function SettingsSidebar({
  activeSection,
  onNavigate,
}: {
  activeSection: SettingsSectionId;
  onNavigate: (id: SettingsSectionId) => void;
}) {
  return (
    <aside
      className={[
        'z-40 mb-4',
        'sticky top-2',
        'rounded-[20px] border border-white/70 bg-white/90 p-1.5',
        'shadow-[0_18px_45px_-30px_rgba(64,46,40,.3)] backdrop-blur-xl',
        'lg:sticky lg:top-6 lg:mb-0 lg:h-fit lg:rounded-[26px] lg:p-2',
      ].join(' ')}
    >
      <nav className="scrollbar-none flex gap-1 overflow-x-auto overscroll-x-contain lg:flex-col lg:overflow-visible">
        {SETTINGS_NAVIGATION.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="shrink-0 lg:w-full">
              {index === 5 && <div className="my-2 hidden h-px bg-[#f1e8e2] lg:block" />}

              <SettingsNav
                icon={Icon}
                label={item.label}
                active={activeSection === item.id}
                onClick={() => onNavigate(item.id)}
              />
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function SettingsNav({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={[
        'group flex h-10 shrink-0 items-center gap-2.5 rounded-[13px] px-3',
        'whitespace-nowrap text-[9px] font-semibold',
        'transition-all duration-200',
        'lg:w-full lg:gap-3 lg:text-left',
        active
          ? 'bg-[#f3eae5] text-[#6b5850]'
          : 'text-[#a28b81] hover:bg-[#faf4f1] hover:text-[#80685e]',
      ].join(' ')}
    >
      <Icon size={14} strokeWidth={active ? 2 : 1.7} className="shrink-0" />

      <span>{label}</span>

      <ChevronRight
        size={13}
        className={[
          'ml-auto hidden transition-all duration-200 lg:block',
          active
            ? 'translate-x-0 text-[#b49b90] opacity-100'
            : '-translate-x-1 text-[#c7b5ad] opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
        ].join(' ')}
      />
    </button>
  );
}

function SettingsSection({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur sm:rounded-[30px] sm:p-5 lg:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#f6ede8] text-[#ab8f83]">
          <Icon size={16} strokeWidth={1.7} />
        </div>

        <div className="min-w-0">
          <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
            {eyebrow}
          </p>

          <h2 className="mt-1 font-display text-[23px] leading-none tracking-[-0.02em] text-[#6b5850] sm:text-[25px]">
            {title}
          </h2>

          <p className="mt-2 max-w-xl text-[9px] leading-relaxed text-[#b49b90] sm:text-[10px]">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 sm:mt-6">{children}</div>
    </div>
  );
}

function AccountContent() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#c9afa5] text-sm font-bold text-white shadow-[0_12px_25px_-15px_rgba(100,70,60,.4)]">
        RE
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-[#6b5850]">Rebeca</p>

        <p className="mt-1 text-[10px] text-[#a48a7f]">Administradora da Minea</p>

        <p className="mt-2 text-[9px] text-[#b49b90]">contato@minea.com.br</p>
      </div>

      <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-[#eee3dd] bg-white px-4 text-[9px] font-bold text-[#8a6f63] transition hover:bg-[#faf4f1] sm:w-auto"
      >
        <Lock size={13} />
        Alterar senha
      </button>
    </div>
  );
}

function InputField({
  label,
  value,
  type = 'text',
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#b09a91]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[14px] border border-[#eee4df] bg-[#fffdfc] px-4 text-[10px] font-medium text-[#80685e] outline-none transition placeholder:text-[#c5b4ac] focus:border-[#d5beb4] focus:ring-2 focus:ring-[#f4ebe7]"
      />
    </label>
  );
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-6 w-10 shrink-0 rounded-full p-0.5 transition-all',
        checked ? 'bg-[#8a6f63]' : 'bg-[#ded3ce]',
      ].join(' ')}
    >
      <span
        className={[
          'block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#f6ede8] text-[#ab8f83]">
        <Icon size={14} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-[#80685e]">{title}</p>

        <p className="mt-1 text-[9px] leading-relaxed text-[#b49b90]">{description}</p>
      </div>

      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function ScheduleRow({
  day,
  enabled,
  start,
  end,
  onToggle,
  onTimeChange,
}: {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
  onToggle: (enabled: boolean) => void;
  onTimeChange: (field: 'start' | 'end', value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[17px] bg-[#faf6f3] px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={`Ativar ${day}`}
          onClick={() => onToggle(!enabled)}
          className={[
            'h-2 w-2 shrink-0 rounded-full transition-colors',
            enabled ? 'bg-[#91a695]' : 'bg-[#d4c6bf]',
          ].join(' ')}
        />

        <span className="text-[10px] font-semibold text-[#80685e]">{day}</span>
      </div>

      <div className="flex items-center gap-2">
        <TimeInput
          value={start}
          disabled={!enabled}
          onChange={(value) => onTimeChange('start', value)}
        />

        <span className="text-[9px] text-[#c0aaa0]">até</span>

        <TimeInput
          value={end}
          disabled={!enabled}
          onChange={(value) => onTimeChange('end', value)}
        />
      </div>
    </div>
  );
}

function TimeInput({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="time"
      value={value === '—' ? '' : value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="h-9 rounded-[11px] border border-[#eee4df] bg-white px-2 text-[9px] font-semibold text-[#80685e] outline-none disabled:bg-[#f3eeeb] disabled:text-[#c4b5ae]"
    />
  );
}

function PreferenceCard({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-[18px] border border-[#eee5df] bg-[#fffdfc] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#e2d3cc] hover:bg-[#fffaf8]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#f6ede8] text-[#ab8f83]">
        <Icon size={14} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#b09a91]">{label}</p>

        <p className="mt-1 truncate text-[10px] font-semibold text-[#80685e]">{value}</p>
      </div>

      <ChevronRight
        size={14}
        className="shrink-0 text-[#c7b5ad] transition-transform group-hover:translate-x-0.5"
      />
    </button>
  );
}

function DangerZone({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="rounded-[24px] border border-[#eadbd4] bg-[#fffaf8] p-4 shadow-[0_18px_40px_-30px_rgba(64,46,40,.2)] sm:rounded-[28px] sm:p-5 lg:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c2a99d]">Sessão</p>

          <h2 className="mt-2 font-display text-[23px] tracking-[-0.02em] text-[#6b5850] sm:text-[25px]">
            Encerrar sessão
          </h2>

          <p className="mt-1 max-w-md text-[9px] leading-relaxed text-[#b49b90]">
            Saia da conta administrativa neste dispositivo.
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-[#eadbd4] bg-white px-4 text-[9px] font-bold text-[#9a7669] transition hover:bg-[#faf1ed] sm:w-auto"
        >
          <LogOut size={13} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function SettingsFooter() {
  return (
    <footer className="flex items-center justify-between px-1 pb-5 pt-1">
      <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#c4b2aa]">
        Minea Administração
      </p>

      <p className="text-[8px] text-[#c4b2aa]">Versão 1.0.0</p>
    </footer>
  );
}
