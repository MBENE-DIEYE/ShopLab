import { prisma } from "@/lib/prisma";
import { getUtenteCorrente } from "@/lib/auth";

export async function GET() {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const ordini = await prisma.ordine.findMany({
        where: { userId: utente.userId },
        orderBy: { createdAt: "desc" },
        include: { articoli: true },
    });

    return Response.json({ ordini });
}
