"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CarrelloContext = createContext();

const arricchisciConProdotto = (cartItem, prodottiPerId) => {
    const p = prodottiPerId[cartItem.productId] ?? {};
    return {
        id: cartItem.productId,
        chiave: cartItem.id,
        quantita: cartItem.quantita,
        taglia: cartItem.taglia,
        selezionato: !!cartItem.selezionato,
        title: p.title,
        price: p.price,
        image: p.image,
        category: p.category,
        rating: p.rating,
    };
};

export const CarrelloProvider = ({ children }) => {
    const [carrello, setCarrello] = useState([]);

    const ricaricaCarrello = async () => {
        try {
            const [cartRes, prodottiRes] = await Promise.all([
                fetch("/api/cart"),
                fetch("https://fakestoreapi.com/products"),
            ]);
            if (!cartRes.ok) {
                setCarrello([]); // non autenticato (es. dopo logout): svuota anche lo stato locale
                return;
            }
            const { cartItems } = await cartRes.json();
            const prodotti = await prodottiRes.json();
            const prodottiPerId = Object.fromEntries(prodotti.map((p) => [p.id, p]));
            setCarrello(cartItems.map((item) => arricchisciConProdotto(item, prodottiPerId)));
        } catch {
            setCarrello([]);
        }
    };

    // il layout (e quindi questo Provider) resta montato tra una navigazione e l'altra:
    // questo effetto gira solo al primo caricamento della pagina, per questo login/logout
    // devono richiamare esplicitamente ricaricaCarrello() per aggiornare lo stato. Ricaricare
    // qui rivaluta anche la scadenza a 24h della selezione automatica lato server.
    useEffect(() => {
        ricaricaCarrello();
    }, []);

    const toggleSelezione = async (chiave) => {
        const item = carrello.find((i) => i.chiave === chiave);
        if (!item) return;
        const nuovoValore = !item.selezionato;
        setCarrello((prev) => prev.map((i) => (i.chiave === chiave ? { ...i, selezionato: nuovoValore } : i)));
        const response = await fetch(`/api/cart/${chiave}/selezione`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selezionato: nuovoValore }),
        });
        if (!response.ok) {
            setCarrello((prev) => prev.map((i) => (i.chiave === chiave ? { ...i, selezionato: !nuovoValore } : i)));
        }
    };

    const toggleSelezionaTutto = async () => {
        const tuttiSelezionati = carrello.length > 0 && carrello.every((item) => item.selezionato);
        const nuovoValore = !tuttiSelezionati;
        setCarrello((prev) => prev.map((i) => ({ ...i, selezionato: nuovoValore })));
        await Promise.all(
            carrello.map((item) =>
                fetch(`/api/cart/${item.chiave}/selezione`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ selezionato: nuovoValore }),
                })
            )
        );
    };

    const aggiungi = async (prodotto, quantita = 1, taglia = null) => {
        const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: prodotto.id, taglia, quantita }),
        });
        if (!response.ok) return;
        const { cartItem } = await response.json();

        setCarrello((prev) => {
            const esistente = prev.find((item) => item.chiave === cartItem.id);
            if (esistente) {
                return prev.map((item) => (item.chiave === cartItem.id ? { ...item, quantita: cartItem.quantita, selezionato: true } : item));
            }
            return [...prev, arricchisciConProdotto(cartItem, { [prodotto.id]: prodotto })];
        });
    };

    const diminuisci = async (chiave) => {
        const response = await fetch(`/api/cart/${chiave}`, { method: "PATCH" });
        if (!response.ok) return;
        const { cartItem } = await response.json();
        setCarrello((prev) => prev.map((item) => (item.chiave === chiave ? { ...item, quantita: cartItem.quantita } : item)));
    };

    const rimuovi = async (chiave) => {
        const response = await fetch(`/api/cart/${chiave}`, { method: "DELETE" });
        if (!response.ok) return;
        setCarrello((prev) => prev.filter((item) => item.chiave !== chiave));
    };

    return (
        <CarrelloContext.Provider value={{ carrello, aggiungi, rimuovi, diminuisci, toggleSelezione, toggleSelezionaTutto, ricaricaCarrello }}>
            {children}
        </CarrelloContext.Provider>
    );
};

export const useCarrello = () => useContext(CarrelloContext);
