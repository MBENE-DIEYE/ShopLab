"use client";
import Link from "next/link";
import { useCarrello } from "@/context/CarrelloContext";

const BarraIcone = () => {
    const { carrello } = useCarrello();

    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                <Link href="/dashboard" className="text-lg font-bold text-gray-900 shrink-0">ShopLab</Link>
                <div className="flex items-center gap-3">
                    <Link href="/account" title="Il mio account" className="flex items-center justify-center bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 shrink-0 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </Link>
                    <Link href="/carrello" title="Carrello" className="relative flex items-center justify-center bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 shrink-0 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.94-4.693 2.442-7.152.083-.402-.226-.774-.633-.774H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {carrello.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {carrello.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};
export default BarraIcone;
