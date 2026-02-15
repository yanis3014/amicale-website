// Types pour l'application Amicale Pharmacie

export interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'etudiant' | 'admin';
  annee?: number;
  telephone?: string;
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
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  montant: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  id_etudiant: string;
  id_event?: string;
  methode_paiement: 'flouci' | 'espece' | 'virement';
  reference_paiement?: string;
  date_transaction: string;
  created_at: string;
}

export interface Registration {
  id: string;
  id_etudiant: string;
  id_event: string;
  status_paiement: 'pending' | 'completed' | 'failed';
  date_inscription: string;
  created_at: string;
  
  // Relations optionnelles pour les requêtes avec jointures
  etudiant?: Etudiant;
  event?: Event;
  transaction?: Transaction;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Types pour les filtres et recherche
export interface EventFilters {
  categorie?: string;
  date_min?: string;
  date_max?: string;
  prix_max?: number;
  search?: string;
}
