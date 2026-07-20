import { getUtenteCorrente } from "@/lib/auth";
import { inviaConfermaOrdine } from "@/lib/mail";

const numeroOrdine = () => `SL-${Math.floor(100000 + Math.random() * 900000)}`;

export async function POST(request) {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const { indirizzo, items, total } = await request.json();
    if (!indirizzo?.nome || !indirizzo?.via || !indirizzo?.citta || !indirizzo?.cap) {
        return Response.json({ errore: "Indirizzo incompleto" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
        return Response.json({ errore: "Nessun articolo da ordinare" }, { status: 400 });
    }

    const ordine = numeroOrdine();
    let emailInviata = true;
    try {
        await inviaConfermaOrdine({ to: utente.email, ordine, indirizzo, items, total });
    } catch (err) {
        console.error("Invio email conferma ordine fallito:", err);
        emailInviata = false;
    }

    return Response.json({ ordine, emailInviata });
}
