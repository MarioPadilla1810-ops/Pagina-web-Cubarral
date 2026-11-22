import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { calcularPuntajeSUS } from '../lib/consultas';

export const Route = createFileRoute('/pruebas')({
  component: PruebasSUSPage,
});

const PREGUNTAS_SUS = [
  '1. Creo que me gustaría utilizar esta plataforma con frecuencia.',
  '2. Encontré la plataforma innecesariamente compleja.',
  '3. Pensé que la plataforma era fácil de usar.',
  '4. Creo que necesitaría el apoyo de un técnico para poder usar esta plataforma.',
  '5. Encontré que las diversas funciones estaban bien integradas.',
  '6. Pensé que había demasiada inconsistencia en esta plataforma.',
  '7. Imagino que la mayoría de las personas aprenderían a usar esto muy rápidamente.',
  '8. Encontré la plataforma muy incómoda de usar.',
  '9. Me sentí muy seguro usando la plataforma.',
  '10. Necesité aprender muchas cosas antes de poder empezar con esta plataforma.',
];

function PruebasSUSPage() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [errores, setErrores] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>(Array(10).fill(4));

  useEffect(() => {
    if (!activo) return;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [activo]);

  const puntajeSUS = calcularPuntajeSUS(respuestas);

  function exportarCSV() {
    const csv = 'tiempo_segundos,errores,puntaje_sus\n' + segundos + ',' + errores + ',' + puntajeSUS;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evidencia_usabilidad_sus.csv';
    a.click();
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1B4332]">
          Módulo de Validación Experimental y Escala SUS (TRL 5)
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Instrumento integrado para cronometrar tareas de usuario, registrar errores y calcular el índice de usabilidad SUS.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 bg-stone-50 p-4 rounded-lg border border-stone-200">
          <div>
            <span className="text-xs text-stone-500 block">Tiempo de tarea</span>
            <span className="text-2xl font-mono font-bold">{segundos}s</span>
          </div>
          <button
            onClick={() => setActivo(!activo)}
            className="px-4 py-2 rounded-lg bg-[#1B4332] text-white text-sm font-semibold cursor-pointer"
          >
            {activo ? 'Pausar' : 'Iniciar cronómetro'}
          </button>
          <button
            onClick={() => { setActivo(false); setSegundos(0); setErrores(0); }}
            className="px-3 py-2 rounded-lg border border-stone-300 text-sm cursor-pointer"
          >
            Reiniciar
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm">Errores registrados: <strong>{errores}</strong></span>
            <button
              onClick={() => setErrores((e) => e + 1)}
              className="px-3 py-1.5 rounded bg-red-100 text-red-800 text-xs font-bold cursor-pointer"
            >
              +1 Error
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-lg font-bold">Cuestionario System Usability Scale (SUS)</h2>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-sm">
              Puntaje SUS: {puntajeSUS} / 100
            </span>
            <button
              onClick={exportarCSV}
              className="px-4 py-2 rounded-lg bg-stone-800 text-white text-xs font-semibold cursor-pointer"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {PREGUNTAS_SUS.map((pregunta, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-stone-100 text-sm">
              <span>{pregunta}</span>
              <select
                value={respuestas[idx]}
                onChange={(e) => {
                  const copia = [...respuestas];
                  copia[idx] = Number(e.target.value);
                  setRespuestas(copia);
                }}
                className="border border-stone-300 rounded px-2 py-1 bg-white"
              >
                <option value={1}>1 - Totalmente en desacuerdo</option>
                <option value={2}>2 - En desacuerdo</option>
                <option value={3}>3 - Neutral</option>
                <option value={4}>4 - De acuerdo</option>
                <option value={5}>5 - Totalmente de acuerdo</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
