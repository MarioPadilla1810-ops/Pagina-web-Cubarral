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
