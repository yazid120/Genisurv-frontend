import { useState, useEffect, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useModal } from "../../hooks/useModal";
import {
  getDecaissements,
  createDecaissement,
  updateDecaissement,
  deleteDecaissement,
} from "../../api/decaissements.api";
import { getCaisses } from "../../api/caisses.api";
import type { Decaissement } from "../../@types/decaissement";
import type { Caisse } from "../../@types/caisse";
import { PlusIcon, PencilIcon, TrashBinIcon } from "../../icons";

interface DecaissementForm {
  caisse_id: string;
  montant: string;
  designation: string;
  observation: string;
  type_justificatif: string;
  justificatif: File | null;
}

const initialForm: DecaissementForm = {
  caisse_id: "",
  montant: "",
  designation: "",
  observation: "",
  type_justificatif: "",
  justificatif: null,
};

export default function DecaissementsPage() {
  const [decaissements, setDecaissements] = useState<Decaissement[]>([]);
  const [caisses, setCaisses] = useState<Caisse[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<DecaissementForm>(initialForm);
  const [editingItem, setEditingItem] = useState<Decaissement | null>(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const deleteModal = useModal();
  const [itemToDelete, setItemToDelete] = useState<Decaissement | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [decaissementsData, caissesData] = await Promise.all([
        getDecaissements(),
        getCaisses(),
      ]);
      setDecaissements(decaissementsData);
      setCaisses(caissesData);
    } catch {
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setForm(initialForm);
    setError("");
    setErrors({});
    openModal();
  };

  const handleOpenEdit = (item: Decaissement) => {
    setEditingItem(item);
    setForm({
      caisse_id: item.caisse_id.toString(),
      montant: item.montant.toString(),
      designation: item.designation,
      observation: item.observation || "",
      type_justificatif: item.type_justificatif || "",
      justificatif: null,
    });
    setError("");
    setErrors({});
    openModal();
  };

  const handleOpenDelete = (item: Decaissement) => {
    setItemToDelete(item);
    deleteModal.openModal();
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.append("caisse_id", form.caisse_id);
    fd.append("montant", form.montant);
    fd.append("designation", form.designation);
    if (form.observation) fd.append("observation", form.observation);
    if (form.type_justificatif) fd.append("type_justificatif", form.type_justificatif);
    if (form.justificatif) fd.append("justificatif", form.justificatif);
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setSubmitting(true);

    try {
      const fd = buildFormData();
      if (editingItem) {
        await updateDecaissement(editingItem.id, fd);
      } else {
        await createDecaissement(fd);
      }
      closeModal();
      fetchData();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };
      if (axiosErr.response?.data?.errors) {
        setErrors(axiosErr.response.data.errors);
      }
      setError(axiosErr.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDecaissement(itemToDelete.id);
      deleteModal.closeModal();
      setItemToDelete(null);
      fetchData();
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD" }).format(val);

  const typeJustificatifOptions = [
    { value: "facture", label: "Facture" },
    { value: "reçu", label: "Reçu" },
    { value: "autre", label: "Autre" },
  ];

  return (
    <>
      <PageMeta
        title="Gestion des Décaissements"
        description="Page de gestion des décaissements"
      />
      <PageBreadcrumb pageTitle="Décaissements" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Liste des décaissements
          </h3>
          <Button size="sm" onClick={handleOpenCreate} startIcon={<PlusIcon />}>
            Ajouter
          </Button>
        </div>

        {error && !isOpen && !deleteModal.isOpen && (
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
                    Caisse
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Par
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Désignation
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Montant
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Justificatif
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decaissements.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={7}>
                      Aucun décaissement trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  decaissements.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                        {item.caisse || caisses.find((c) => c.id === item.caisse_id)?.wilaya || `#${item.caisse_id}`}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.par}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                        {item.designation}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right text-sm font-semibold text-error-600 dark:text-error-400">
                        {formatMoney(item.montant)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm">
                        {item.type_justificatif ? (
                          <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {item.type_justificatif}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.date_creation}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5"
                            title="Modifier"
                          >
                            <PencilIcon className="size-5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(item)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-error-500 dark:text-gray-400 dark:hover:bg-white/5"
                            title="Supprimer"
                          >
                            <TrashBinIcon className="size-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg p-6 lg:p-10">
        <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
          {editingItem ? "Modifier le décaissement" : "Nouveau décaissement"}
        </h4>
        {error && (
          <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500 dark:bg-error-500/10">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Caisse <span className="text-error-500">*</span></Label>
            <Select
              options={caisses.map((c) => ({ value: c.id.toString(), label: c.wilaya }))}
              placeholder="Sélectionner une caisse"
              defaultValue={form.caisse_id}
              onChange={(val) => setForm({ ...form, caisse_id: val })}
            />
            {errors.caisse_id && (
              <p className="mt-1 text-xs text-error-500">{errors.caisse_id[0]}</p>
            )}
          </div>
          <div>
            <Label>Désignation <span className="text-error-500">*</span></Label>
            <Input
              type="text"
              placeholder="Désignation du décaissement"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              error={!!errors.designation}
              hint={errors.designation?.[0]}
            />
          </div>
          <div>
            <Label>Montant <span className="text-error-500">*</span></Label>
            <Input
              type="number"
              placeholder="Montant en DZD"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
              error={!!errors.montant}
              hint={errors.montant?.[0]}
            />
          </div>
          <div>
            <Label>Observation</Label>
            <Input
              type="text"
              placeholder="Observation (optionnel)"
              value={form.observation}
              onChange={(e) => setForm({ ...form, observation: e.target.value })}
              error={!!errors.observation}
              hint={errors.observation?.[0]}
            />
          </div>
          <div>
            <Label>Type de justificatif</Label>
            <Select
              options={typeJustificatifOptions}
              placeholder="Sélectionner un type"
              defaultValue={form.type_justificatif}
              onChange={(val) => setForm({ ...form, type_justificatif: val })}
            />
          </div>
          <div>
            <Label>Justificatif (fichier)</Label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                setForm({ ...form, justificatif: e.target.files?.[0] || null })
              }
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-600 hover:file:bg-brand-100 dark:text-gray-400 dark:file:bg-brand-500/10 dark:file:text-brand-400"
            />
            {errors.justificatif && (
              <p className="mt-1 text-xs text-error-500">{errors.justificatif[0]}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={closeModal}>
              Annuler
            </Button>
            <Button size="sm" disabled={submitting}>
              {submitting
                ? "Enregistrement..."
                : editingItem
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-sm p-6"
      >
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          Confirmer la suppression
        </h4>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Êtes-vous sûr de vouloir supprimer ce décaissement de{" "}
          <strong>{itemToDelete ? formatMoney(itemToDelete.montant) : ""}</strong> ?
          Cette action est irréversible.
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={deleteModal.closeModal}>
            Annuler
          </Button>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600"
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </>
  );
}
