# ShopLab

Demo e-commerce costruita con Next.js (App Router). Login/registrazione, catalogo prodotti, carrello, checkout con indirizzo di consegna, email transazionali, storico ordini con tracking simulato e gestione account.

## Funzionalità

- **Autenticazione**: registrazione e login con sessione via cookie JWT httpOnly, più recupero password via email con link a scadenza breve ([lib/auth.js](lib/auth.js))
- **Catalogo prodotti**: dati da [Fake Store API](https://fakestoreapi.com), ricerca e filtro per categoria ([app/dashboard](app/dashboard))
- **Carrello**: persistito nel database, selezione articoli per il checkout ([context/CarrelloContext.jsx](context/CarrelloContext.jsx))
- **Checkout**: form indirizzo di consegna con validazione Città/CAP contro l'elenco ufficiale dei comuni italiani e verifica della via tramite geocoding OpenStreetMap ([lib/indirizzo.js](lib/indirizzo.js)), suggerimento dell'ultimo indirizzo usato, pagamento finto (nessuna transazione reale)
- **Email transazionali**: conferma ordine e reset password inviate via [SendGrid](https://sendgrid.com) ([lib/mail.js](lib/mail.js))
- **Storico ordini**: pagina "I miei ordini" con tracking simulato (In elaborazione → Spedito → In consegna → Consegnato) calcolato dal tempo trascorso dalla conferma ([lib/tracking.js](lib/tracking.js))
- **Account**: cambio password e eliminazione account (con cascata su carrello e ordini) ([app/account](app/account))

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [Prisma](https://www.prisma.io) + PostgreSQL ([Neon](https://neon.tech))
- [SendGrid](https://sendgrid.com) per le email transazionali
- Tailwind CSS

## Setup locale

```bash
npm install
```

Crea un file `.env` nella root con:

```bash
DATABASE_URL="postgresql://..."          # connection string Postgres (es. Neon)
JWT_SECRET="una-stringa-segreta-lunga"
SENDGRID_API_KEY="SG...."                # da sendgrid.com, sezione API Keys
SENDGRID_FROM_EMAIL="tuo@indirizzo.it"   # deve essere verificato su SendGrid (Single Sender)
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
- Variabili d'ambiente da impostare sul progetto Vercel: `DATABASE_URL`, `JWT_SECRET`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
- Il push su `master` innesca un deploy automatico (progetto collegato al repo GitHub)

### Nota su SendGrid

Con la **Single Sender Verification** (un solo indirizzo email verificato, senza bisogno di un dominio proprio) SendGrid permette di inviare a qualsiasi destinatario, gratis fino a 100 email al giorno. Senza l'autenticazione di dominio (SPF/DKIM), alcune email possono finire nello spam del destinatario: è un limite noto di questa configurazione gratuita, superabile solo verificando un dominio vero su SendGrid.
