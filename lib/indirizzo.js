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
