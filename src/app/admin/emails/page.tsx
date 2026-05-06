'use client';

import { useEffect, useState } from 'react';
import { Mail, Loader2, Users, User, Send, Info } from 'lucide-react';
import { sendAdminEmail } from '@/lib/api/admin';
import { getAllMembers } from '@/lib/api/members';
import type { ApiUser } from '@/lib/api/types';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function AdminEmailsPage() {
  const [members, setMembers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailTo, setEmailTo] = useState<'all' | number>('all');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getAllMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Objet et message requis');
      return;
    }
    if (emailTo !== 'all' && (typeof emailTo !== 'number' || emailTo <= 0)) {
      toast.error('Sélectionnez un destinataire');
      return;
    }
    setSendingEmail(true);
    try {
      const res = await sendAdminEmail({
        to: emailTo,
        subject: emailSubject.trim(),
        message: emailMessage.trim(),
      });
      toast.success(res.message);
      setEmailSubject('');
      setEmailMessage('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setSendingEmail(false);
    }
  };

  const membersWithEmail = members.filter((m) => m.email);
  const selectedMember = typeof emailTo === 'number' && emailTo > 0
    ? membersWithEmail.find((m) => m.id === emailTo)
    : null;

  return (
    <div className="h-full max-h-full min-h-0 flex flex-col overflow-hidden bg-[var(--bg)]/50">
      {/* En-tête compact */}
      <div className="flex-shrink-0 border-b border-neutral-100 bg-white px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-forest-600 flex items-center justify-center shadow-md">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-neutral-900">
              Envoi d&apos;emails
            </h1>
            <p className="text-xs text-neutral-500">
              Un membre ou tous les adhérents
            </p>
          </div>
        </div>
      </div>

      {/* Contenu : grille 2 colonnes sur grand écran, tout tient dans la hauteur */}
      <div className="flex-1 min-h-0 p-4 lg:p-5 overflow-hidden">
        {loading ? (
          <div className="h-full bg-white rounded-xl border border-neutral-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <form
            onSubmit={handleSendEmail}
            className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 content-stretch overflow-hidden"
          >
            {/* Colonne 1 : Destinataire */}
            <div className="flex flex-col min-h-0 bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="flex-shrink-0 px-4 py-2.5 border-b border-neutral-100 bg-[var(--bg)]/50">
                <h2 className="font-semibold text-sm text-neutral-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--accent)]" />
                  Destinataire
                </h2>
              </div>
              <div className="flex-1 min-h-0 p-4 flex flex-col gap-3 overflow-auto">
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setEmailTo('all')}
                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                      emailTo === 'all'
                        ? 'border-primary-500 bg-primary-50/80'
                        : 'border-neutral-100 hover:border-[var(--line)]'
                    }`}
                  >
                    <Users className={`w-5 h-5 flex-shrink-0 ${emailTo === 'all' ? 'text-[var(--accent)]' : 'text-neutral-400'}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-neutral-900">Tous</p>
                      <p className="text-xs text-neutral-500 truncate">{membersWithEmail.length} membre(s)</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailTo(0)}
                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                      emailTo !== 'all'
                        ? 'border-primary-500 bg-primary-50/80'
                        : 'border-neutral-100 hover:border-[var(--line)]'
                    }`}
                  >
                    <User className={`w-5 h-5 flex-shrink-0 ${emailTo !== 'all' ? 'text-[var(--accent)]' : 'text-neutral-400'}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-neutral-900">Un membre</p>
                    </div>
                  </button>
                </div>
                {emailTo !== 'all' && (
                  <select
                    value={typeof emailTo === 'number' && emailTo > 0 ? emailTo : ''}
                    onChange={(e) => setEmailTo(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 flex-shrink-0"
                  >
                    <option value="">Choisir un membre…</option>
                    {membersWithEmail.map((m) => (
                      <option key={m.id} value={m.id}>
                        {[m.prenom, m.nom].filter(Boolean).join(' ')} — {m.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Colonne 2 : Objet + Message + Bouton */}
            <div className="flex flex-col min-h-0 bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="flex-shrink-0 px-4 py-2.5 border-b border-neutral-100 bg-[var(--bg)]/50">
                <h2 className="font-semibold text-sm text-neutral-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--accent)]" />
                  Contenu
                </h2>
              </div>
              <div className="flex-1 min-h-0 p-4 flex flex-col gap-3 overflow-hidden">
                <input
                  id="emailSubject"
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Objet"
                  required
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 flex-shrink-0"
                />
                <textarea
                  id="emailMessage"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Message (personnalisé avec « Bonjour Prénom Nom »)"
                  required
                  rows={3}
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none flex-1 min-h-0"
                />
                <div className="flex items-center justify-between gap-3 flex-shrink-0 pt-1">
                  {(emailTo === 'all' || selectedMember) && (
                    <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      {emailTo === 'all'
                        ? `${membersWithEmail.length} destinataire(s)`
                        : selectedMember
                          ? [selectedMember.prenom, selectedMember.nom].filter(Boolean).join(' ')
                          : ''}
                    </span>
                  )}
                  <Button
                    type="submit"
                    disabled={sendingEmail}
                    size="md"
                    className="ml-auto"
                    leftIcon={sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  >
                    {sendingEmail ? 'Envoi…' : 'Envoyer'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
