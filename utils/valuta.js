const formattatore = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

export const formattaPrezzo = (valore) => formattatore.format(valore);
