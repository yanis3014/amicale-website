import Link from 'next/link';
import { CheckCircle, Home, Calendar, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription confirmée - Amicale Pharmacie',
  description: "Votre inscription à l'événement a été confirmée avec succès",
};

export default function AdhesionSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Félicitations ! 🎉
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Votre inscription est validée
          </p>
          <p className="text-gray-600">
            Un email de confirmation a été envoyé à votre adresse
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Paiement confirmé
                </h2>
                <p className="text-sm text-gray-600">
                  Transaction effectuée avec succès
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Prochaines étapes
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Vérifiez votre email</p>
                    <p className="text-sm text-gray-600">
                      Votre billet électronique et tous les détails de l&apos;événement vous ont été envoyés par email
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Conservez votre billet</p>
                    <p className="text-sm text-gray-600">
                      Présentez votre billet électronique (imprimé ou sur mobile) le jour de l&apos;événement
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Préparez-vous !</p>
                    <p className="text-sm text-gray-600">
                      Ajoutez l&apos;événement à votre calendrier et préparez vos questions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Vous n&apos;avez pas reçu d&apos;email ?
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Vérifiez votre dossier spam ou contactez-nous à{' '}
                <a href="mailto:asso.fphm@gmail.com" className="text-primary font-semibold hover:underline">
                  asso.fphm@gmail.com
                </a>
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
                  Renvoyer l&apos;email
                </button>
                <button className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ajouter au calendrier
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <button className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all hover:shadow-lg flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Retour à l&apos;accueil
            </button>
          </Link>
          <Link href="/evenements" className="flex-1">
            <button className="w-full px-6 py-4 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Voir d&apos;autres événements
            </button>
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Besoin d&apos;aide ? Contactez notre support :{' '}
          <a href="mailto:asso.fphm@gmail.com" className="text-primary font-medium hover:underline">
            asso.fphm@gmail.com
          </a>
          {' '}ou{' '}
          <a href="tel:+21673461000" className="text-primary font-medium hover:underline">
            +216 73 46 10 00
          </a>
        </p>
      </div>
    </div>
  );
}
