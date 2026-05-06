export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Annonce introuvable
        </h2>
        <p className="text-gray-600 mb-8">
          L&apos;annonce que vous recherchez n&apos;existe pas ou a été supprimée.
        </p>
        <a
          href="/annonces"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          Retour aux annonces
        </a>
      </div>
    </div>
  );
}
