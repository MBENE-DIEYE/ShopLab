import comuni from "./data/comuni.json";

const normalizza = (s) =>
    s.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export const verificaCittaCap = (citta, cap) => {
    const comune = comuni.find((c) => normalizza(c.nome) === normalizza(citta));
    if (!comune) {
        return { valido: false, errore: "Città non riconosciuta" };
    }
    if (!comune.cap.includes(cap.trim())) {
        const capValidi =
            comune.cap.length <= 3
                ? comune.cap.join(", ")
                : `${comune.cap[0]}–${comune.cap[comune.cap.length - 1]}`;
        return { valido: false, errore: `Il CAP non corrisponde a ${comune.nome} (valido: ${capValidi})` };
    }
    return { valido: true };
};

// nessun dataset offline copre le vie di ogni comune italiano: interroga
// OpenStreetMap (Nominatim, gratuito) per verificare che la via esista nella città.
// Se il servizio non risponde non blocchiamo l'utente (fail-open).
export const verificaVia = async (via, citta, cap) => {
    const viaSenzaCivico = via.trim().replace(/\s*\d+\s*[a-z]?\s*$/i, "");
    const query = `${viaSenzaCivico}, ${cap} ${citta}, Italia`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=it&limit=5&q=${encodeURIComponent(query)}`;

    let risultati;
    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "ShopLab-Demo/1.0 (progetto dimostrativo)" },
        });
        if (!response.ok) return { valido: true };
        risultati = await response.json();
    } catch {
        return { valido: true };
    }

    if (risultati.length === 0) {
        return { valido: false, errore: `Via non trovata a ${citta}, controlla che sia scritta correttamente` };
    }

    const viaNormalizzata = normalizza(viaSenzaCivico);
    const trovata = risultati.some((r) => {
        const road = r.address?.road ? normalizza(r.address.road) : "";
        return road && (road.includes(viaNormalizzata) || viaNormalizzata.includes(road));
    });

    if (!trovata) {
        return { valido: false, errore: `Via non trovata a ${citta}, controlla che sia scritta correttamente` };
    }

    return { valido: true };
};
