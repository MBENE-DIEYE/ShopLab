import { verificaCittaCap } from "@/lib/indirizzo";

export async function POST(request) {
    const { citta, cap } = await request.json();
    if (!citta || !cap) {
        return Response.json({ valido: false, errore: "Compila città e CAP" }, { status: 400 });
    }
    return Response.json(verificaCittaCap(citta, cap));
}
