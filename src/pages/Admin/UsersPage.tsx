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
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users.api";
import { getRoles } from "../../api/roles.api";
import { getWilayas } from "../../api/wilayas.api";
import type { User } from "../../@types/user";
import type { Role } from "../../@types/role";
import type { Wilaya } from "../../@types/wilaya";
import { PlusIcon, PencilIcon, TrashBinIcon } from "../../icons";

interface UserForm {
  name: string;
  email: string;
  password: string;
  role_id: string;
  wilaya_id: string;
}

const initialForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role_id: "",
  wilaya_id: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<UserForm>(initialForm);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const deleteModal = useModal();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, rolesData, wilayasData] = await Promise.all([
        getUsers(),
        getRoles(),
        getWilayas(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setWilayas(wilayasData);
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
    setEditingUser(null);
    setForm(initialForm);
    setError("");
    setErrors({});
    openModal();
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.nom,
      email: user.email,
      password: "",
      role_id: user.role_id?.toString() || "",
      wilaya_id: user.wilaya_id?.toString() || "",
    });
    setError("");
    setErrors({});
    openModal();
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    deleteModal.openModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setSubmitting(true);

    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      role_id: form.role_id ? Number(form.role_id) : undefined,
      wilaya_id: form.wilaya_id ? Number(form.wilaya_id) : undefined,
    };
    if (form.password) {
      payload.password = form.password;
    }

    try {
      if (editingUser) {
        await updateUser(editingUser.id, payload as Partial<User>);
      } else {
        payload.password = form.password;
        await createUser(payload as Partial<User>);
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
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      deleteModal.closeModal();
      setUserToDelete(null);
      fetchData();
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <>
      <PageMeta
        title="Gestion des Utilisateurs"
        description="Page de gestion des utilisateurs"
      />
      <PageBreadcrumb pageTitle="Utilisateurs" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Liste des utilisateurs
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
                    Email
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Rôle
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Wilaya
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={6}>
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                        {user.nom}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.wilaya || "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.date_creation}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5"
                            title="Modifier"
                          >
                            <PencilIcon className="size-5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(user)}
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
          {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
        </h4>
        {error && (
          <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500 dark:bg-error-500/10">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Nom <span className="text-error-500">*</span></Label>
            <Input
              type="text"
              placeholder="Nom complet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!errors.name}
              hint={errors.name?.[0]}
            />
          </div>
          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <Input
              type="email"
              placeholder="email@exemple.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={!!errors.email}
              hint={errors.email?.[0]}
            />
          </div>
          <div>
            <Label>
              Mot de passe {!editingUser && <span className="text-error-500">*</span>}
            </Label>
            <Input
              type="password"
              placeholder={editingUser ? "Laisser vide pour ne pas changer" : "Mot de passe"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={!!errors.password}
              hint={errors.password?.[0]}
            />
          </div>
          <div>
            <Label>Rôle <span className="text-error-500">*</span></Label>
            <Select
              options={roles.map((r) => ({ value: r.id.toString(), label: r.nom }))}
              placeholder="Sélectionner un rôle"
              defaultValue={form.role_id}
              onChange={(val) => setForm({ ...form, role_id: val })}
            />
            {errors.role_id && (
              <p className="mt-1 text-xs text-error-500">{errors.role_id[0]}</p>
            )}
          </div>
          <div>
            <Label>Wilaya</Label>
            <Select
              options={wilayas.map((w) => ({ value: w.id.toString(), label: w.nom }))}
              placeholder="Sélectionner une wilaya"
              defaultValue={form.wilaya_id}
              onChange={(val) => setForm({ ...form, wilaya_id: val })}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={closeModal}>
              Annuler
            </Button>
            <Button size="sm" disabled={submitting}>
              {submitting
                ? "Enregistrement..."
                : editingUser
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
          Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
          <strong>{userToDelete?.nom}</strong> ? Cette action est irréversible.
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
