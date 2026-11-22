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
