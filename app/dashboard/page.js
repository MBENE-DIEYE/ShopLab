"use client";
import { useState, useEffect, Suspense } from "react";
import { useCarrello } from "@/context/CarrelloContext";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { traduciCategoria, richiedeTaglia, TAGLIE_DISPONIBILI } from "@/utils/categorie";
import Stelle from "@/components/Stelle";

const Dashboard = () => (
    <Suspense>
        <DashboardContenuto />
    </Suspense>
)

const DashboardContenuto = () => {
    const [prodotti, setProdotti] = useState([]);
    const [caricamento, setCaricamento] = useState(true)
    const [errore, setErrore] = useState(null);
    const { aggiungi, carrello, ricaricaCarrello } = useCarrello();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const highlightId = searchParams.get("highlight");
    const [selezionato, setSelezionato] = useState(highlightId ? Number(highlightId) : null);
    const [ricerca, setRicerca] = useState("");
    const [categoria, setCategoria] = useState("tutte");
    const [appenaAggiunto, setAppenaAggiunto] = useState(null);
    const [prodottoTaglia, setProdottoTaglia] = useState(null);

    const confermaAggiunta = (p) => {
        aggiungi(p);
        setAppenaAggiunto(p.id);
        setTimeout(() => setAppenaAggiunto((prev) => (prev === p.id ? null : prev)), 1200);
    }

    const handleAggiungi = (e, p) => {
        e.stopPropagation();
        if (richiedeTaglia(p.category)) {
            setProdottoTaglia(p);
            return;
        }
        confermaAggiunta(p);
    }

    const scegliTaglia = (taglia) => {
        aggiungi(prodottoTaglia, 1, taglia);
        setAppenaAggiunto(prodottoTaglia.id);
        setTimeout(() => setAppenaAggiunto((prev) => (prev === prodottoTaglia.id ? null : prev)), 1200);
        setProdottoTaglia(null);
    }

    const esci = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        await ricaricaCarrello();
        router.push("/");
    }

    useEffect(() => {
        const fetchProdotti = async () => {
            try {
                const response = await fetch("https://fakestoreapi.com/products");
                if (!response.ok) throw new Error("Error nel caricamento")
                const dati = await response.json()
                setProdotti(dati);
            } catch (err) {
                setErrore(err.message)
            }
            finally {
                setCaricamento(false)
            }
        }
        fetchProdotti()
    }, [])

    useEffect(() => {
        if (!highlightId || prodotti.length === 0) return
        const el = document.getElementById(`prodotto-${highlightId}`)
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
        router.replace(pathname)
    }, [highlightId, prodotti])

    if (errore) return <p className="p-8 text-red-500">{errore}</p>

    const categorie = ["tutte", ...new Set(prodotti.map((p) => p.category))];
    const prodottiFiltrati = prodotti.filter((p) =>
        (categoria === "tutte" || p.category === categoria) &&
        p.title.toLowerCase().includes(ricerca.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
                    <h1 className="text-lg font-bold text-gray-900 shrink-0">ShopLab</h1>
                    <div className="relative flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                        </svg>
                        <input
                            type="text"
                            value={ricerca}
                            onChange={(e) => setRicerca(e.target.value)}
                            placeholder="Cerca prodotti..."
                            className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                        />
                    </div>
                    <Link href="/carrello" className="relative flex items-center justify-center bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 shrink-0 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.94-4.693 2.442-7.152.083-.402-.226-.774-.633-.774H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {carrello.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {carrello.length}
                            </span>
                        )}
                    </Link>
                    <button onClick={esci} title="Esci" className="flex items-center justify-center bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 shrink-0 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>
                </div>
                {!caricamento && categorie.length > 1 && (
                    <div className="max-w-6xl mx-auto px-6 pb-3 flex gap-2 overflow-x-auto">
                        {categorie.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategoria(c)}
                                className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${categoria === c ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                            >
                                {c === "tutte" ? "Tutte" : traduciCategoria(c)}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            <div className="max-w-6xl mx-auto p-6">
                {caricamento ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 animate-pulse">
                                <div className="h-40 w-full bg-gray-200 rounded-xl mb-4" />
                                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                                <div className="h-3 bg-gray-200 rounded mb-4 w-1/2" />
                                <div className="h-4 bg-gray-200 rounded mb-4 w-1/4" />
                                <div className="h-10 bg-gray-200 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : prodottiFiltrati.length === 0 ? (
                    <p className="text-center text-gray-500 py-16">Nessun prodotto trovato.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {prodottiFiltrati.map((p) =>
                            <div
                                key={p.id}
                                id={`prodotto-${p.id}`}
                                onClick={() => setSelezionato((prev) => (prev === p.id ? null : p.id))}
                                className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden ${p.id === selezionato ? "ring-2 ring-indigo-500" : ""}`}
                            >
                                <Link href={`/prodotto/${p.id}`} onClick={(e) => e.stopPropagation()} className="relative h-44 w-full bg-gray-50 overflow-hidden block">
                                    <img src={p.image} alt={p.title} className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                                    <span className="absolute top-3 left-3 bg-neutral-900/80 text-white text-xs font-medium px-2 py-1 rounded-full">
                                        {traduciCategoria(p.category)}
                                    </span>
                                    {appenaAggiunto === p.id && (
                                        <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[11px] font-medium px-2 py-1 rounded-full">
                                            Aggiunto
                                        </span>
                                    )}
                                </Link>
                                <div className="p-4 flex flex-col flex-1">
                                    <Link href={`/prodotto/${p.id}`} onClick={(e) => e.stopPropagation()} className="block font-medium text-sm text-gray-800 line-clamp-2 mb-1.5 hover:text-indigo-600 transition-colors">
                                        {p.title}
                                    </Link>
                                    <Stelle rating={p.rating} />
                                    <div className="flex items-center justify-between mt-2 mb-3">
                                        <span className="text-lg font-bold text-gray-900">{p.price}€</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleAggiungi(e, p)}
                                        className="w-full flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl mt-auto hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Aggiungi
                                    </button>
                                </div>
                            </div>)}
                    </div>
                )}
            </div>

            {prodottoTaglia && (
                <div
                    onClick={() => setProdottoTaglia(null)}
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl w-full max-w-sm p-5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-gray-900">Scegli la taglia</h2>
                            <button onClick={() => setProdottoTaglia(null)} className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                <img src={prodottoTaglia.image} alt={prodottoTaglia.title} className="h-9 w-9 object-contain" />
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">{prodottoTaglia.title}</p>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {TAGLIE_DISPONIBILI.map((taglia) => (
                                <button
                                    key={taglia}
                                    onClick={() => scegliTaglia(taglia)}
                                    className="py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                >
                                    {taglia}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Dashboard;
