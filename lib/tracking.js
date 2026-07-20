const FASI = [
    { chiave: "in_elaborazione", etichetta: "In elaborazione", minuti: 0 },
    { chiave: "spedito", etichetta: "Spedito", minuti: 2 },
    { chiave: "in_consegna", etichetta: "In consegna", minuti: 5 },
    { chiave: "consegnato", etichetta: "Consegnato", minuti: 10 },
];

export const calcolaTracking = (createdAt) => {
    const minutiTrascorsi = (Date.now() - new Date(createdAt).getTime()) / 60000;
    let indice = 0;
    FASI.forEach((fase, i) => {
        if (minutiTrascorsi >= fase.minuti) indice = i;
    });
    return {
        stato: FASI[indice].chiave,
        etichetta: FASI[indice].etichetta,
        indice,
        fasi: FASI.map((f) => f.etichetta),
    };
};
