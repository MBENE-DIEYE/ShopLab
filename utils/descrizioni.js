const DESCRIZIONI_IT = {
    1: "Lo zaino perfetto per l'uso quotidiano e le passeggiate nel bosco. Riponi il tuo laptop (fino a 15 pollici) nella tasca imbottita, per ogni giorno.",
    2: "Vestibilità slim, maniche raglan a contrasto, chiusura a tre bottoni stile henley, tessuto leggero e morbido per un'indossabilità traspirante e comoda. Camicia con cuciture solide e collo rotondo, pensata per durare nel tempo e perfetta per un look casual.",
    3: "Ottima giacca da esterno per primavera/autunno/inverno, adatta a molte occasioni come lavoro, escursioni, campeggio, arrampicata, ciclismo o altre attività all'aperto. Un'ottima idea regalo per te o per un familiare.",
    4: "Il colore potrebbe variare leggermente tra schermo e realtà. Le corporature variano da persona a persona, quindi consigliamo di consultare le informazioni dettagliate sulle taglie nella descrizione del prodotto.",
    5: "Dalla nostra Collezione Legends, il Naga è ispirato al mitico drago d'acqua che protegge la perla dell'oceano. Indossalo rivolto verso l'interno per essere colmato di amore e abbondanza, o verso l'esterno per protezione.",
    6: "Soddisfazione garantita. Reso o cambio entro 30 giorni. Disegnato e venduto da Hafeez Center negli Stati Uniti.",
    7: "Anello classico con diamante solitario per proposta di matrimonio o fidanzamento. Un regalo prezioso per stupire chi ami in occasione di fidanzamento, matrimonio, anniversario o San Valentino.",
    8: "Orecchini tunnel a doppia svasatura placcati oro rosa. Realizzati in acciaio inossidabile 316L.",
    9: "Compatibilità USB 3.0 e USB 2.0, trasferimenti dati veloci, migliora le prestazioni del PC, alta capacità. Formattato NTFS per Windows 10, 8.1 e 7; potrebbe essere necessaria una riformattazione per altri sistemi operativi.",
    10: "Upgrade semplice per avvio, spegnimento, caricamento e risposta delle applicazioni più veloci. Migliora le prestazioni in scrittura, ideale per i carichi di lavoro tipici di un PC. Il perfetto equilibrio tra prestazioni e affidabilità.",
    11: "La tecnologia flash 3D NAND garantisce velocità di trasferimento elevate, per un avvio più rapido e prestazioni di sistema migliorate. Design sottile da 7mm adatto a Ultrabook e notebook ultra-sottili.",
    12: "Espandi la tua esperienza di gioco su PS4, gioca ovunque. Configurazione rapida e semplice, design elegante con alta capacità, garanzia limitata del produttore di 3 anni.",
    13: "Display widescreen Full HD (1920 x 1080) IPS da 21,5 pollici con tecnologia Radeon FreeSync. Design a cornice zero, ultra-sottile, tempo di risposta 4ms, pannello IPS, 16,7 milioni di colori.",
    14: "Monitor gaming curvo super ultrawide 32:9 da 49 pollici, equivalente a due schermi da 27 pollici affiancati. Tecnologia Quantum Dot (QLED) con supporto HDR, frequenza di aggiornamento 144Hz e tempo di risposta ultra rapido di 1ms.",
    15: "Nota: le taglie seguono lo standard USA, scegli la taglia che indossi di solito. Materiale: 100% poliestere, fodera removibile in pile caldo. Design 3-in-1 removibile per maggiore versatilità in base alla stagione.",
    16: "100% poliuretano (esterno), 100% poliestere (fodera). Similpelle per stile e comfort, 2 tasche frontali, giacca in stile denim con cappuccio removibile. Solo lavaggio a mano, non candeggiare, non stirare.",
    17: "Leggera, perfetta per un viaggio o per l'uso quotidiano. Maniche lunghe con cappuccio, vita regolabile con coulisse, chiusura anteriore con bottoni e zip, fantasia a righe. Due tasche laterali capienti.",
    18: "95% rayon, 5% elastan. Prodotto negli USA o importato. Tessuto leggero con ottima elasticità per il comfort, maniche e collo a coste, doppia cucitura sull'orlo inferiore.",
    19: "100% poliestere, lavabile in lavatrice. Leggero, comodo e altamente traspirante grazie al tessuto che allontana l'umidità. Collo a V morbido e vestibilità slanciata e femminile.",
    20: "95% cotone, 5% elastan. Casual, maniche corte, stampa con lettere, scollo a V. Tessuto morbido e leggermente elastico, adatto a occasioni casual, ufficio, spiaggia, scuola o tempo libero.",
};

export const traduciDescrizione = (prodotto) => DESCRIZIONI_IT[prodotto?.id] ?? prodotto?.description ?? "";
