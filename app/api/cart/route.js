import { prisma } from "@/lib/prisma";
import { getUtenteCorrente } from "@/lib/auth";
import { isSelezionatoAttivo } from "@/lib/selezione";

export async function GET() {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const cartItems = await prisma.cartItem.findMany({
        where: { userId: utente.userId },
        orderBy: { createdAt: "asc" },
    });
    const conSelezione = cartItems.map((item) => ({ ...item, selezionato: isSelezionatoAttivo(item.selezionatoAt) }));
    return Response.json({ cartItems: conSelezione });
}

export async function POST(request) {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const { productId, taglia = null, quantita = 1 } = await request.json();
    if (!productId) {
        return Response.json({ errore: "productId mancante" }, { status: 400 });
    }

    // niente upsert sull'indice composto: SQLite non considera due NULL uguali,
    // quindi per i prodotti senza taglia (taglia = null) l'upsert creerebbe
    // una riga duplicata a ogni aggiunta invece di incrementare la quantità.
    const esistente = await prisma.cartItem.findFirst({
        where: { userId: utente.userId, productId, taglia },
    });

    // aggiungere un prodotto (nuovo o già presente) lo seleziona subito per il checkout
    const cartItem = esistente
        ? await prisma.cartItem.update({
              where: { id: esistente.id },
              data: { quantita: { increment: quantita }, selezionatoAt: new Date() },
          })
        : await prisma.cartItem.create({
              data: { userId: utente.userId, productId, taglia, quantita, selezionatoAt: new Date() },
          });

    return Response.json({ cartItem: { ...cartItem, selezionato: true } });
}
