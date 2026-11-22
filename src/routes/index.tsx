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
