import { useState } from "react";
import api from "../api/axios";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Veuillez saisir votre email.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/forgot-password", { email });
      setMessage(res.data.message || "Un lien de réinitialisation a été envoyé !");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const e = err as { response?: { data?: { errors?: { email?: string[] }; message?: string } } };
        if (e.response?.data?.errors?.email) {
          setError(e.response.data.errors.email[0]);
        } else if (e.response?.data?.message) {
          setError(e.response.data.message);
        } else {
          setError("Une erreur est survenue. Veuillez réessayer.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Mot de passe oublié
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Entrez votre email pour recevoir un lien de réinitialisation.
      </p>

      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="votre email"
          />
        </div>

        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer le lien"}
        </Button>
      </form>
    </div>
  );
}