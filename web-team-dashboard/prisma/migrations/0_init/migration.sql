-- CreateTable
CREATE TABLE "team_members" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "nome_attivita" VARCHAR(200) NOT NULL,
    "account_riferimento" VARCHAR(200) NOT NULL DEFAULT '',
    "tipologia_cliente" VARCHAR(3) NOT NULL,
    "servizio" VARCHAR(50) NOT NULL,
    "data_richiesta" DATE,
    "operatore_id" INTEGER,
    "fase_processo" VARCHAR(50) NOT NULL DEFAULT '',
    "seo_stato" VARCHAR(50) NOT NULL DEFAULT '',
    "scadenza" DATE,
    "note" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_history" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "operator_id" INTEGER,
    "data_inizio" DATE NOT NULL,
    "data_completamento" DATE,
    "servizio" VARCHAR(50) NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_snapshots" (
    "id" SERIAL NOT NULL,
    "mese" INTEGER NOT NULL,
    "anno" INTEGER NOT NULL,
    "clienti_attivi" INTEGER NOT NULL DEFAULT 0,
    "clienti_standby" INTEGER NOT NULL DEFAULT 0,
    "clienti_mantenimento" INTEGER NOT NULL DEFAULT 0,
    "data_json" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_snapshots_mese_anno_key" ON "monthly_snapshots"("mese", "anno");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_operatore_id_fkey" FOREIGN KEY ("operatore_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_history" ADD CONSTRAINT "project_history_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_history" ADD CONSTRAINT "project_history_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
