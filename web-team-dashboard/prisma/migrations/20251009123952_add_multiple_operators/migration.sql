-- CreateTable
CREATE TABLE "client_operators" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "team_member_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_operators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_operators_client_id_team_member_id_key" ON "client_operators"("client_id", "team_member_id");

-- AddForeignKey
ALTER TABLE "client_operators" ADD CONSTRAINT "client_operators_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_operators" ADD CONSTRAINT "client_operators_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data from clients.operatore_id to client_operators
INSERT INTO "client_operators" ("client_id", "team_member_id", "assigned_at")
SELECT id, operatore_id, created_at
FROM clients
WHERE operatore_id IS NOT NULL;

-- Drop old column
ALTER TABLE "clients" DROP COLUMN "operatore_id";
