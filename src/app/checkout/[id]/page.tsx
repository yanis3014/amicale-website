'use client';

import { useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Lock, Loader2 } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';

export default function CheckoutPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
// Validation simple
    if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsProcessing(true);

    // Simulation d'un appel API de paiement (2 secondes)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Redirection vers la page de succès
    router.push('/checkout/success');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      // Format avec espaces tous les 4 chiffres
      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      setCardData({ ...cardData, number: formatted });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, '');
    if (value.length <= 4 && /^\d*$/.test(value)) {
      const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
      setCardData({ ...cardData, expiry: formatted });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCardData({ ...cardData, cvv: value });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'événement
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-4">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-semibold">Paiement sécurisé SSL</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Paiement
            </h1>
            <p className="text-gray-600">
              Finalisez votre inscription en toute sécurité
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Payment Form - 3/5 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-brand-blue" />
                  Informations de paiement
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Holder Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom sur la carte
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      placeholder="JOHN DOE"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                      required
                      disabled={isProcessing}
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label htmlFor="number" className="block text-sm font-semibold text-gray-700 mb-2">
                      Numéro de carte
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="number"
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                        required
                        disabled={isProcessing}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                        <div className="w-10 h-6 bg-gradient-to-r from-orange-600 to-red-400 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-semibold text-gray-700 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        value={cardData.cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Vos informations sont sécurisées
                        </p>
                        <p className="text-xs text-blue-700">
                          Toutes les transactions sont cryptées via SSL 256-bit. Nous ne stockons jamais vos informations bancaires.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-brand-green hover:bg-brand-green-600 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Traitement en cours...
                      </span>
                    ) : (
                      `Confirmer le paiement de ${event.prix} DT`
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary - 2/5 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Récapitulatif
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Événement</p>
                    <p className="font-semibold text-gray-900">{event.titre}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="font-medium text-gray-700">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Lieu</p>
                    <p className="font-medium text-gray-700">{event.lieu}</p>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Prix unitaire</span>
                    <span className="font-medium text-gray-900">
                      {event.prix} DT
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Quantité</span>
                    <span className="font-medium text-gray-900">× 1</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Frais de service</span>
                    <span className="font-medium text-gray-900">0 DT</span>
                  </div>
                  <div className="border-t-2 border-gray-200 mt-4 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-brand-blue">
                        {event.prix} DT
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span>Paiement 100% sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
