import fs from 'node:fs';
import path from 'node:path';

function escribirArchivo(ruta, contenido) {
  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  fs.writeFileSync(ruta, contenido.trimStart(), 'utf8');
  console.log('Creado:', ruta);
}

// 1. Script SQL de respaldo en el repositorio
escribirArchivo('database/schema_y_datos.sql', `
CREATE DATABASE IF NOT EXISTS ecoturismo_cubarral_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecoturismo_cubarral_db;

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  tipo_entidad ENUM('Servicio', 'Atractivo') NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS operadores (
  id_operador INT AUTO_INCREMENT PRIMARY KEY,
  nombre_comercial VARCHAR(150) NOT NULL,
  representante VARCHAR(120),
  whatsapp_comercial VARCHAR(20) NOT NULL,
  verificado BOOLEAN DEFAULT TRUE,
  fecha_verificacion DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS servicios_atractivos (
  id_item INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  id_operador INT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  tarifa_referencial VARCHAR(100) NOT NULL,
  horario VARCHAR(100) NOT NULL,
  ubicacion_texto VARCHAR(150) NOT NULL,
  url_mapa VARCHAR(255) NOT NULL,
  imagen_url VARCHAR(255),
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
  FOREIGN KEY (id_operador) REFERENCES operadores(id_operador) ON DELETE SET NULL
);
`);

// 2. Estilos Tailwind v4
escribirArchivo('src/styles.css', `
@import "tailwindcss";

body {
  background-color: #FAF8F5;
  color: #1F2937;
  font-family: system-ui, -apple-system, sans-serif;
}
`);

// 3. Lógica del catálogo, WhatsApp y escala SUS
escribirArchivo('src/lib/consultas.ts', `
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
  const limpio = whatsapp.replace(/\\D/g, '');
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
`);

// 4. Conexión real a MySQL en servidor
escribirArchivo('src/lib/directorio.server.ts', `
import mysql from 'mysql2/promise';
import { DATOS_RESPALDO, type ServicioItem } from './consultas';

let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecoturismo_cubarral_db',
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

export async function obtenerCatalogoDesdeBD(): Promise<{
  fuente: 'MySQL (ecoturismo_cubarral_db)' | 'Respaldo Local';
  items: ServicioItem[];
}> {
  try {
    const db = getPool();
    const sql = [
      'SELECT',
      '  s.id_item AS id,',
      '  s.titulo AS nombre,',
      '  c.nombre AS categoria,',
      '  c.tipo_entidad AS tipoEntidad,',
      '  o.nombre_comercial AS operador,',
      '  s.descripcion,',
      '  s.tarifa_referencial AS tarifa,',
      '  s.horario,',
      '  s.ubicacion_texto AS direccion,',
      '  s.url_mapa AS mapaUrl,',
      '  o.whatsapp_comercial AS whatsapp,',
      "  DATE_FORMAT(COALESCE(o.fecha_verificacion, '2026-11-12'), '%Y-%m-%d') AS fechaVerificacion",
      'FROM servicios_atractivos s',
      'INNER JOIN categorias c ON s.id_categoria = c.id_categoria',
      'LEFT JOIN operadores o ON s.id_operador = o.id_operador',
      'ORDER BY s.id_item ASC',
    ].join(' ');
    const [rows] = await db.query(sql);
    return {
      fuente: 'MySQL (ecoturismo_cubarral_db)',
      items: rows as ServicioItem[],
    };
  } catch {
    return {
      fuente: 'Respaldo Local',
      items: DATOS_RESPALDO,
    };
  }
}
`);

// 5. Server Functions de TanStack Start
escribirArchivo('src/lib/directorio.functions.ts', `
import { createServerFn } from '@tanstack/react-start';
import { obtenerCatalogoDesdeBD } from './directorio.server';

export const cargarCatalogoFn = createServerFn({ method: 'GET' }).handler(async () => {
  return await obtenerCatalogoDesdeBD();
});
`);

// 6. Entry de servidor y router
escribirArchivo('src/server.ts', `
import handler from '@tanstack/react-start/server-entry';

export default {
  fetch(request: Request) {
    return handler.fetch(request);
  },
};
`);

escribirArchivo('src/router.tsx', `
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });
}

export const createRouter = getRouter;

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
`);

// 7. Layout raíz (__root.tsx)
escribirArchivo('src/routes/__root.tsx', `
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ecoturismo Cubarral | Directorio Web TRL 5 - UNAD' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
        <header className="bg-[#1B4332] text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link to="/" className="text-xl font-bold tracking-tight">
                Cubarral Ecoturismo
              </Link>
              <p className="text-xs text-emerald-200">
                Prototipo Web TRL 5 · Proyecto de Grado UNAD (202016907)
              </p>
            </div>
            <nav className="flex gap-4 text-sm font-medium">
              <Link to="/" className="hover:text-emerald-200 underline-offset-4 hover:underline">
                Directorio
              </Link>
              <Link to="/pruebas" className="hover:text-emerald-200 underline-offset-4 hover:underline">
                Pruebas & SUS
              </Link>
              <Link to="/acerca" className="hover:text-emerald-200 underline-offset-4 hover:underline">
                Arquitectura CDIO
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          <Outlet />
        </main>

        <footer className="bg-stone-900 text-stone-300 text-xs py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-2">
            <p>
              Desarrollado por Mario Andrés Padilla Romero & Solanyi Disney Ávila Sosa · UNAD ECBTI
            </p>
            <p>
              Datos comerciales autorizados bajo Ley 1581 de 2012 · Propiedad Intelectual Ley 23 de 1982
            </p>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  );
}
`);

// 8. Página Principal (/)
escribirArchivo('src/routes/index.tsx', `
import { useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { cargarCatalogoFn } from '../lib/directorio.functions';
import {
  CATEGORIAS_DISPONIBLES,
  filtrarCatalogo,
  generarEnlaceWhatsApp,
} from '../lib/consultas';

export const Route = createFileRoute('/')({
  loader: () => cargarCatalogoFn(),
  component: DirectorioPage,
});

function DirectorioPage() {
  const { fuente, items } = Route.useLoaderData();
  const [categoria, setCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  const filtrados = filtrarCatalogo(items, categoria, busqueda);

  const badgeClass = fuente.includes('MySQL')
    ? 'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300'
    : 'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300';

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B4332]">
            Oferta Ecoturística de Cubarral, Meta
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Consulta centralizada de hospedaje rural, aventura, gastronomía y atractivos naturales verificados.
          </p>
        </div>
        <span className={badgeClass}>
          Base de datos: {fuente}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS_DISPONIBLES.map((cat) => {
            const conteo =
              cat === 'Todas'
                ? items.length
                : items.filter((i) => i.categoria === cat).length;
            const activa = categoria === cat;
            const btnClass = activa
              ? 'px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer bg-[#1B4332] text-white'
              : 'px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer bg-white border border-stone-300 text-stone-700 hover:bg-stone-100';
            return (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={btnClass}
              >
                {cat} ({conteo})
              </button>
            );
          })}
        </div>

        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar rafting, cabañas, cascada..."
          className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
        />
      </div>

      {filtrados.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-xl p-10 text-center">
          <p className="text-stone-700 font-medium">
            No se encontraron servicios o atractivos registrados en esta categoría o búsqueda.
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Prueba seleccionando "Todas" o limpiando el filtro de texto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((item) => {
            const waUrl = generarEnlaceWhatsApp(item.whatsapp, item.nombre);
            return (
              <article
                key={item.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="bg-[#2D6A4F] text-white px-5 py-4 flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wider font-semibold bg-black/20 px-2.5 py-1 rounded">
                      {item.categoria}
                    </span>
                    <span className="text-xs text-emerald-100">
                      Verificado: {item.fechaVerificacion}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h2 className="text-lg font-bold text-stone-900">{item.nombre}</h2>
                    {item.operador && (
                      <p className="text-xs font-medium text-[#BC6C25]">
                        Operador: {item.operador}
                      </p>
                    )}
                    <p className="text-sm text-stone-600 line-clamp-3">{item.descripcion}</p>
                    <div className="pt-2 space-y-1 text-xs text-stone-700">
                      <p><strong>Tarifa:</strong> {item.tarifa}</p>
                      <p><strong>Horario:</strong> {item.horario}</p>
                      <p><strong>Ubicación:</strong> {item.direccion}</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 bg-stone-50 border-t border-stone-200 flex gap-2">
                  <Link
                    to="/operador/$id"
                    params={{ id: String(item.id) }}
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-stone-800 text-white text-xs font-semibold hover:bg-stone-700"
                  >
                    Ver ficha
                  </Link>
                  {waUrl ? (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center px-3 py-2 rounded-lg bg-[#25D366] text-stone-950 text-xs font-bold hover:brightness-95"
                    >
                      WhatsApp
                    </a>
                  ) : (
                    <span className="flex-1 text-center px-3 py-2 rounded-lg bg-stone-200 text-stone-500 text-xs font-medium">
                      Acceso libre
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
`);

// 9. Ficha de Detalle (/operador/$id)
escribirArchivo('src/routes/operador.$id.tsx', `
import { Link, createFileRoute } from '@tanstack/react-router';
import { cargarCatalogoFn } from '../lib/directorio.functions';
import { generarEnlaceWhatsApp } from '../lib/consultas';

export const Route = createFileRoute('/operador/$id')({
  loader: () => cargarCatalogoFn(),
  component: FichaDetallePage,
});

function FichaDetallePage() {
  const { id } = Route.useParams();
  const { items } = Route.useLoaderData();
  const item = items.find((i) => String(i.id) === id);

  if (!item) {
    return (
      <div className="bg-white p-8 rounded-xl border border-stone-200 text-center space-y-4">
        <h1 className="text-xl font-bold text-stone-800">Servicio o atractivo no encontrado</h1>
        <Link to="/" className="inline-block px-4 py-2 bg-[#1B4332] text-white rounded-lg text-sm">
          Volver al directorio
        </Link>
      </div>
    );
  }

  const waUrl = generarEnlaceWhatsApp(item.whatsapp, item.nombre);

  return (
    <div className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-[#1B4332] text-white p-6 flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="text-xs uppercase bg-emerald-800 px-2.5 py-1 rounded font-semibold">
            {item.categoria} · {item.tipoEntidad}
          </span>
          <h1 className="text-2xl font-bold mt-2">{item.nombre}</h1>
        </div>
        <div className="text-right text-xs text-emerald-200">
          <p>Última verificación de datos:</p>
          <p className="font-bold text-white text-sm">{item.fechaVerificacion}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <p className="text-stone-700 leading-relaxed">{item.descripcion}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm">
          <div>
            <p className="text-xs text-stone-500">Prestador / Operador</p>
            <p className="font-semibold">{item.operador || 'Atractivo natural público'}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">Tarifa referencial</p>
            <p className="font-semibold">{item.tarifa}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">Horario de atención</p>
            <p className="font-semibold">{item.horario}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">Ubicación en Cubarral</p>
            <p className="font-semibold">{item.direccion}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={item.mapaUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-lg bg-[#219EBC] text-white text-sm font-semibold hover:brightness-95"
          >
            Ver ubicación en Google Maps
          </a>

          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-lg bg-[#25D366] text-stone-950 text-sm font-bold hover:brightness-95"
            >
              Contactar operador por WhatsApp
            </a>
          )}

          <Link
            to="/"
            className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-100 ml-auto"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
`);

// 10. Módulo de Pruebas de Usabilidad y SUS (/pruebas)
escribirArchivo('src/routes/pruebas.tsx', `
import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { calcularPuntajeSUS } from '../lib/consultas';

export const Route = createFileRoute('/pruebas')({
  component: PruebasSUSPage,
});

const PREGUNTAS_SUS = [
  '1. Creo que me gustaría utilizar esta plataforma con frecuencia.',
  '2. Encontré la plataforma innecesariamente compleja.',
  '3. Pensé que la plataforma era fácil de usar.',
  '4. Creo que necesitaría el apoyo de un técnico para poder usar esta plataforma.',
  '5. Encontré que las diversas funciones estaban bien integradas.',
  '6. Pensé que había demasiada inconsistencia en esta plataforma.',
  '7. Imagino que la mayoría de las personas aprenderían a usar esto muy rápidamente.',
  '8. Encontré la plataforma muy incómoda de usar.',
  '9. Me sentí muy seguro usando la plataforma.',
  '10. Necesité aprender muchas cosas antes de poder empezar con esta plataforma.',
];

function PruebasSUSPage() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [errores, setErrores] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>(Array(10).fill(4));

  useEffect(() => {
    if (!activo) return;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [activo]);

  const puntajeSUS = calcularPuntajeSUS(respuestas);

  function exportarCSV() {
    const csv = 'tiempo_segundos,errores,puntaje_sus\\n' + segundos + ',' + errores + ',' + puntajeSUS;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evidencia_usabilidad_sus.csv';
    a.click();
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1B4332]">
          Módulo de Validación Experimental y Escala SUS (TRL 5)
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Instrumento integrado para cronometrar tareas de usuario, registrar errores y calcular el índice de usabilidad SUS.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 bg-stone-50 p-4 rounded-lg border border-stone-200">
          <div>
            <span className="text-xs text-stone-500 block">Tiempo de tarea</span>
            <span className="text-2xl font-mono font-bold">{segundos}s</span>
          </div>
          <button
            onClick={() => setActivo(!activo)}
            className="px-4 py-2 rounded-lg bg-[#1B4332] text-white text-sm font-semibold cursor-pointer"
          >
            {activo ? 'Pausar' : 'Iniciar cronómetro'}
          </button>
          <button
            onClick={() => { setActivo(false); setSegundos(0); setErrores(0); }}
            className="px-3 py-2 rounded-lg border border-stone-300 text-sm cursor-pointer"
          >
            Reiniciar
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm">Errores registrados: <strong>{errores}</strong></span>
            <button
              onClick={() => setErrores((e) => e + 1)}
              className="px-3 py-1.5 rounded bg-red-100 text-red-800 text-xs font-bold cursor-pointer"
            >
              +1 Error
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-lg font-bold">Cuestionario System Usability Scale (SUS)</h2>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-sm">
              Puntaje SUS: {puntajeSUS} / 100
            </span>
            <button
              onClick={exportarCSV}
              className="px-4 py-2 rounded-lg bg-stone-800 text-white text-xs font-semibold cursor-pointer"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {PREGUNTAS_SUS.map((pregunta, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-stone-100 text-sm">
              <span>{pregunta}</span>
              <select
                value={respuestas[idx]}
                onChange={(e) => {
                  const copia = [...respuestas];
                  copia[idx] = Number(e.target.value);
                  setRespuestas(copia);
                }}
                className="border border-stone-300 rounded px-2 py-1 bg-white"
              >
                <option value={1}>1 - Totalmente en desacuerdo</option>
                <option value={2}>2 - En desacuerdo</option>
                <option value={3}>3 - Neutral</option>
                <option value={4}>4 - De acuerdo</option>
                <option value={5}>5 - Totalmente de acuerdo</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`);

// 11. Página Acerca / Arquitectura (/acerca)
escribirArchivo('src/routes/acerca.tsx', `
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/acerca')({
  component: AcercaPage,
});

function AcercaPage() {
  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
      <h1 className="text-2xl font-bold text-[#1B4332]">
        Arquitectura Técnica y Marco CDIO (TRL 5)
      </h1>
      <p className="text-sm text-stone-700">
        Este prototipo implementa una arquitectura Cliente-Servidor desacoplada construida con <strong>TanStack Start (React 19 + TypeScript)</strong> y persistencia relacional en <strong>MySQL (ecoturismo_cubarral_db)</strong>.
      </p>
      <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1">
        <li><strong>RF01:</strong> Directorio centralizado con filtro por categoría y búsqueda en tiempo real.</li>
        <li><strong>RF02:</strong> Ficha estandarizada con tarifas referenciales, horarios y fecha de verificación.</li>
        <li><strong>RF03:</strong> Contacto directo con operadores locales vía WhatsApp sin pasarelas de pago.</li>
        <li><strong>RF04:</strong> Enlace referencial a coordenadas verificadas en Google Maps.</li>
        <li><strong>RNF01 & RNF02:</strong> Diseño Mobile-First y cumplimiento de Ley 1581 de 2012.</li>
      </ul>
    </div>
  );
}
`);

// 12. Endpoints API REST (/api/health y /api/operadores)
escribirArchivo('src/routes/api.health.ts', `
import { createFileRoute } from '@tanstack/react-router';
import { obtenerCatalogoDesdeBD } from '../lib/directorio.server';

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        const { fuente, items } = await obtenerCatalogoDesdeBD();
        return Response.json({
          status: 'ok',
          proyecto: 'Ecoturismo Cubarral TRL 5',
          baseDatos: fuente,
          totalRegistros: items.length,
        });
      },
    },
  },
});
`);

escribirArchivo('src/routes/api.operadores.ts', `
import { createFileRoute } from '@tanstack/react-router';
import { obtenerCatalogoDesdeBD } from '../lib/directorio.server';
import { filtrarCatalogo } from '../lib/consultas';

export const Route = createFileRoute('/api/operadores')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const categoria = url.searchParams.get('categoria') || 'Todas';
        const q = url.searchParams.get('q') || '';
        const { fuente, items } = await obtenerCatalogoDesdeBD();
        const filtrados = filtrarCatalogo(items, categoria, q);
        return Response.json({
          fuente,
          total: filtrados.length,
          data: filtrados,
        });
      },
    },
  },
});
`);

// 13. Pruebas automatizadas Vitest
escribirArchivo('src/test/directorio.test.ts', `
import { describe, expect, it } from 'vitest';
import {
  DATOS_RESPALDO,
  calcularPuntajeSUS,
  filtrarCatalogo,
  generarEnlaceWhatsApp,
} from '../lib/consultas';

describe('Validación funcional del Directorio Ecoturístico Cubarral (TRL 5)', () => {
  it('RF01: filtra correctamente los servicios por categoría Hospedaje', () => {
    const res = filtrarCatalogo(DATOS_RESPALDO, 'Hospedaje', '');
    expect(res.length).toBe(2);
    expect(res.every((i) => i.categoria === 'Hospedaje')).toBe(true);
  });

  it('Caso borde: devuelve arreglo vacío cuando una categoría no tiene registros', () => {
    const res = filtrarCatalogo(DATOS_RESPALDO, 'Eventos Culturales', '');
    expect(res).toEqual([]);
  });

  it('RF03: genera enlace válido de WhatsApp con mensaje precargado', () => {
    const url = generarEnlaceWhatsApp('573118851101', 'Rafting Río Ariari');
    expect(url).toContain('https://wa.me/573118851101?text=');
  });

  it('Caso borde: maneja atractivos públicos sin número de WhatsApp comercial', () => {
    const url = generarEnlaceWhatsApp(null, 'Cascada La Esmeralda');
    expect(url).toBeNull();
  });

  it('Calcula correctamente el puntaje de usabilidad SUS', () => {
    const puntaje = calcularPuntajeSUS([5, 1, 5, 1, 5, 1, 5, 1, 5, 1]);
    expect(puntaje).toBe(100);
  });
});
`);

// 14. README.md corregido
escribirArchivo('README.md', `
# Cubarral Ecoturismo · Directorio Web Centralizado (TRL 5)

Prototipo funcional de plataforma web para la promoción y gestión de los servicios ecoturísticos en el municipio de **Cubarral, Meta (Colombia)**.

- **Curso:** Proyecto de Grado (Código: 202016907) — Ingeniería de Sistemas, UNAD (ECBTI).
- **Autores:** Mario Andrés Padilla Romero (Investigador Principal) & Solanyi Disney Ávila Sosa (Coinvestigadora).
- **Tutor:** Wilson Hernán Pérez Correa.
- **Marco Metodológico:** Investigación Mixta + Iniciativa CDIO (Concebir, Diseñar, Implementar, Operar).

## Arquitectura Tecnológica

- **Frontend & SSR:** TanStack Start (React 19 + Vite + TypeScript + Tailwind CSS v4).
- **Base de Datos Relacional:** MySQL (ecoturismo_cubarral_db) mediante mysql2/promise, con respaldo automático en memoria para pruebas unitarias aisladas.
- **Pruebas Automatizadas:** Vitest.

## Instrucciones de Ejecución Local

1. Iniciar **MySQL** en XAMPP e importar el script database/schema_y_datos.sql en phpMyAdmin.
2. Instalar dependencias y ejecutar el servidor:
   - npm install
   - npm run test
   - npm run dev
3. Abrir http://localhost:3000 en el navegador.
`);

console.log('\\n¡Proyecto generado con éxito!');