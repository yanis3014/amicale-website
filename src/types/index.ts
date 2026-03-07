// Types pour l'application Amicale FPHM — Association des ENSEIGNANTS

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'member' | 'admin';
  grade?: string;
  departement?: string;
  matricule?: string;
  telephone?: string;
  numero_membre?: string;
  is_adherent?: boolean;
  adherent_expires_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  titre: string;
  description: string;
  date: string;
  prix: number;
  image_url?: string;
  capacite: number;
  places_restantes: number;
  lieu?: string;
  categorie?: 'conference' | 'social' | 'formation' | 'autre';
  ouvert_etudiants?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  montant: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  id_membre: string;
  id_event?: string;
  methode_paiement: 'flouci' | 'espece' | 'virement';
  reference_paiement?: string;
  date_transaction: string;
  created_at: string;
}

export interface Registration {
  id: string;
  id_membre: string;
  id_event: string;
  status_paiement: 'pending' | 'completed' | 'failed';
  date_inscription: string;
  created_at: string;
  membre?: User;
  event?: Event;
  transaction?: Transaction;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface EventFilters {
  categorie?: string;
  date_min?: string;
  date_max?: string;
  prix_max?: number;
  search?: string;
  ouvert_etudiants?: boolean;
}
