import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {

  const { token } = useParams<{ token: string }>();
  const { setUser } = useAuth();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {

    const verify = async () => {

      if (!token) {
        setStatus("error");
        setMessage("Token manquant");
        return;
      }

      try {
        const res = await verifyEmail(token);

        setStatus("success");
        setMessage(res.data.message || "Email vérifié avec succès");

      } catch (err: any) {

        setStatus("error");
        setMessage(
          err.response?.data?.message ||
          "Erreur de vérification"
        );

      }

    };

    verify();

  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen">

      {status === "loading" && (
        <p>Vérification en cours...</p>
      )}

      {status === "success" && (
        <p className="text-green-600 text-lg">{message}</p>
      )}

      {status === "error" && (
        <p className="text-red-600 text-lg">{message}</p>
      )}

    </div>
  );
}