"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCarrello } from "@/context/CarrelloContext";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mostraPassword, setMostraPassword] = useState(false)
    const [errore, setErrore] = useState("");
    const [caricamento, setCaricamento] = useState(false);
    const router = useRouter()
    const { ricaricaCarrello } = useCarrello();

    const entra = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrore("Compila tutti i campi")
            return;
        }
        setErrore("")
        setCaricamento(true)
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const dati = await response.json();
            if (!response.ok) {
                setErrore(dati.errore ?? "Errore durante l'accesso");
                return;
            }
            await ricaricaCarrello();
            router.push("/dashboard");
        } catch {
            setErrore("Errore di rete, riprova");
        } finally {
            setCaricamento(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white p-6">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="h-9 w-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">S</span>
                    <span className="text-lg font-bold text-gray-900">ShopLab</span>
                </div>

                <form onSubmit={entra} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Accedi</h1>
                    <p className="text-sm text-gray-500 mb-6">Inserisci le tue credenziali per continuare</p>

                    {errore && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            {errore}
                        </div>
                    )}

                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                    <div className="relative mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <input
                            type="email"
                            placeholder="nome@esempio.it"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                        />
                    </div>

                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                    <div className="relative mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <input
                            type={mostraPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setMostraPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {mostraPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <Link href="/password-dimenticata" className="block text-xs text-indigo-600 hover:underline mb-6">Password dimenticata?</Link>

                    <button type="submit" disabled={caricamento} className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                        {caricamento ? "Accesso in corso..." : "Accedi"}
                    </button>

                    <p className="text-sm text-gray-500 text-center mt-4">
                        Non hai un account? <Link href="/register" className="text-indigo-600 font-medium hover:underline">Registrati</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
export default Login;
