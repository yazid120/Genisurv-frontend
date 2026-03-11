import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

// Type propre pour l'utilisateur
interface User {
  id: number;
  nom: string;
  email: string;
  email_verification: boolean;
  role?: string;
  permissions?: string[];
  wilaya?: string | null;
  date_creation?: string;
  date_modification?: string;
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/me"); // endpoint user connecté
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await api.put("/profile", {
        nom: user.nom,
        email: user.email,
      });
      console.log("Modifications enregistrées !");
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informations personnelles
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {user.nom && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Nom</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.nom}</p>
              </div>
            )}

            {user.email && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.email}</p>
              </div>
            )}

            {user.email_verification !== undefined && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email vérifié</p>
                <p
                  className={`text-sm font-medium ${
                    user.email_verification ? "text-green-600" : "text-red-600 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!user.email_verification) navigate("/emailverification");
                  }}
                >
                  {user.email_verification ? "Oui" : "Non"}
                </p>
              </div>
            )}

            {user.role && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Rôle</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.role}</p>
              </div>
            )}

            {user.wilaya && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Wilaya</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.wilaya}</p>
              </div>
            )}

            {user.permissions && user.permissions.length > 0 && (
              <div className="col-span-2">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((perm, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            Modifier
          </button>
          <button
            onClick={() => navigate("/forgotpassword")}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            Mot de passe oublié
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Modifier vos informations</h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Vous pouvez modifier uniquement le nom et l'email
            </p>
          </div>

          <form className="flex flex-col">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              {user.nom && (
                <div>
                  <Label>Nom</Label>
                  <Input
                    type="text"
                    value={user.nom}
                    onChange={(e) => setUser({ ...user, nom: e.target.value })}
                  />
                </div>
              )}
              {user.email && (
                <div>
                  <Label>Email</Label>
                  <Input
                    type="text"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fermer
              </Button>
              <Button size="sm" onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}