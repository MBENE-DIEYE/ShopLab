import { prisma } from "@/lib/prisma";
import { getUtenteCorrente } from "@/lib/auth";

export async function GET() {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: utente.userId },
        select: { ultimoIndirizzo: true },
    });

    return Response.json({ indirizzo: user?.ultimoIndirizzo ?? null });
}
