"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrello } from "@/context/CarrelloContext";

const Account = () => {
    const router = useRouter();
    const { ricaricaCarrello } = useCarrello();
    const [email, setEmail] = useState("");

    const [passwordAttuale, setPasswordAttuale] = useState("");
    const [nuovaPassword, setNuovaPassword] = useState("");
    const [confermaPassword, setConfermaPassword] = useState("");
    const [erroreCambioPassword, setErroreCambioPassword] = useState("");
    const [successoCambioPassword, setSuccessoCambioPassword] = useState(false);
    const [salvandoPassword, setSalvandoPassword] = useState(false);

    const [confermaEliminazione, setConfermaEliminazione] = useState(false);
    const [erroreEliminazione, setErroreEliminazione] = useState("");
    const [eliminando, setEliminando] = useState(false);

    useEffect(() => {
        const caricaUtente = async () => {
            try {
                const response = await fetch("/api/auth/me");
                const dati = await response.json();
                if (dati.utente) setEmail(dati.utente.email);
            } catch {
                // se fallisce mostriamo semplicemente il campo vuoto
            }
        };
        caricaUtente();
    }, []);

    const cambiaPassword = async (e) => {
        e.preventDefault();
        setErroreCambioPassword("");
        setSuccessoCambioPassword(false);
        if (!passwordAttuale || !nuovaPassword || !confermaPassword) {
            setErroreCambioPassword("Compila tutti i campi");
            return;
        }
        if (nuovaPassword !== confermaPassword) {
            setErroreCambioPassword("Le password non coincidono");
            return;
        }
        setSalvandoPassword(true);
        try {
            const response = await fetch("/api/account/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passwordAttuale, nuovaPassword }),
            });
            const dati = await response.json();
            if (!response.ok) {
                setErroreCambioPassword(dati.errore ?? "Errore durante il cambio password");
                return;
            }
            setSuccessoCambioPassword(true);
            setPasswordAttuale("");
            setNuovaPassword("");
            setConfermaPassword("");
        } catch {
            setErroreCambioPassword("Errore di rete, riprova");
        } finally {
            setSalvandoPassword(false);
        }
    };

    const eliminaAccount = async () => {
        setErroreEliminazione("");
        setEliminando(true);
        try {
            const response = await fetch("/api/account", { method: "DELETE" });
            if (!response.ok) {
                const dati = await response.json();
                setErroreEliminazione(dati.errore ?? "Errore durante l'eliminazione dell'account");
                return;
            }
            await ricaricaCarrello();
            router.push("/");
        } catch {
            setErroreEliminazione("Errore di rete, riprova");
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-6">
            <div className="max-w-sm mx-auto">
                <h1 className="text-2xl font-bold mb-1 text-gray-900 text-center">Il mio account</h1>
                <p className="text-sm text-gray-500 text-center mb-6">{email}</p>
                <Link href="/dashboard" className="block mb-6 text-indigo-600 text-sm font-medium hover:underline text-center">← Torna allo shopping</Link>

                <Link href="/ordini" className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">I miei ordini</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>

                <form onSubmit={cambiaPassword} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Cambia password</h2>

                    {erroreCambioPassword && (
                        <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{erroreCambioPassword}</div>
                    )}
                    {successoCambioPassword && (
                        <div className="bg-green-50 text-green-600 text-sm px-3 py-2 rounded-lg mb-4">Password aggiornata con successo.</div>
                    )}

                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Password attuale</label>
                    <input
                        type="password"
                        value={passwordAttuale}
                        onChange={(e) => setPasswordAttuale(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />

                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Nuova password</label>
                    <input
                        type="password"
                        placeholder="Almeno 6 caratteri"
                        value={nuovaPassword}
                        onChange={(e) => setNuovaPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />

                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Conferma nuova password</label>
                    <input
                        type="password"
                        value={confermaPassword}
                        onChange={(e) => setConfermaPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />

                    <button
                        type="submit"
                        disabled={salvandoPassword}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                    >
                        {salvandoPassword ? "Salvataggio..." : "Aggiorna password"}
                    </button>
                </form>

                <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm">
                    <h2 className="text-base font-semibold text-red-600 mb-2">Elimina account</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Questa azione è irreversibile: verranno eliminati il tuo account, il carrello e lo storico ordini.
                    </p>

                    {erroreEliminazione && (
                        <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{erroreEliminazione}</div>
                    )}

                    {!confermaEliminazione ? (
                        <button
                            onClick={() => setConfermaEliminazione(true)}
                            className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium py-2.5 rounded-xl transition-colors"
                        >
                            Elimina il mio account
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-700 font-medium">Sei sicuro? Non si può annullare.</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfermaEliminazione(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl transition-colors"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={eliminaAccount}
                                    disabled={eliminando}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                                >
                                    {eliminando ? "Eliminazione..." : "Sì, elimina"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Account;
