import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const formattaArticoli = (items) =>
    items
        .map((item) => `<li>${item.title} × ${item.quantita}${item.taglia ? ` (taglia ${item.taglia})` : ""} — ${(item.price * item.quantita).toFixed(2)}€</li>`)
        .join("");

export const inviaConfermaOrdine = async ({ to, ordine, indirizzo, items, total }) => {
    const { error } = await resend.emails.send({
        from: "ShopLab <onboarding@resend.dev>",
        to,
        subject: `Ordine confermato — ${ordine}`,
        html: `
            <h2>Grazie per il tuo ordine!</h2>
            <p>Numero ordine: <strong>${ordine}</strong></p>
            <p>Consegna a: ${indirizzo.nome}, ${indirizzo.via}, ${indirizzo.cap} ${indirizzo.citta}</p>
            <ul>${formattaArticoli(items)}</ul>
            <p><strong>Totale: ${total.toFixed(2)}€</strong></p>
        `,
    });
    if (error) throw new Error(error.message);
};
