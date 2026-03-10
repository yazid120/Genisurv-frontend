export interface Caisse {
    id: number;
    wilaya: string;
    gestionnaire: string;
    solde_actuel: number;
    total_encaissements: number;
    total_alimentations: number;
    total_decaissements: number;
}