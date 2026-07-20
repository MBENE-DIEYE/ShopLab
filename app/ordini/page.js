"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const formattaData = (iso) =>
    new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

const MieiOrdini = () => {
    const [ordini, setOrdini] = useState([]);
    const [caricamento, setCaricamento] = useState(true);

    useEffect(() => {
        const caricaOrdini = async () => {
            try {
                const response = await fetch("/api/ordini");
                const dati = await response.json();
                setOrdini(dati.ordini ?? []);
            } finally {
                setCaricamento(false);
            }
        };
        caricaOrdini();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <div className="max-w-2xl mx-auto p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-3 text-gray-900 text-center">I miei ordini</h1>
                <Link href="/dashboard" className="block mb-6 text-indigo-600 text-sm font-medium hover:underline">← Torna allo shopping</Link>

                {caricamento ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 animate-pulse h-24" />
                        ))}
                    </div>
                ) : ordini.length === 0 ? (
                    <p className="text-center text-gray-500 py-16">Non hai ancora effettuato nessun ordine.</p>
                ) : (
                    <div className="space-y-4">
                        {ordini.map((ordine) => (
                            <div key={ordine.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/60">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 font-mono">{ordine.numero}</p>
                                        <p className="text-xs text-gray-500">{formattaData(ordine.createdAt)}</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">{ordine.totale.toFixed(2)}€</p>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {ordine.articoli.map((articolo) => (
                                        <div key={articolo.id} className="flex items-center gap-4 p-4">
                                            <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                                {articolo.image && <img src={articolo.image} alt={articolo.title} className="h-9 w-9 object-contain" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 truncate">{articolo.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Quantità {articolo.quantita}{articolo.taglia && <span className="text-gray-400"> · Taglia {articolo.taglia}</span>}
                                                </p>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 shrink-0">{(articolo.price * articolo.quantita).toFixed(2)}€</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40">
                                    <p className="text-xs text-gray-500">
                                        Consegnato a {ordine.indirizzo.nome} · {ordine.indirizzo.via}, {ordine.indirizzo.cap} {ordine.indirizzo.citta}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default MieiOrdini;
