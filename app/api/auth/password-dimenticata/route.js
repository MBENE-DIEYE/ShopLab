import { prisma } from "@/lib/prisma";
import { creaTokenReset } from "@/lib/auth";
import { inviaResetPassword } from "@/lib/mail";

export async function POST(request) {
    const { email } = await request.json();
    if (!email) {
        return Response.json({ errore: "Inserisci un'email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // risposta generica in ogni caso: non riveliamo se l'email esiste o no
    if (user) {
        const token = await creaTokenReset(user);
        const origin = new URL(request.url).origin;
        const link = `${origin}/reimposta-password?token=${token}`;
        try {
            await inviaResetPassword({ to: user.email, link });
        } catch (err) {
            console.error("Invio email reset password fallito:", err);
        }
    }

    return Response.json({ ok: true });
}
