import { prisma } from "@/lib/prisma";
import { getUtenteCorrente, verifyPassword, hashPassword } from "@/lib/auth";

export async function PATCH(request) {
    const utente = await getUtenteCorrente();
    if (!utente) return Response.json({ errore: "Non autenticato" }, { status: 401 });

    const { passwordAttuale, nuovaPassword } = await request.json();
    if (!passwordAttuale || !nuovaPassword) {
        return Response.json({ errore: "Compila tutti i campi" }, { status: 400 });
    }
    if (nuovaPassword.length < 6) {
        return Response.json({ errore: "La nuova password deve avere almeno 6 caratteri" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: utente.userId } });
    const passwordOk = await verifyPassword(passwordAttuale, user.passwordHash);
    if (!passwordOk) {
        return Response.json({ errore: "Password attuale errata" }, { status: 401 });
    }

    const passwordHash = await hashPassword(nuovaPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    return Response.json({ ok: true });
}
