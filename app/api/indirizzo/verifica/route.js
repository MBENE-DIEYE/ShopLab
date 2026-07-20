import { verificaCittaCap, verificaVia } from "@/lib/indirizzo";

export async function POST(request) {
    const { via, citta, cap } = await request.json();
    if (!via || !citta || !cap) {
        return Response.json({ valido: false, errore: "Compila via, città e CAP" }, { status: 400 });
    }

    const risultatoCittaCap = verificaCittaCap(citta, cap);
    if (!risultatoCittaCap.valido) {
        return Response.json(risultatoCittaCap);
    }

    const risultatoVia = await verificaVia(via, citta, cap);
    return Response.json(risultatoVia);
}
