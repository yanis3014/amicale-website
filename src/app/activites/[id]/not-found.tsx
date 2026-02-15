export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Activité introuvable
        </h2>
        <p className="text-gray-600 mb-8">
          L'activité que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <a
          href="/activites"
          className="inline-block px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue-600 transition-colors"
        >
          Retour aux activités
        </a>
      </div>
    </div>
  );
}
