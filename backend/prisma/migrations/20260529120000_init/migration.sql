CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USUARIO');
CREATE TYPE "CompetitionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELED');
CREATE TYPE "ScoringCriterion" AS ENUM ('PLACAR_EXATO', 'DIFERENCA_GOLS', 'VENCEDOR', 'ERROU');

CREATE TABLE "usuario" (
  "id_usuario" SERIAL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "login" TEXT NOT NULL UNIQUE,
  "senha_hash" TEXT NOT NULL,
  "tipo_usuario" "UserRole" NOT NULL DEFAULT 'USUARIO',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "competicao" (
  "id_competicao" SERIAL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "data_inicio" TIMESTAMP(3) NOT NULL,
  "status" "CompetitionStatus" NOT NULL DEFAULT 'DRAFT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "usuario_competicao" (
  "id_usuario" INTEGER NOT NULL,
  "id_competicao" INTEGER NOT NULL,
  "data_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "usuario_competicao_pkey" PRIMARY KEY ("id_usuario", "id_competicao"),
  CONSTRAINT "usuario_competicao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "usuario_competicao_id_competicao_fkey" FOREIGN KEY ("id_competicao") REFERENCES "competicao"("id_competicao") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "usuario_competicao_id_competicao_idx" ON "usuario_competicao" ("id_competicao");

CREATE TABLE "time" (
  "id_time" SERIAL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "jogador" (
  "id_jogador" SERIAL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "id_time" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "jogador_id_time_fkey" FOREIGN KEY ("id_time") REFERENCES "time"("id_time") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "jogador_id_time_idx" ON "jogador" ("id_time");

CREATE TABLE "partida" (
  "id_partida" SERIAL PRIMARY KEY,
  "equipe_1" INTEGER NOT NULL,
  "equipe_2" INTEGER NOT NULL,
  "placar_equipe_1" INTEGER,
  "placar_equipe_2" INTEGER,
  "id_competicao" INTEGER NOT NULL,
  "data_partida" TIMESTAMP(3) NOT NULL,
  "jogo_brasil" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "partida_id_competicao_fkey" FOREIGN KEY ("id_competicao") REFERENCES "competicao"("id_competicao") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "partida_equipe_1_fkey" FOREIGN KEY ("equipe_1") REFERENCES "time"("id_time") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "partida_equipe_2_fkey" FOREIGN KEY ("equipe_2") REFERENCES "time"("id_time") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "partida_times_distintos_check" CHECK ("equipe_1" <> "equipe_2"),
  CONSTRAINT "partida_placar_equipe_1_check" CHECK ("placar_equipe_1" IS NULL OR "placar_equipe_1" >= 0),
  CONSTRAINT "partida_placar_equipe_2_check" CHECK ("placar_equipe_2" IS NULL OR "placar_equipe_2" >= 0)
);

CREATE INDEX "partida_id_competicao_data_partida_idx" ON "partida" ("id_competicao", "data_partida");

CREATE TABLE "palpite" (
  "id_palpite" SERIAL PRIMARY KEY,
  "id_usuario" INTEGER NOT NULL,
  "id_partida" INTEGER NOT NULL,
  "placar_equipe_1" INTEGER NOT NULL,
  "placar_equipe_2" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "palpite_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "palpite_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partida"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "palpite_unico_usuario_partida" UNIQUE ("id_usuario", "id_partida"),
  CONSTRAINT "palpite_placar_equipe_1_check" CHECK ("placar_equipe_1" >= 0),
  CONSTRAINT "palpite_placar_equipe_2_check" CHECK ("placar_equipe_2" >= 0)
);

CREATE INDEX "palpite_id_partida_idx" ON "palpite" ("id_partida");

CREATE TABLE "palpite_gol_jogador" (
  "id_palpite" INTEGER NOT NULL,
  "id_jogador" INTEGER NOT NULL,
  "contador_gols" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "palpite_gol_jogador_pkey" PRIMARY KEY ("id_palpite", "id_jogador"),
  CONSTRAINT "palpite_gol_jogador_id_palpite_fkey" FOREIGN KEY ("id_palpite") REFERENCES "palpite"("id_palpite") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "palpite_gol_jogador_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "jogador"("id_jogador") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "palpite_gol_jogador_contador_check" CHECK ("contador_gols" >= 0)
);

CREATE INDEX "palpite_gol_jogador_id_jogador_idx" ON "palpite_gol_jogador" ("id_jogador");

CREATE TABLE "gols" (
  "id_partida" INTEGER NOT NULL,
  "id_jogador" INTEGER NOT NULL,
  "contador_gols" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "gols_pkey" PRIMARY KEY ("id_partida", "id_jogador"),
  CONSTRAINT "gols_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partida"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "gols_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "jogador"("id_jogador") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "gols_contador_check" CHECK ("contador_gols" >= 0)
);

CREATE INDEX "gols_id_jogador_idx" ON "gols" ("id_jogador");

CREATE TABLE "pontuacao_palpite_partida" (
  "id_pontuacao_palpite" SERIAL PRIMARY KEY,
  "id_palpite" INTEGER NOT NULL UNIQUE,
  "pontos_resultado" INTEGER NOT NULL DEFAULT 0,
  "pontos_gols_jogadores" INTEGER NOT NULL DEFAULT 0,
  "pontos_total" INTEGER NOT NULL DEFAULT 0,
  "criterio_resultado" "ScoringCriterion" NOT NULL DEFAULT 'ERROU',
  "jogo_brasil" BOOLEAN NOT NULL DEFAULT FALSE,
  "calculado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pontuacao_palpite_partida_id_palpite_fkey" FOREIGN KEY ("id_palpite") REFERENCES "palpite"("id_palpite") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "pontuacao_usuario_competicao" (
  "id_usuario" INTEGER NOT NULL,
  "id_competicao" INTEGER NOT NULL,
  "pontos_total" INTEGER NOT NULL DEFAULT 0,
  "quantidade_palpites" INTEGER NOT NULL DEFAULT 0,
  "quantidade_placar_exato" INTEGER NOT NULL DEFAULT 0,
  "quantidade_diferenca_gols" INTEGER NOT NULL DEFAULT 0,
  "quantidade_vencedor" INTEGER NOT NULL DEFAULT 0,
  "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pontuacao_usuario_competicao_pkey" PRIMARY KEY ("id_usuario", "id_competicao"),
  CONSTRAINT "pontuacao_usuario_competicao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "pontuacao_usuario_competicao_id_competicao_fkey" FOREIGN KEY ("id_competicao") REFERENCES "competicao"("id_competicao") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "pontuacao_usuario_competicao_id_competicao_pontos_total_idx" ON "pontuacao_usuario_competicao" ("id_competicao", "pontos_total" DESC);