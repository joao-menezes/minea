export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function getWhatsAppUrl(phone: string, message = '') {
  const digits = phone.replace(/\D/g, '');
  const formattedPhone = digits.startsWith('55') ? digits : `55${digits}`;

  const query = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : '';

  return `https://wa.me/${formattedPhone}${query}`;
}

export function openWhatsApp(phone: string, message = '') {
  window.open(getWhatsAppUrl(phone, message), '_blank', 'noopener,noreferrer');
}

export function getAppointmentParts(appointment?: string) {
  if (!appointment) {
    return {
      date: null,
      time: null,
    };
  }

  const [date, time] = appointment.split(' · ');

  return {
    date,
    time,
  };
}
