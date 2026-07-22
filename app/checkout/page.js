"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCarrello } from "@/context/CarrelloContext";
import { formattaPrezzo } from "@/utils/valuta";

const INDIRIZZO_VUOTO = { nome: "", via: "", citta: "", cap: "" };

const Checkout = () => {
    const { carrello, rimuovi } = useCarrello();
    const [fase, setFase] = useState("indirizzo"); // indirizzo -> riepilogo -> confermato
    const [indirizzo, setIndirizzo] = useState(INDIRIZZO_VUOTO);
    const [erroreIndirizzo, setErroreIndirizzo] = useState("");
    const [verificandoIndirizzo, setVerificandoIndirizzo] = useState(false);
    const [elaborazione, setElaborazione] = useState(false);
    const [ordine, setOrdine] = useState(null);
    const [emailInviata, setEmailInviata] = useState(true);
    const [erroreConferma, setErroreConferma] = useState("");

    const selezionati = carrello.filter((item) => item.selezionato);
    const total = selezionati.reduce((acc, item) => acc + item.price * item.quantita, 0);

    useEffect(() => {
        const caricaUltimoIndirizzo = async () => {
            try {
                const response = await fetch("/api/indirizzo");
                if (!response.ok) return;
                const { indirizzo: ultimo } = await response.json();
                if (ultimo) setIndirizzo(ultimo);
            } catch {
                // nessun indirizzo suggerito, l'utente lo compila da zero
            }
        };
        caricaUltimoIndirizzo();
    }, []);

    const confermaIndirizzo = async (e) => {
        e.preventDefault();
        if (!indirizzo.nome || !indirizzo.via || !indirizzo.citta || !indirizzo.cap) {
            setErroreIndirizzo("Compila tutti i campi");
            return;
        }
        setErroreIndirizzo("");
        setVerificandoIndirizzo(true);
        try {
            const response = await fetch("/api/indirizzo/verifica", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ via: indirizzo.via, citta: indirizzo.citta, cap: indirizzo.cap }),
            });
            const dati = await response.json();
            if (!dati.valido) {
                setErroreIndirizzo(dati.errore ?? "Indirizzo non valido");
                return;
            }
            setFase("riepilogo");
        } catch {
            setErroreIndirizzo("Errore di rete, riprova");
        } finally {
            setVerificandoIndirizzo(false);
        }
    };

    const confermaOrdine = async () => {
        setElaborazione(true);
        setErroreConferma("");
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ indirizzo, items: selezionati, total }),
            });
            const dati = await response.json();
            if (!response.ok) {
                setErroreConferma(dati.errore ?? "Errore durante la conferma dell'ordine");
                return;
            }
            await Promise.all(selezionati.map((item) => rimuovi(item.chiave)));
            setOrdine(dati.ordine);
            setEmailInviata(dati.emailInviata);
            setFase("confermato");
        } catch {
            setErroreConferma("Errore di rete, riprova");
        } finally {
            setElaborazione(false);
        }
    };

    if (fase === "confermato" && ordine) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-6">
                <div className="w-full max-w-sm text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="h-14 w-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Ordine confermato!</h1>
                    <p className="text-sm text-gray-500 mb-4">Grazie per il tuo acquisto.</p>
                    <p className="text-xs text-gray-400 mb-1">Numero ordine <span className="font-mono text-gray-600">{ordine}</span></p>
                    <p className="text-xs text-gray-400 mb-1">
                        Consegna a {indirizzo.nome} · {indirizzo.via}, {indirizzo.citta} {indirizzo.cap}
                    </p>
                    <p className={`text-xs mb-6 ${emailInviata ? "text-gray-400" : "text-amber-600"}`}>
                        {emailInviata ? "Email di conferma inviata." : "Non siamo riusciti a inviarti l'email di conferma."}
                    </p>
                    <Link href="/dashboard" className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                        Torna allo shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (selezionati.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Nessun articolo selezionato per il checkout</p>
                    <Link href="/carrello" className="text-indigo-600 font-medium hover:underline">Torna al carrello</Link>
                </div>
            </div>
        );
    }

    if (fase === "indirizzo") {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-1 text-gray-900 text-center">Indirizzo di consegna</h1>
                    <p className="text-sm text-gray-500 text-center mb-6">Dove vuoi ricevere il tuo ordine?</p>

                    <form onSubmit={confermaIndirizzo} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        {erroreIndirizzo && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
                                {erroreIndirizzo}
                            </div>
                        )}

                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome e cognome</label>
                        <input
                            type="text"
                            placeholder="Mario Rossi"
                            value={indirizzo.nome}
                            onChange={(e) => setIndirizzo((prev) => ({ ...prev, nome: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                        />

                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Indirizzo</label>
                        <input
                            type="text"
                            placeholder="Via Roma 10"
                            value={indirizzo.via}
                            onChange={(e) => setIndirizzo((prev) => ({ ...prev, via: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                        />

                        <div className="flex gap-3 mb-6">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Città</label>
                                <input
                                    type="text"
                                    placeholder="Milano"
                                    value={indirizzo.citta}
                                    onChange={(e) => setIndirizzo((prev) => ({ ...prev, citta: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">CAP</label>
                                <input
                                    type="text"
                                    placeholder="20100"
                                    value={indirizzo.cap}
                                    onChange={(e) => setIndirizzo((prev) => ({ ...prev, cap: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={verificandoIndirizzo}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                        >
                            {verificandoIndirizzo ? "Verifica in corso..." : "Continua"}
                        </button>

                        <Link href="/carrello" className="block text-sm text-gray-500 text-center mt-4 hover:underline">← Torna al carrello</Link>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-24">
            <div className="max-w-2xl mx-auto p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-3 text-gray-900 text-center">Riepilogo ordine</h1>
                <button onClick={() => setFase("indirizzo")} className="block mb-6 text-indigo-600 text-sm font-medium hover:underline">← Modifica indirizzo</button>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2">Consegna a</h2>
                    <p className="text-sm text-gray-600">{indirizzo.nome}</p>
                    <p className="text-sm text-gray-600">{indirizzo.via}</p>
                    <p className="text-sm text-gray-600">{indirizzo.cap} {indirizzo.citta}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden mb-6">
                    {selezionati.map((item) => (
                        <div key={item.chiave} className="flex items-center gap-4 p-4">
                            <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                <img src={item.image} alt={item.title} className="h-11 w-11 object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-gray-800 truncate">{item.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Quantità {item.quantita}{item.taglia && <span className="text-gray-400"> · Taglia {item.taglia}</span>}
                                </p>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 shrink-0">{formattaPrezzo(item.price * item.quantita)}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Pagamento</h2>
                    <p className="text-xs text-gray-400 mb-1">Questa è una demo: nessun pagamento reale viene richiesto.</p>
                    <div className="flex items-center gap-2 mt-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                        </svg>
                        •••• •••• •••• 4242
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <div className="max-w-2xl mx-auto px-6 md:px-8 py-4">
                    {erroreConferma && <p className="text-red-500 text-xs mb-2">{erroreConferma}</p>}
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Totale</p>
                            <p className="text-xl font-bold text-gray-900">{formattaPrezzo(total)}</p>
                        </div>
                        <button
                            onClick={confermaOrdine}
                            disabled={elaborazione}
                            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors shrink-0"
                        >
                            {elaborazione ? "Conferma in corso..." : "Conferma ordine"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Checkout;
