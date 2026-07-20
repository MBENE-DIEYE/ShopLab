"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrello } from "@/context/CarrelloContext";

const Carrello = () => {
    const { carrello, rimuovi, aggiungi, diminuisci, toggleSelezione, toggleSelezionaTutto } = useCarrello()
    const router = useRouter();
    const [simili, setSimili] = useState(null);
    const [caricandoSimili, setCaricandoSimili] = useState(false);
    const total = carrello
        .filter((item) => item.selezionato)
        .reduce((acc, item) => acc + item.price * item.quantita, 0);

    const tuttiSelezionati = carrello.length > 0 && carrello.every((item) => item.selezionato);

    const mostraSimili = async (e, item) => {
        e.stopPropagation();
        setSimili({ item, prodotti: [] });
        setCaricandoSimili(true);
        try {
            const response = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(item.category)}`);
            const dati = await response.json();
            setSimili({ item, prodotti: dati.filter((p) => p.id !== item.id) });
        } catch {
            setSimili({ item, prodotti: [] });
        } finally {
            setCaricandoSimili(false);
        }
    }

    if (carrello.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-500 mb-4">Il carrello è vuoto</p>
                <Link href="/dashboard" className="text-indigo-600 font-medium hover:underline">Torna allo shopping</Link>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-24">
            <div className="max-w-3xl mx-auto p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-3 text-gray-900 text-center">Il tuo carrello ({carrello.length})</h1>
                <Link href="/dashboard" className="block mb-6 text-indigo-600 text-sm font-medium hover:underline">← Continua lo shopping</Link>

                <div className="flex items-center gap-2 mb-3">
                    <button
                        onClick={toggleSelezionaTutto}
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${tuttiSelezionati ? "bg-indigo-600 border-indigo-600" : "border-gray-300 hover:border-gray-400"}`}
                    >
                        {tuttiSelezionati && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        )}
                    </button>
                    <span className="text-sm text-gray-600">Tutti</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
                    {carrello.map((item) => {
                        const selezionato = item.selezionato;
                        return (
                            <div
                                key={item.chiave}
                                onClick={() => router.push(`/dashboard?highlight=${item.id}`)}
                                className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${selezionato ? "bg-indigo-50/60" : "hover:bg-gray-50"}`}
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleSelezione(item.chiave) }}
                                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selezionato ? "bg-indigo-600 border-indigo-600" : "border-gray-300 hover:border-gray-400"}`}
                                >
                                    {selezionato && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    )}
                                </button>

                                <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                    <img src={item.image} alt={item.title} className="h-11 w-11 object-contain" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm text-gray-800 truncate">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {item.price}€{item.taglia && <span className="text-gray-400"> · Taglia {item.taglia}</span>}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); item.quantita > 1 ? diminuisci(item.chiave) : rimuovi(item.chiave) }}
                                        className={`h-6 w-6 flex items-center justify-center rounded-md border transition-colors ${item.quantita > 1 ? "border-gray-200 text-gray-600 hover:bg-gray-100" : "border-red-200 text-red-500 hover:bg-red-50"}`}
                                    >
                                        {item.quantita > 1 ? (
                                            "−"
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        )}
                                    </button>
                                    <span className="text-sm w-4 text-center">{item.quantita}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); aggiungi(item, 1, item.taglia) }}
                                        className="h-6 w-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={(e) => mostraSimili(e, item)}
                                    title="Trova prodotti simili"
                                    className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 shrink-0 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>

            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <div className="max-w-3xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-500">Totale</p>
                        <p className="text-xl font-bold text-gray-900">{total.toFixed(2)}€</p>
                    </div>
                    <button
                        onClick={() => router.push("/checkout")}
                        disabled={total === 0}
                        className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors shrink-0"
                    >
                        Acquista ora
                    </button>
                </div>
            </div>

            {simili && (
                <div
                    onClick={() => setSimili(null)}
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
                            <h2 className="font-semibold text-gray-900">Simili a "{simili.item.title}"</h2>
                            <button onClick={() => setSimili(null)} className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {caricandoSimili ? (
                                <p className="text-center text-gray-500 py-8 text-sm">Caricamento...</p>
                            ) : simili.prodotti.length === 0 ? (
                                <p className="text-center text-gray-500 py-8 text-sm">Nessun prodotto simile trovato.</p>
                            ) : (
                                <div className="space-y-2">
                                    {simili.prodotti.map((p) => (
                                        <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                                            <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                                <img src={p.image} alt={p.title} className="h-9 w-9 object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 truncate">{p.title}</p>
                                                <p className="text-sm text-gray-500">{p.price}€</p>
                                            </div>
                                            <button
                                                onClick={() => aggiungi(p)}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 shrink-0 px-2"
                                            >
                                                + Aggiungi
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Carrello;
