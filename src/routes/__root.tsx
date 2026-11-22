import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ecoturismo Cubarral | Directorio Web TRL 5 - UNAD' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
        <header className="bg-[#1B4332] text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link to="/" className="text-xl font-bold tracking-tight">
                Cubarral Ecoturismo
              </Link>
              <p className="text-xs text-emerald-200">
                Prototipo Web TRL 5 · Proyecto de Grado UNAD (202016907)
              </p>
            </div>
            <nav className="flex gap-4 text-sm font-medium">
              <Link to="/" className="hover:text-emerald-200 underline-offset-4 hover:underline">
                Directorio
              </Link>
              <Link to="/pruebas" className="hover:text-emerald-200 underline-offset-4 hover:underline">
                Pruebas & SUS
              </Link>
              <Link to="/acerca" className="hover:text-emerald-200 underline-offset-4 hover:underline">
                Arquitectura CDIO
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          <Outlet />
        </main>

        <footer className="bg-stone-900 text-stone-300 text-xs py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-2">
            <p>
              Desarrollado por Mario Andrés Padilla Romero & Solanyi Disney Ávila Sosa · UNAD ECBTI
            </p>
            <p>
              Datos comerciales autorizados bajo Ley 1581 de 2012 · Propiedad Intelectual Ley 23 de 1982
            </p>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  );
}
