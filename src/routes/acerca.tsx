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
