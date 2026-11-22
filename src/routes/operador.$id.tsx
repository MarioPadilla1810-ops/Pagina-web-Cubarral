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
