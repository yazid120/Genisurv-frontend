import { useState, useEffect, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import { getCaisses } from "../../api/caisses.api";
import type { Caisse } from "../../@types/caisse";

export default function CaissesPage() {
  const [caisses, setCaisses] = useState<Caisse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCaisses();
      setCaisses(data);
    } catch {
      setError("Erreur lors du chargement des caisses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD" }).format(val);

  return (
    <>
      <PageMeta
        title="Gestion des Caisses"
        description="Page de gestion des caisses"
      />
      <PageBreadcrumb pageTitle="Caisses" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Liste des caisses
          </h3>
        </div>

        {error && (
          <div className="mx-5 mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500 dark:bg-error-500/10">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Wilaya
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Gestionnaire
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Solde actuel
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total encaissements
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total alimentations
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total décaissements
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caisses.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={6}>
                      Aucune caisse trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  caisses.map((caisse) => (
                    <TableRow
                      key={caisse.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                        {caisse.wilaya}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {caisse.gestionnaire || "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {formatMoney(caisse.solde_actuel)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right text-sm text-success-600 dark:text-success-400">
                        {formatMoney(caisse.total_encaissements)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right text-sm text-blue-600 dark:text-blue-400">
                        {formatMoney(caisse.total_alimentations)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right text-sm text-error-600 dark:text-error-400">
                        {formatMoney(caisse.total_decaissements)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}
