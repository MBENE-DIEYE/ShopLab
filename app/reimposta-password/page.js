"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ReimpostaPassword = () => (
    <Suspense>
        <ReimpostaPasswordContenuto />
    </Suspense>
);

const ReimpostaPasswordContenuto = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [nuovaPassword, setNuovaPassword] = useState("");
    const [confermaPassword, setConfermaPassword] = useState("");
    const [errore, setErrore] = useState("");
    const [fatto, setFatto] = useState(false);
    const [caricamento, setCaricamento] = useState(false);

    const conferma = async (e) => {
        e.preventDefault();
        if (!nuovaPassword || !confermaPassword) {
            setErrore("Compila tutti i campi");
            return;
        }
        if (nuovaPassword !== confermaPassword) {
            setErrore("Le password non coincidono");
            return;
        }
        setErrore("");
        setCaricamento(true);
        try {
            const response = await fetch("/api/auth/reimposta-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, nuovaPassword }),
            });
            const dati = await response.json();
            if (!response.ok) {
                setErrore(dati.errore ?? "Errore durante il reset della password");
                return;
            }
            setFatto(true);
        } catch {
            setErrore("Errore di rete, riprova");
        } finally {
            setCaricamento(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white p-6">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="h-9 w-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">S</span>
                    <span className="text-lg font-bold text-gray-900">ShopLab</span>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    {!token ? (
                        <p className="text-sm text-red-600">Link non valido. Richiedine uno nuovo dalla pagina di accesso.</p>
                    ) : fatto ? (
                        <>
                            <h1 className="text-xl font-bold text-gray-900 mb-2">Password aggiornata!</h1>
                            <p className="text-sm text-gray-500 mb-6">Ora puoi accedere con la nuova password.</p>
                            <Link href="/" className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors text-center">
                                Vai al login
                            </Link>
                        </>
                    ) : (
                        <form onSubmit={conferma}>
                            <h1 className="text-xl font-bold text-gray-900 mb-6">Scegli una nuova password</h1>

                            {errore && (
                                <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{errore}</div>
                            )}

                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nuova password</label>
                            <input
                                type="password"
                                placeholder="Almeno 6 caratteri"
                                value={nuovaPassword}
                                onChange={(e) => setNuovaPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />

                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Conferma password</label>
                            <input
                                type="password"
                                value={confermaPassword}
                                onChange={(e) => setConfermaPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />

                            <button
                                type="submit"
                                disabled={caricamento}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                            >
                                {caricamento ? "Salvataggio..." : "Reimposta password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ReimpostaPassword;
