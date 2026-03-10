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
import MultiSelect from "../../components/form/MultiSelect";
import { useModal } from "../../hooks/useModal";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
} from "../../api/roles.api";
import type { Role } from "../../@types/role";
import { PlusIcon, PencilIcon, TrashBinIcon } from "../../icons";

interface RoleForm {
  nom: string;
  permissions: string[];
}

const initialForm: RoleForm = {
  nom: "",
  permissions: [],
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<RoleForm>(initialForm);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const deleteModal = useModal();
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch {
      setError("Erreur lors du chargement des rôles.");
    }
    try {
      const permsData = await getPermissions();
      setPermissions(permsData);
    } catch {
      console.warn("Impossible de charger les permissions.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setForm(initialForm);
    setError("");
    setErrors({});
    openModal();
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setForm({
      nom: role.nom,
      permissions: role.permissions ?? [],
    });
    setError("");
    setErrors({});
    openModal();
  };

  const handleOpenDelete = (role: Role) => {
    setRoleToDelete(role);
    deleteModal.openModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setSubmitting(true);

    try {
      if (editingRole) {
        await updateRole(editingRole.id, form as Partial<Role>);
      } else {
        await createRole(form as Partial<Role>);
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
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete.id);
      deleteModal.closeModal();
      setRoleToDelete(null);
      fetchData();
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  const permissionOptions = permissions.map((p) => ({
    value: p,
    text: p,
  }));

  return (
    <>
      <PageMeta
        title="Gestion des Rôles"
        description="Page de gestion des rôles"
      />
      <PageBreadcrumb pageTitle="Rôles" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Liste des rôles
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
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nom
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Permissions
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date création
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={4}>
                      Aucun rôle trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow
                      key={role.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                        {role.nom}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(!role.permissions || role.permissions.length === 0) ? (
                            <span className="text-sm text-gray-400">—</span>
                          ) : (
                            role.permissions.slice(0, 3).map((perm) => (
                              <span
                                key={perm}
                                className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-400"
                              >
                                {perm}
                              </span>
                            ))
                          )}
                          {role.permissions.length > 3 && (
                            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                              +{role.permissions.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {role.date_creation}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(role)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5"
                            title="Modifier"
                          >
                            <PencilIcon className="size-5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(role)}
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
          {editingRole ? "Modifier le rôle" : "Nouveau rôle"}
        </h4>
        {error && (
          <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500 dark:bg-error-500/10">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Nom du rôle <span className="text-error-500">*</span></Label>
            <Input
              type="text"
              placeholder="Ex: Administrateur"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              error={!!errors.nom}
              hint={errors.nom?.[0]}
            />
          </div>
          <div>
            <MultiSelect
              label="Permissions"
              options={permissionOptions}
              value={form.permissions}
              onChange={(selected) => setForm({ ...form, permissions: selected })}
              placeholder="Sélectionner les permissions"
            />
            {errors.permissions && (
              <p className="mt-1 text-xs text-error-500">{errors.permissions[0]}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={closeModal}>
              Annuler
            </Button>
            <Button size="sm" disabled={submitting}>
              {submitting
                ? "Enregistrement..."
                : editingRole
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
          Êtes-vous sûr de vouloir supprimer le rôle{" "}
          <strong>{roleToDelete?.nom}</strong> ? Cette action est irréversible.
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
