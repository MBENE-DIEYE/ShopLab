import { prisma } from "@/lib/prisma";
import { getUtenteCorrente } from "@/lib/auth";
import { calcolaTracking } from "@/lib/tracking";

export async function GET() {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const ordini = await prisma.ordine.findMany({
        where: { userId: utente.userId },
        orderBy: { createdAt: "desc" },
        include: { articoli: true },
    });

    const conTracking = ordini.map((ordine) => ({
        ...ordine,
        tracking: calcolaTracking(ordine.createdAt),
    }));

    return Response.json({ ordini: conTracking });
}
