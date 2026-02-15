import { ArrowTrendingUp, Users as UsersIcon, CalendarCheck, TrendingUp, DollarSign } from 'lucide-react';

const stats = [
  {
    label: 'Total Adhésions',
    value: '1,250 DT',
    icon: DollarSign,
    change: '+12%',
    positive: true,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    label: 'Inscrits Gala',
    value: '85',
    icon: CalendarCheck,
    change: '+23',
    positive: true,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Nouveaux Membres',
    value: '+12',
    icon: UsersIcon,
    change: 'Cette semaine',
    positive: null,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    label: 'Taux de conversion',
    value: '65%',
    icon: TrendingUp,
    change: '+8%',
    positive: true,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
];

const transactions = [
  { id: '1', nom: 'Ahmed Ben Salem', event: 'Gala Annuel 2026', montant: 25, statut: 'Validé', date: '2026-02-14' },
  { id: '2', nom: 'Amira Gharbi', event: 'Atelier CV & Entretiens', montant: 0, statut: 'Validé', date: '2026-02-14' },
  { id: '3', nom: 'Karim Dhouib', event: 'Gala Annuel 2026', montant: 25, statut: 'Validé', date: '2026-02-13' },
  { id: '4', nom: 'Sonia Trabelsi', event: 'Formation Premiers Secours', montant: 15, statut: 'Validé', date: '2026-02-13' },
  { id: '5', nom: 'Youssef Mansour', event: 'Gala Annuel 2026', montant: 25, statut: 'En attente', date: '2026-02-12' },
  { id: '6', nom: 'Leila Bouaziz', event: 'Atelier Concours', montant: 35, statut: 'Validé', date: '2026-02-12' },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vue d'ensemble
        </h1>
        <p className="text-gray-600">
          Tableau de bord de l'administration de l'Amicale
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                {stat.positive !== null && (
                  <span className={`text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                )}
                {stat.positive === null && (
                  <span className="text-xs text-gray-500">{stat.change}</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Dernières Transactions
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Paiements reçus récemment
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Événement
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{transaction.nom}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{transaction.event}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">
                      {transaction.montant === 0 ? 'Gratuit' : `${transaction.montant} DT`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.statut === 'Validé'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {transaction.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-brand-blue font-semibold hover:text-brand-blue-600 transition-colors">
            Voir toutes les transactions →
          </button>
        </div>
      </div>
    </div>
  );
}
