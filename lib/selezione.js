export const SCADENZA_SELEZIONE_MS = 24 * 60 * 60 * 1000; // 24 ore

export const isSelezionatoAttivo = (selezionatoAt) => {
    if (!selezionatoAt) return false;
    return Date.now() - new Date(selezionatoAt).getTime() < SCADENZA_SELEZIONE_MS;
};
