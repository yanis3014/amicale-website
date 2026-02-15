import { TrendingUp, DollarSign, CreditCard, Wallet } from 'lucide-react';

const monthlyRevenue = [
  { month: 'Jan', revenue: 850 },
  { month: 'Fév', revenue: 1200 },
  { month: 'Mar', revenue: 950 },
  { month: 'Avr', revenue: 1400 },
  { month: 'Mai', revenue: 1100 },
  { month: 'Juin', revenue: 1350 },
];

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

const stats = [
  { label: 'Revenus Totaux', value: '6,850 DT', change: '+15%', icon: Wallet, color: 'green' },
  { label: 'Transactions', value: '142', change: '+8', icon: CreditCard, color: 'blue' },
  { label: 'Revenu Moyen/Mois', value: '1,142 DT', change: '+12%', icon: DollarSign, color: 'purple' },
  { label: 'Taux de Paiement', value: '94%', change: '+3%', icon: TrendingUp, color: 'orange' },
];

export default function AdminFinancesPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Finances
        </h1>
        <p className="text-gray-600">
          Suivi des revenus et des transactions financières
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = {
            green: { bg: 'bg-green-50', icon: 'text-green-600', change: 'text-green-600' },
            blue: { bg: 'bg-blue-50', icon: 'text-blue-600', change: 'text-blue-600' },
            purple: { bg: 'bg-purple-50', icon: 'text-purple-600', change: 'text-purple-600' },
            orange: { bg: 'bg-orange-50', icon: 'text-orange-600', change: 'text-orange-600' },
          }[stat.color];

          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${colors?.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors?.icon}`} />
                </div>
                <span className={`text-sm font-semibold ${colors?.change}`}>
                  {stat.change}
                </span>
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

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Évolution des revenus
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Revenus mensuels en dinars tunisiens
          </p>
        </div>

        {/* Simple Bar Chart with Styled Divs */}
        <div className="space-y-4">
          {monthlyRevenue.map((item) => {
            const percentage = (item.revenue / maxRevenue) * 100;
            return (
              <div key={item.month} className="flex items-center gap-4">
                <div className="w-12 font-semibold text-gray-700 text-sm">
                  {item.month}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-10 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-blue to-brand-blue-600 h-full rounded-full flex items-center justify-end px-4 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-white font-bold text-sm">
                      {item.revenue} DT
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total période (6 mois)</span>
            <span className="text-2xl font-bold text-brand-blue">
              6,850 DT
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Flouci</h3>
          <p className="text-3xl font-bold text-gray-900">4,250 DT</p>
          <p className="text-sm text-gray-500 mt-1">62% des paiements</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Espèces</h3>
          <p className="text-3xl font-bold text-gray-900">2,100 DT</p>
          <p className="text-sm text-gray-500 mt-1">31% des paiements</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Virement</h3>
          <p className="text-3xl font-bold text-gray-900">500 DT</p>
          <p className="text-sm text-gray-500 mt-1">7% des paiements</p>
        </div>
      </div>
    </div>
  );
}
