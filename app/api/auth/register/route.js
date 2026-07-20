import { prisma } from "@/lib/prisma";
import { hashPassword, creaToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return Response.json({ errore: "Compila tutti i campi" }, { status: 400 });
    }
    if (password.length < 6) {
        return Response.json({ errore: "La password deve avere almeno 6 caratteri" }, { status: 400 });
    }

    const esistente = await prisma.user.findUnique({ where: { email } });
    if (esistente) {
        return Response.json({ errore: "Esiste già un account con questa email" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    const token = await creaToken(user);

    const response = Response.json({ email: user.email });
    response.headers.set(
        "Set-Cookie",
        `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    );
    return response;
}
