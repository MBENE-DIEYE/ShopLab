# ShopLab

Demo e-commerce costruita con Next.js (App Router). Login/registrazione, catalogo prodotti, carrello, checkout con indirizzo di consegna, email di conferma ordine e storico ordini con tracking simulato.

## Funzionalità

- **Autenticazione**: registrazione e login con sessione via cookie JWT httpOnly ([lib/auth.js](lib/auth.js))
- **Catalogo prodotti**: dati da [Fake Store API](https://fakestoreapi.com), ricerca e filtro per categoria ([app/dashboard](app/dashboard))
- **Carrello**: persistito nel database, selezione articoli per il checkout ([context/CarrelloContext.jsx](context/CarrelloContext.jsx))
- **Checkout**: form indirizzo di consegna con validazione Città/CAP contro l'elenco ufficiale dei comuni italiani e verifica della via tramite geocoding OpenStreetMap ([lib/indirizzo.js](lib/indirizzo.js)), suggerimento dell'ultimo indirizzo usato, pagamento finto (nessuna transazione reale)
- **Email di conferma ordine**: inviata via [Resend](https://resend.com) al momento della conferma ([lib/mail.js](lib/mail.js))
- **Storico ordini**: pagina "I miei ordini" con tracking simulato (In elaborazione → Spedito → In consegna → Consegnato) calcolato dal tempo trascorso dalla conferma ([lib/tracking.js](lib/tracking.js))

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [Prisma](https://www.prisma.io) + PostgreSQL ([Neon](https://neon.tech))
- [Resend](https://resend.com) per le email transazionali
- Tailwind CSS

## Setup locale

```bash
npm install
```

Crea un file `.env` nella root con:

```bash
DATABASE_URL="postgresql://..."       # connection string Postgres (es. Neon)
JWT_SECRET="una-stringa-segreta-lunga"
RESEND_API_KEY="re_..."               # da resend.com
GMAIL_USER=""                          # non usato, vedi lib/mail.js se si passa a SMTP
```

Applica le migration e avvia il server:

```bash
npx prisma migrate deploy
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Deploy

Il progetto è pensato per [Vercel](https://vercel.com):

- `postinstall: prisma generate` rigenera il client Prisma ad ogni build
- Variabili d'ambiente da impostare sul progetto Vercel: `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`
- Il push su `master` innesca un deploy automatico (progetto collegato al repo GitHub)

### Nota su Resend

Senza un dominio verificato su Resend, le email di conferma ordine possono essere inviate solo all'indirizzo con cui è stato creato l'account Resend (limite del piano gratuito in modalità sandbox). Per inviare a qualsiasi cliente registrato serve verificare un dominio proprio su [resend.com/domains](https://resend.com/domains) e aggiornare l'indirizzo `from` in [lib/mail.js](lib/mail.js).
