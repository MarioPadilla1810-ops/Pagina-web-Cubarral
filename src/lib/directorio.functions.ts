import { createServerFn } from '@tanstack/react-start';
import { obtenerCatalogoDesdeBD } from './directorio.server';

export const cargarCatalogoFn = createServerFn({ method: 'GET' }).handler(async () => {
  return await obtenerCatalogoDesdeBD();
});
