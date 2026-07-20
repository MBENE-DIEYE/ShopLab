import { getUtenteCorrente } from "@/lib/auth";

export async function GET() {
    const utente = await getUtenteCorrente();
    if (!utente) {
        return Response.json({ utente: null }, { status: 401 });
    }
    return Response.json({ utente: { id: utente.userId, email: utente.email } });
}
