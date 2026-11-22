export interface ServicioItem {
  id: number;
  nombre: string;
  categoria: string;
  tipoEntidad: 'Servicio' | 'Atractivo';
  operador: string | null;
  descripcion: string;
  tarifa: string;
  horario: string;
  direccion: string;
  mapaUrl: string;
  whatsapp: string | null;
  fechaVerificacion: string;
}

export const CATEGORIAS_DISPONIBLES = [
  'Todas',
  'Aventura',
  'Hospedaje',
  'Gastronomía',
  'Atractivos',
  'Eventos Culturales',
];

export const DATOS_RESPALDO: ServicioItem[] = [
  {
    id: 1,
    nombre: 'Descenso Rafting Río Ariari',
    categoria: 'Aventura',
    tipoEntidad: 'Servicio',
    operador: 'Ariari Extremo Rafting',
    descripcion: 'Recorrido guiado de 7 km por el cañón del río Ariari con equipo certificado y póliza.',
    tarifa: '$85.000 COP / persona',
    horario: '8:00 a.m. - 4:00 p.m.',
    direccion: 'Vereda Puerto Ariari, Cubarral',
    mapaUrl: 'https://maps.google.com/?q=3.7936,-73.8419',
    whatsapp: '573118851101',
    fechaVerificacion: '2026-11-10',
  },
  {
    id: 2,
    nombre: 'Alojamiento Reserva Aguas Claras',
    categoria: 'Hospedaje',
    tipoEntidad: 'Servicio',
    operador: 'Finca Ecoturística Aguas Claras',
    descripcion: 'Cabañas ecológicas rodeadas de bosque nativo con desayuno campesino y sendero hídrico.',
    tarifa: '$140.000 COP / noche',
    horario: 'Check-in 2:00 p.m. - Check-out 12:00 m.',
    direccion: 'Vía Aguas Claras Km 4, Cubarral',
    mapaUrl: 'https://maps.google.com/?q=3.8012,-73.8520',
    whatsapp: '573118851102',
    fechaVerificacion: '2026-11-10',
  },
  {
    id: 3,
    nombre: 'Posada Rural El Piedemonte',
    categoria: 'Hospedaje',
    tipoEntidad: 'Servicio',
    operador: 'Posada Rural El Piedemonte',
    descripcion: 'Hospedaje familiar con zona de camping y acceso directo a quebrada natural.',
    tarifa: '$95.000 COP / noche',
    horario: 'Atención 24 horas',
    direccion: 'Vereda La Libertad, Cubarral',
    mapaUrl: 'https://maps.google.com/?q=3.7890,-73.8390',
    whatsapp: '573118851103',
    fechaVerificacion: '2026-11-11',
  },
  {
    id: 4,
    nombre: 'Gastronomía Típica El Ariari',
    categoria: 'Gastronomía',
    tipoEntidad: 'Servicio',
    operador: 'Asadero y Parrilla Llanera El Ariari',
    descripcion: 'Carne a la llanera, sancocho de gallina criolla y platos tradicionales de la región.',
    tarifa: '$28.000 - $45.000 COP',
    horario: '11:00 a.m. - 6:00 p.m.',
    direccion: 'Parque Principal, Cubarral',
    mapaUrl: 'https://maps.google.com/?q=3.7945,-73.8405',
    whatsapp: '573118851104',
    fechaVerificacion: '2026-11-11',
  },
  {
    id: 5,
    nombre: 'Avistamiento de Aves Las Palmeras',
    categoria: 'Aventura',
    tipoEntidad: 'Servicio',
    operador: 'Senderos y Aves Las Palmeras',
    descripcion: 'Caminata interpretativa de observación de avifauna endémica del piedemonte llanero.',
    tarifa: '$60.000 COP / persona',
    horario: '5:30 a.m. - 11:00 a.m.',
    direccion: 'Reserva Las Palmeras, Cubarral',
    mapaUrl: 'https://maps.google.com/?q=3.8050,-73.8480',
    whatsapp: '573118851105',
    fechaVerificacion: '2026-11-12',
  },
  {
    id: 6,
    nombre: 'Cascada La Esmeralda',
    categoria: 'Atractivos',
    tipoEntidad: 'Atractivo',
    operador: null,
    descripcion: 'Atractivo natural público de aguas cristalinas ideal para senderismo ecológico y fotografía.',
    tarifa: 'Entrada libre / Guía opcional $30.000',
    horario: '7:00 a.m. - 4:30 p.m.',
    direccion: 'Sector La Esmeralda, Cubarral',
    mapaUrl: 'https://maps.google.com/?q=3.8120,-73.8610',
    whatsapp: null,
    fechaVerificacion: '2026-11-12',
  },
];

export function filtrarCatalogo(
  items: ServicioItem[],
  categoria: string,
  busqueda: string
): ServicioItem[] {
  const q = busqueda.trim().toLowerCase();
  return items.filter((item) => {
    const coincideCat = !categoria || categoria === 'Todas' || item.categoria === categoria;
    const coincideTexto =
      !q ||
      item.nombre.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q) ||
      item.direccion.toLowerCase().includes(q);
    return coincideCat && coincideTexto;
  });
}

export function generarEnlaceWhatsApp(whatsapp: string | null, tituloServicio: string): string | null {
  if (!whatsapp) return null;
  const limpio = whatsapp.replace(/\D/g, '');
  if (limpio.length < 10) return null;
  const mensaje = encodeURIComponent(
    'Hola, vi el servicio "' + tituloServicio + '" en el Directorio Ecoturístico de Cubarral y deseo más información.'
  );
  return 'https://wa.me/' + limpio + '?text=' + mensaje;
}

export function calcularPuntajeSUS(respuestas: number[]): number {
  if (respuestas.length !== 10) return 0;
  let suma = 0;
  respuestas.forEach((valor, idx) => {
    const v = Math.min(5, Math.max(1, valor));
    suma += idx % 2 === 0 ? v - 1 : 5 - v;
  });
  return Number((suma * 2.5).toFixed(1));
}
