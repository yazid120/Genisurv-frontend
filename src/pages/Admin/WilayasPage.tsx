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
import { useModal } from "../../hooks/useModal";
import {
  getWilayas,
  createWilaya,
  updateWilaya,
  deleteWilaya,
} from "../../api/wilayas.api";
import type { Wilaya } from "../../@types/wilaya";
import { PlusIcon, PencilIcon, TrashBinIcon } from "../../icons";

interface WilayaForm {
  name: string;
}

const initialForm: WilayaForm = {
  name: "",
};

export default function WilayasPage() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<WilayaForm>(initialForm);
  const [editingWilaya, setEditingWilaya] = useState<Wilaya | null>(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const deleteModal = useModal();
  const [wilayaToDelete, setWilayaToDelete] = useState<Wilaya | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWilayas();
      setWilayas(data);
    } catch {
      setError("Erreur lors du chargement des wilayas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingWilaya(null);
    setForm(initialForm);
    setError("");
    setErrors({});
    openModal();
  };

  const handleOpenEdit = (wilaya: Wilaya) => {
    setEditingWilaya(wilaya);
    setForm({ name: wilaya.nom });
    setError("");
    setErrors({});
    openModal();
  };

  const handleOpenDelete = (wilaya: Wilaya) => {
    setWilayaToDelete(wilaya);
    deleteModal.openModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setSubmitting(true);

    try {
      if (editingWilaya) {
        await updateWilaya(editingWilaya.id, { name: form.name });
      } else {
        await createWilaya({ name: form.name });
      }
      closeModal();
      fetchData();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
        };
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
    if (!wilayaToDelete) return;
    try {
      await deleteWilaya(wilayaToDelete.id);
      deleteModal.closeModal();
      setWilayaToDelete(null);
      fetchData();
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <>
      <PageMeta
        title="Gestion des Wilayas"
        description="Page de gestion des wilayas"
      />
      <PageBreadcrumb pageTitle="Wilayas" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Liste des wilayas
          </h3>
          <Button size="sm" onClick={handleOpenCreate} startIcon={<PlusIcon />}>
            Ajouter
          </Button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Nom
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wilayas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                      colSpan={3}
                    >
                      Aucune wilaya trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  wilayas.map((wilaya) => (
                    <TableRow
                      key={wilaya.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {wilaya.id}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                        {wilaya.nom}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(wilaya)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5"
                            title="Modifier"
                          >
                            <PencilIcon className="size-5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(wilaya)}
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
          {editingWilaya ? "Modifier la wilaya" : "Nouvelle wilaya"}
        </h4>
        {error && (
          <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500 dark:bg-error-500/10">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>
              Nom de la wilaya <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Ex: Alger"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!errors.name}
              hint={errors.name?.[0]}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={closeModal}>
              Annuler
            </Button>
            <Button size="sm" disabled={submitting}>
              {submitting
                ? "Enregistrement..."
                : editingWilaya
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
          Êtes-vous sûr de vouloir supprimer la wilaya{" "}
          <strong>{wilayaToDelete?.nom}</strong> ? Cette action est irréversible.
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
