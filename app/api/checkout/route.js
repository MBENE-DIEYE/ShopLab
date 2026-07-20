import { prisma } from "@/lib/prisma";
import { getUtenteCorrente } from "@/lib/auth";
import { inviaConfermaOrdine } from "@/lib/mail";

const numeroOrdine = () => `SL-${Math.floor(100000 + Math.random() * 900000)}`;

const creaOrdine = async ({ userId, indirizzo, items, total }, tentativi = 3) => {
    const numero = numeroOrdine();
    try {
        return await prisma.ordine.create({
            data: {
                numero,
                userId,
                indirizzo,
                totale: total,
                articoli: {
                    create: items.map((item) => ({
                        productId: item.id,
                        title: item.title,
                        image: item.image ?? null,
                        price: item.price,
                        quantita: item.quantita,
                        taglia: item.taglia ?? null,
                    })),
                },
            },
        });
    } catch (err) {
        if (err.code === "P2002" && tentativi > 0) {
            return creaOrdine({ userId, indirizzo, items, total }, tentativi - 1);
        }
        throw err;
    }
};

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

    const ordine = await creaOrdine({ userId: utente.userId, indirizzo, items, total });

    let emailInviata = true;
    try {
        await inviaConfermaOrdine({ to: utente.email, ordine: ordine.numero, indirizzo, items, total });
    } catch (err) {
        console.error("Invio email conferma ordine fallito:", err);
        emailInviata = false;
    }

    await prisma.user.update({
        where: { id: utente.userId },
        data: { ultimoIndirizzo: indirizzo },
    });

    return Response.json({ ordine: ordine.numero, emailInviata });
}
