export const CLINIC = {
  name: 'Clínica Gisele Andrade Estética Avançada',
  latitude: -22.94522006285037,
  longitude: -47.05477068275846,
};

export function getMapEmbedUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
}

export function getMapDirectionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
