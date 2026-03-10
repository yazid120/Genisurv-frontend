export interface Decaissement {
  id: number;
  caisse_id: number;
  user_id: number;
  montant: number;
  designation: string;
  observation?: string;
  type_justificatif?: 'facture' | 'reçu' | 'autre';
  lien_justificatif?: string;
  etat_justificatif?: string;
  date_creation: string;
  caisse: string;
  par: string;
}