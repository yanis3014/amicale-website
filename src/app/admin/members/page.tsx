'use client';

import { useState } from 'react';
import { Plus, Edit, Download } from 'lucide-react';

const members = [
  { id: '1', nom: 'Ben Salem', prenom: 'Ahmed', email: 'ahmed.bensalem@fphm.tn', grade: 'Maître de Conférences', departement: 'Pharmacie Clinique', statut: 'Actif' as const },
  { id: '2', nom: 'Gharbi', prenom: 'Amira', email: 'amira.gharbi@fphm.tn', grade: 'Professeur', departement: 'Biochimie', statut: 'Actif' as const },
  { id: '3', nom: 'Dhouib', prenom: 'Karim', email: 'karim.dhouib@fphm.tn', grade: 'Assistant', departement: 'Pharmacie Galénique', statut: 'Actif' as const },
  { id: '4', nom: 'Trabelsi', prenom: 'Sonia', email: 'sonia.trabelsi@fphm.tn', grade: 'Maître Assistant', departement: 'Chimie Thérapeutique', statut: 'Actif' as const },
  { id: '5', nom: 'Mansour', prenom: 'Youssef', email: 'youssef.mansour@fphm.tn', grade: 'Maître de Conférences', departement: 'Microbiologie', statut: 'Actif' as const },
  { id: '6', nom: 'Bouaziz', prenom: 'Leila', email: 'leila.bouaziz@fphm.tn', grade: 'Professeur', departement: 'Pharmacologie', statut: 'Inactif' as const },
];

export default function AdminMembersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter((member) =>
    `${member.prenom} ${member.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    alert('Export Excel généré (simulation) !');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Membres
          </h1>
          <p className="text-gray-600">
            Liste des enseignants membres de l&apos;Amicale
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exporter Excel
          </button>
          <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouveau Membre
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nom Complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {member.prenom} {member.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.grade}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{member.departement}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.statut === 'Actif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {member.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-primary-600 font-medium flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun membre trouvé</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Enseignants membres</h3>
          <p className="text-3xl font-bold text-gray-900">{members.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Actifs</h3>
          <p className="text-3xl font-bold text-green-600">
            {members.filter((m) => m.statut === 'Actif').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Inactifs</h3>
          <p className="text-3xl font-bold text-gray-600">
            {members.filter((m) => m.statut === 'Inactif').length}
          </p>
        </div>
      </div>
    </div>
  );
}
