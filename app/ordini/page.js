"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BarraIcone from "@/components/BarraIcone";

const formattaData = (iso) =>
    new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

const COLORI_STATO = {
    in_elaborazione: "bg-amber-50 text-amber-600",
    spedito: "bg-blue-50 text-blue-600",
    in_consegna: "bg-indigo-50 text-indigo-600",
    consegnato: "bg-green-50 text-green-600",
};

const TrackingOrdine = ({ tracking }) => (
    <div className="px-4 py-4">
        <div className="flex items-center">
            {tracking.fasi.map((fase, i) => (
                <div key={fase} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                        <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                                i <= tracking.indice ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"
                            }`}
                        >
                            {i < tracking.indice ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            )}
                        </div>
                        <span className={`text-[10px] mt-1.5 text-center w-16 ${i <= tracking.indice ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                            {fase}
                        </span>
                    </div>
                    {i < tracking.fasi.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-4 ${i < tracking.indice ? "bg-indigo-600" : "bg-gray-200"}`} />
                    )}
                </div>
            ))}
        </div>
    </div>
);

const MieiOrdini = () => {
    const router = useRouter();
    const [ordini, setOrdini] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [espanso, setEspanso] = useState(null); // { ordineId, articoloId }

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
            <BarraIcone />
            <div className="max-w-2xl mx-auto p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">I miei ordini</h1>

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
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">{ordine.totale.toFixed(2)}€</p>
                                        <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 ${COLORI_STATO[ordine.tracking.stato]}`}>
                                            {ordine.tracking.etichetta}
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100 border-t border-gray-100">
                                    {ordine.articoli.map((articolo) => {
                                        const isEspanso = espanso?.ordineId === ordine.id && espanso?.articoloId === articolo.id;
                                        return (
                                            <div key={articolo.id}>
                                                <button
                                                    onClick={() =>
                                                        isEspanso
                                                            ? router.push(`/dashboard?highlight=${articolo.productId}`)
                                                            : setEspanso({ ordineId: ordine.id, articoloId: articolo.id })
                                                    }
                                                    className={`flex items-center gap-4 p-4 w-full text-left transition-colors ${isEspanso ? "bg-indigo-50/60" : "hover:bg-gray-50"}`}
                                                >
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
                                                </button>

                                                {isEspanso && (
                                                    <div className="bg-indigo-50/60 px-4 pb-4">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="text-xs font-medium text-gray-600">Stato consegna</p>
                                                            <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${COLORI_STATO[ordine.tracking.stato]}`}>
                                                                {ordine.tracking.etichetta}
                                                            </span>
                                                        </div>
                                                        <TrackingOrdine tracking={ordine.tracking} />
                                                        <p className="text-[11px] text-gray-400">Clicca di nuovo per vederlo nello shop.</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
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
