import { prisma } from "@/lib/prisma";
import { getUtenteCorrente } from "@/lib/auth";

export async function PATCH(request, { params }) {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const { cartItemId } = await params;
    const { selezionato } = await request.json();

    const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem || cartItem.userId !== utente.userId) {
        return Response.json({ errore: "Articolo non trovato" }, { status: 404 });
    }

    const aggiornato = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { selezionatoAt: selezionato ? new Date() : null },
    });

    return Response.json({ cartItem: { ...aggiornato, selezionato: !!selezionato } });
}
