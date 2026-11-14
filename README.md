# Cubarral Ecoturismo · Directorio de experiencias

Prototipo académico del **Directorio Ecoturístico de Cubarral (Meta, Colombia)**: un
sitio web donde el visitante busca y compara servicios de **hospedaje, rutas
ecológicas y gastronomía**, y contacta al operador directamente por **WhatsApp**.

Proyecto formativo — Universidad Nacional Abierta y a Distancia (UNAD), curso de
**Tecnologías ETL**, marco **CDIO** (Conceive–Design–Implement–Operate).

> **Los datos son ficticios.** Ningún negocio, dirección ni número de WhatsApp es
> real: son registros de prueba hasta el diagnóstico de campo con la comunidad.
> Los números de contacto usan el formato `5730000000XX`.

---

## Páginas

| Ruta | Qué hace |
| --- | --- |
| `/` | Directorio: buscador con debounce, filtros por categoría con conteo, tarjetas paginadas (9 por página) |
| `/operador/$id` | Ficha del operador: descripción, horario, dirección, enlace a Google Maps, botón de WhatsApp con mensaje precargado y servicios relacionados |
| `/etl` | Tubería Extract → Transform → Load con reporte de rechazos, tabla de transformaciones y botón para re-ejecutar el ETL (demuestra idempotencia) |
| `/pruebas` | Módulo de pruebas de usabilidad: 3 tareas con cronómetro y contador de errores, cuestionario SUS con validación y exportación a CSV |
| `/acerca` | Alcance, fases CDIO y requisitos RF01–RF03 / RNF01–RNF02 |

## API

| Método y ruta | Respuesta |
| --- | --- |
| `GET /api/health` | `{ status: "ok" }` |
| `GET /api/categorias` | Categorías con total de operadores |
| `GET /api/operadores?categoria=&q=&page=&limit=` | Listado filtrado/paginado; `400` si el filtro es inválido |
| `GET /api/operadores/$id` | Ficha completa; `400` si el id no es numérico, `404` si no existe |

Los filtros, la búsqueda y la paginación del directorio viven en los **parámetros
de la URL**, así el enlace "volver" de la ficha conserva el filtro aplicado.

## ETL

`src/data/operadores.csv` es la fuente única de verdad. `src/lib/etl.ts` es una
función pura **Extract / Transform / Load** que:

1. **Extract** — parsea el CSV respetando comillas y comas incrustadas (RFC 4180).
2. **Transform** — normaliza nombres (espacios, tildes, mayúsculas), homologa
   categorías y sus sinónimos, y estandariza el WhatsApp a `57` + 10 dígitos.
3. **Load** — inserta o actualiza (upsert) por nombre normalizado en tres tablas
   en memoria: `CATEGORIA`, `OPERADOR` y `CONTACTO`, y registra los rechazos con su motivo.

Con el CSV actual: **19 filas leídas, 15 cargadas, 4 rechazadas** (WhatsApp
inválido, categoría fuera de alcance, nombre vacío y fila duplicada). Al
re-ejecutar el ETL no se crean registros nuevos: 0 insertados, 15 actualizados.

## Stack

- **TanStack Start** (React 19 + Vite) con server functions y rutas de API
- **TypeScript**, **Tailwind CSS v4** (sistema de diseño "Piedemonte": crema,
  verde selva, barro y río; tipografías Fraunces + Manrope)
- **TanStack Query** para lectura de datos, **Vitest** para pruebas
- **Sin base de datos**: el ETL carga el CSV a un almacén en memoria, pensado para
  migrar a una base real sin tocar las consultas de lectura

Las consultas de lectura son funciones puras en `src/lib/consultas.ts` y las
comparten tanto las server functions de la interfaz como las rutas `/api/*`, de
modo que ambas devuelven la misma validación.

## Cómo ejecutarlo

Requiere Node.js 20+ (o Bun).

```sh
npm install        # o: bun install
npm run dev        # entorno de desarrollo
npm run build      # build de producción
npm run test       # 13 pruebas: ETL, normalización, idempotencia, filtros, API, SUS
npm run lint       # ESLint
```

## Estructura

```
src/
  data/operadores.csv          fuente de datos (CSV)
  lib/
    etl.ts                     Extract / Transform / Load (puro)
    consultas.ts               consultas de lectura (puras, compartidas UI + API)
    directorio.server.ts       almacén en memoria alimentado por el ETL
    directorio.functions.ts    server functions que consume la interfaz
    busqueda.ts                estado de filtros/búsqueda en la URL
    sus.ts                     cuestionario SUS y exportaciones CSV
    whatsapp.ts                enlace wa.me con mensaje precargado
  components/                  cabecera, pie, tarjeta de operador, marca
  routes/                      páginas y rutas de API (file-based routing)
  test/                        pruebas unitarias y de enrutamiento
public/img/                    fotografías optimizadas (JPG)
```

## Línea de alcance

El prototipo **no** incluye pagos, reservas, panel de operadores ni reseñas: esas
decisiones se documentan en `/acerca` como parte del cierre de alcance del curso.
