import { useState } from "react";
import { resendEmailVerification } from "../api/auth.api";

export default function EmailVerification() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await resendEmailVerification();
      setMessage(res.data.message || "Email de vérification envoyé !");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Impossible d'envoyer l'email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-md text-center w-[420px]">

        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Email non vérifié
        </h2>

        <p className="text-gray-600 mb-6">
          Votre adresse email n'est pas encore vérifiée.
          Vérifiez votre boîte mail ou renvoyez le lien de vérification.
        </p>

        {message && (
          <p className="text-green-600 mb-4">{message}</p>
        )}

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <button
          onClick={handleResend}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Renvoyer email"}
        </button>

      </div>
    </div>
  );
}