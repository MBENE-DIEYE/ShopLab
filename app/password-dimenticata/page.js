"use client";
import { useState } from "react";
import Link from "next/link";

const PasswordDimenticata = () => {
    const [email, setEmail] = useState("");
    const [errore, setErrore] = useState("");
    const [inviato, setInviato] = useState(false);
    const [caricamento, setCaricamento] = useState(false);

    const invia = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrore("Inserisci un'email");
            return;
        }
        setErrore("");
        setCaricamento(true);
        try {
            await fetch("/api/auth/password-dimenticata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            setInviato(true);
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
                    {inviato ? (
                        <>
                            <h1 className="text-xl font-bold text-gray-900 mb-2">Controlla la tua email</h1>
                            <p className="text-sm text-gray-500 mb-6">
                                Se esiste un account con questa email, riceverai a breve un link per reimpostare la password.
                            </p>
                            <Link href="/" className="text-indigo-600 font-medium text-sm hover:underline">← Torna al login</Link>
                        </>
                    ) : (
                        <form onSubmit={invia}>
                            <h1 className="text-xl font-bold text-gray-900 mb-1">Password dimenticata?</h1>
                            <p className="text-sm text-gray-500 mb-6">Inserisci la tua email, ti manderemo un link per reimpostarla.</p>

                            {errore && (
                                <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{errore}</div>
                            )}

                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="nome@esempio.it"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />

                            <button
                                type="submit"
                                disabled={caricamento}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                            >
                                {caricamento ? "Invio in corso..." : "Invia link di reset"}
                            </button>

                            <p className="text-sm text-gray-500 text-center mt-4">
                                <Link href="/" className="text-indigo-600 font-medium hover:underline">← Torna al login</Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PasswordDimenticata;
