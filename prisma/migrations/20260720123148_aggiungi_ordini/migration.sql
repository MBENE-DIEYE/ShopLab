-- CreateTable
CREATE TABLE "Ordine" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "indirizzo" JSONB NOT NULL,
    "totale" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ordine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticoloOrdinato" (
    "id" TEXT NOT NULL,
    "ordineId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantita" INTEGER NOT NULL,
    "taglia" TEXT,

    CONSTRAINT "ArticoloOrdinato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ordine_numero_key" ON "Ordine"("numero");

-- AddForeignKey
ALTER TABLE "Ordine" ADD CONSTRAINT "Ordine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticoloOrdinato" ADD CONSTRAINT "ArticoloOrdinato_ordineId_fkey" FOREIGN KEY ("ordineId") REFERENCES "Ordine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
