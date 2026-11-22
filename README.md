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
