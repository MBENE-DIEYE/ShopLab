import { prisma } from "@/lib/prisma";
import { verifyPassword, creaToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return Response.json({ errore: "Compila tutti i campi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return Response.json({ errore: "Email o password non corretti" }, { status: 401 });
    }

    const passwordOk = await verifyPassword(password, user.passwordHash);
    if (!passwordOk) {
        return Response.json({ errore: "Email o password non corretti" }, { status: 401 });
    }

    const token = await creaToken(user);
    const response = Response.json({ email: user.email });
    response.headers.set(
        "Set-Cookie",
        `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    );
    return response;
}
