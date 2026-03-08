// Types API — alignés avec le backend Express/PostgreSQL

export interface ApiUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'member' | 'admin';
  annee?: number | null;
  telephone?: string | null;
  numero_membre?: string | null;
  is_adherent?: boolean;
  adherent_expires_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ApiEvent {
  id: number;
  titre: string;
  description?: string | null;
  long_description?: string | null;
  date: string;
  date_fin?: string | null;
  prix: number;
  prix_adherent?: number | null;
  image_url?: string | null;
  gallery_images?: string[];
  capacite: number;
  places_restantes: number;
  lieu?: string | null;
  categorie?: string | null;
  is_published?: boolean;
  featured_on_home?: boolean;
  home_order?: number;
  created_at: string;
  updated_at?: string;
}

export interface ApiRegistration {
  id: number;
  user_id: number;
  event_id: number;
  statut: 'pending' | 'confirmed' | 'cancelled';
  montant_paye?: number | null;
  methode_paiement?: string | null;
  reference_paiement?: string | null;
  titulaire_compte?: string | null;
  carte_expiry?: string | null;
  created_at: string;
  titre?: string;
  date?: string;
  lieu?: string | null;
  image_url?: string | null;
}

export interface ApiActivity {
  id: number;
  title: string;
  summary?: string | null;
  content?: string | null;
  category: 'projet' | 'vie_etudiante' | 'flash_info' | 'evenement' | 'partenariat';
  main_image?: string | null;
  gallery_images: string[];
  author_id?: number | null;
  is_published?: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ApiEnseignant {
  id: number;
  nom: string;
  titre?: string | null;
  specialite?: string | null;
  email?: string | null;
  linkedin?: string | null;
  photo_url?: string | null;
  ordre: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ApiAvantage {
  id: number;
  libelle: string;
  type_avantage: 'avantage' | 'reduction' | 'autre';
  ordre: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiPartenaire {
  id: number;
  nom: string;
  logo_url?: string | null;
  url?: string | null;
  ordre: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ApiCotisation {
  id: number;
  user_id: number;
  montant: number;
  annee_universitaire: string;
  methode_paiement?: string | null;
  reference?: string | null;
  statut: 'pending' | 'confirmed' | 'rejected';
  confirmed_by?: number | null;
  confirmed_at?: string | null;
  created_at: string;
  nom?: string;
  prenom?: string;
  email?: string;
  numero_membre?: string | null;
  coupon_code?: string | null;
  coupon_created_by_admin?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  annee?: number;
  telephone?: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiError {
  error?: string;
  errors?: Array<{ msg: string; path?: string }>;
  detail?: string;
}
