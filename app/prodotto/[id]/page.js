"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCarrello } from "@/context/CarrelloContext";
import { traduciCategoria, richiedeTaglia, TAGLIE_DISPONIBILI } from "@/utils/categorie";
import { traduciDescrizione } from "@/utils/descrizioni";
import { formattaPrezzo } from "@/utils/valuta";
import Stelle from "@/components/Stelle";
import BarraIcone from "@/components/BarraIcone";

const ProdottoDettaglio = () => {
    const { id } = useParams();
    const router = useRouter();
    const { aggiungi, carrello } = useCarrello();
    const [prodotto, setProdotto] = useState(null);
    const [simili, setSimili] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(null);
    const [quantita, setQuantita] = useState(1);
    const [taglia, setTaglia] = useState(null);
    const [appenaAggiunto, setAppenaAggiunto] = useState(false);
    const [errorTaglia, setErrorTaglia] = useState(false);

    useEffect(() => {
        const fetchProdotto = async () => {
            setCaricamento(true);
            setErrore(null);
            setProdotto(null);
            setQuantita(1);
            setTaglia(null);
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                if (!response.ok) throw new Error("Errore nel caricamento del prodotto");
                const dati = await response.json();
                if (!dati) throw new Error("Prodotto non trovato");
                setProdotto(dati);

                const simileResponse = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(dati.category)}`);
                const simileDati = await simileResponse.json();
                setSimili(simileDati.filter((p) => p.id !== dati.id).slice(0, 4));
            } catch (err) {
                setErrore(err.message);
            } finally {
                setCaricamento(false);
            }
        }
        fetchProdotto();
        window.scrollTo(0, 0);
    }, [id])

    const handleAggiungi = () => {
        if (richiedeTaglia(prodotto.category) && !taglia) {
            setErrorTaglia(true);
            return;
        }
        aggiungi(prodotto, quantita, taglia);
        setAppenaAggiunto(true);
        setTimeout(() => setAppenaAggiunto(false), 1500);
    }

    if (caricamento) return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-6">
            <div className="max-w-4xl mx-auto animate-pulse">
                <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-80 bg-gray-200 rounded-2xl" />
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                        <div className="h-7 bg-gray-200 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
                        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6" />
                        <div className="h-12 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )

    if (errore) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-red-500 mb-4">{errore}</p>
                <Link href="/dashboard" className="text-indigo-600 font-medium hover:underline">← Torna ai prodotti</Link>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <BarraIcone />

            <div className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative h-80 md:h-96 bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-8">
                        <img src={prodotto.image} alt={prodotto.title} className="max-h-full max-w-full object-contain" />
                        {appenaAggiunto && (
                            <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[11px] font-medium px-2 py-1 rounded-full">
                                Aggiunto
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <span className="inline-block w-fit bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                            {traduciCategoria(prodotto.category)}
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{prodotto.title}</h1>
                        <Stelle rating={prodotto.rating} size="h-4 w-4" />
                        <p className="text-3xl font-bold text-gray-900 mt-4 mb-4">{formattaPrezzo(prodotto.price)}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">{traduciDescrizione(prodotto)}</p>

                        {richiedeTaglia(prodotto.category) && (
                            <div className="mb-4">
                                <span className="text-sm font-medium text-gray-600 block mb-2">Taglia</span>
                                <div className="flex gap-2">
                                    {TAGLIE_DISPONIBILI.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => { setTaglia(t); setErrorTaglia(false); }}
                                            className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${taglia === t ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 text-gray-700 hover:border-indigo-500 hover:bg-indigo-50"}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                {errorTaglia && <p className="text-red-500 text-xs mt-2">Seleziona una taglia</p>}
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm font-medium text-gray-600">Quantità</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setQuantita((q) => Math.max(1, q - 1))}
                                    className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                                >
                                    −
                                </button>
                                <span className="text-sm w-6 text-center">{quantita}</span>
                                <button
                                    onClick={() => setQuantita((q) => q + 1)}
                                    className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAggiungi}
                            className="w-full flex items-center justify-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-3 rounded-xl mt-auto transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Aggiungi al carrello
                        </button>
                    </div>
                </div>

                {simili.length > 0 && (
                    <div className="mt-14">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Prodotti simili</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {simili.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => router.push(`/prodotto/${p.id}`)}
                                    className="bg-white rounded-2xl border border-gray-100 p-3 text-left hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    <div className="h-24 w-full bg-gray-50 rounded-xl flex items-center justify-center mb-2">
                                        <img src={p.image} alt={p.title} className="h-16 w-16 object-contain" />
                                    </div>
                                    <p className="text-xs text-gray-800 line-clamp-2 mb-1">{p.title}</p>
                                    <p className="text-sm font-semibold text-gray-900">{formattaPrezzo(p.price)}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default ProdottoDettaglio;
