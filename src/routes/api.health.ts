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
