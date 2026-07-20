import { prisma } from "@/lib/prisma";
import { getUtenteCorrente, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function DELETE() {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    await prisma.user.delete({ where: { id: utente.userId } });

    const response = Response.json({ ok: true });
    response.headers.set("Set-Cookie", `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
    return response;
}
