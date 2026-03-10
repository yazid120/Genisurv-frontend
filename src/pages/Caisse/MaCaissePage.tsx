import { useState, useEffect, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { getMyCaisse } from "../../api/caisses.api";
import type { Caisse } from "../../@types/caisse";

export default function MaCaissePage() {
  const [caisse, setCaisse] = useState<Caisse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyCaisse();
      setCaisse(data);
    } catch {
      setError("Erreur lors du chargement de la caisse.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD" }).format(val);

  if (loading) {
    return (
      <>
        <PageMeta title="Ma Caisse" description="Détails de ma caisse" />
        <PageBreadcrumb pageTitle="Ma Caisse" />
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </>
    );
  }

  if (error || !caisse) {
    return (
      <>
        <PageMeta title="Ma Caisse" description="Détails de ma caisse" />
        <PageBreadcrumb pageTitle="Ma Caisse" />
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-gray-500 dark:text-gray-400">
            {error || "Aucune caisse assignée."}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Ma Caisse" description="Détails de ma caisse" />
      <PageBreadcrumb pageTitle="Ma Caisse" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Solde actuel */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Solde actuel</p>
          <h4 className="text-2xl font-bold text-brand-600 dark:text-brand-400">
            {formatMoney(caisse.solde_actuel)}
          </h4>
        </div>

        {/* Total encaissements */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Total encaissements</p>
          <h4 className="text-2xl font-bold text-success-600 dark:text-success-400">
            {formatMoney(caisse.total_encaissements)}
          </h4>
        </div>

        {/* Total alimentations */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Total alimentations</p>
          <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatMoney(caisse.total_alimentations)}
          </h4>
        </div>

        {/* Total décaissements */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Total décaissements</p>
          <h4 className="text-2xl font-bold text-error-600 dark:text-error-400">
            {formatMoney(caisse.total_decaissements)}
          </h4>
        </div>
      </div>

      {/* Détails */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Informations de la caisse
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Wilaya</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{caisse.wilaya}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gestionnaire</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{caisse.gestionnaire || "—"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
