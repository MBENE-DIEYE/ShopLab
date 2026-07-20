import { prisma } from "@/lib/prisma";
import { getUtenteCorrente } from "@/lib/auth";

const trovaRigaDelUtente = async (utente, cartItemId) => {
    const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem || cartItem.userId !== utente.userId) return null;
    return cartItem;
};

export async function PATCH(request, { params }) {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const { cartItemId } = await params;
    const cartItem = await trovaRigaDelUtente(utente, cartItemId);
    if (!cartItem) return Response.json({ errore: "Articolo non trovato" }, { status: 404 });

    if (cartItem.quantita <= 1) {
        return Response.json({ cartItem });
    }

    const aggiornato = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantita: { decrement: 1 } },
    });
    return Response.json({ cartItem: aggiornato });
}

export async function DELETE(request, { params }) {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const { cartItemId } = await params;
    const cartItem = await trovaRigaDelUtente(utente, cartItemId);
    if (!cartItem) return Response.json({ errore: "Articolo non trovato" }, { status: 404 });

    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return Response.json({ ok: true });
}
