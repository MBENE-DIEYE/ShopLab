import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const formattaArticoli = (items) =>
    items
        .map((item) => `<li>${item.title} × ${item.quantita}${item.taglia ? ` (taglia ${item.taglia})` : ""} — ${(item.price * item.quantita).toFixed(2)}€</li>`)
        .join("");

export const inviaConfermaOrdine = async ({ to, ordine, indirizzo, items, total }) => {
    await sgMail.send({
        from: process.env.SENDGRID_FROM_EMAIL,
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
};

export const inviaResetPassword = async ({ to, link }) => {
    await sgMail.send({
        from: process.env.SENDGRID_FROM_EMAIL,
        to,
        subject: "Reimposta la tua password",
        html: `
            <h2>Reimposta la password</h2>
            <p>Hai richiesto di reimpostare la password del tuo account ShopLab.</p>
            <p><a href="${link}">Clicca qui per scegliere una nuova password</a></p>
            <p>Il link scade tra 15 minuti. Se non hai richiesto tu il reset, ignora questa email.</p>
        `,
    });
};
