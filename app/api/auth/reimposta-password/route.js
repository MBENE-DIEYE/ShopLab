import { prisma } from "@/lib/prisma";
import { verificaTokenReset, hashPassword } from "@/lib/auth";

export async function POST(request) {
    const { token, nuovaPassword } = await request.json();
    if (!token || !nuovaPassword) {
        return Response.json({ errore: "Richiesta non valida" }, { status: 400 });
    }
    if (nuovaPassword.length < 6) {
        return Response.json({ errore: "La password deve avere almeno 6 caratteri" }, { status: 400 });
    }

    const payload = await verificaTokenReset(token);
    if (!payload) {
        return Response.json({ errore: "Link scaduto o non valido, richiedine uno nuovo" }, { status: 401 });
    }

    const passwordHash = await hashPassword(nuovaPassword);
    await prisma.user.update({ where: { id: payload.userId }, data: { passwordHash } });

    return Response.json({ ok: true });
}
