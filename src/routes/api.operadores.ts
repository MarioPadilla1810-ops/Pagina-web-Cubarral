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
