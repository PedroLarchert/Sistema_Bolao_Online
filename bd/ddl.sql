

CREATE TABLE palpite (
    id_palpite SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_partida INTEGER NOT NULL,
    placar_equipe_1 INTEGER NOT NULL,
    placar_equipe_2 INTEGER NOT NULL

);


CREATE TABLE Usuario (
    id_usuario INTEGER PRIMARY KEY,
    nome VARCHAR,
    senha VARCHAR,
    login VARCHAR
);

CREATE TABLE partida (
    id_partida INTEGER PRIMARY KEY,
    equipe_1 INTEGER,
    equipe_2 INTEGER,
    placar_equipe_1 INTEGER,
    placar_equipe_2 INTEGER,
    id_competicao INTEGER,
    data_partida TIMESTAMP
);

CREATE TABLE Time (
    id_time INTEGER PRIMARY KEY,
    Nome VARCHAR
);

CREATE TABLE Jogador (
    id_jogador INTEGER PRIMARY KEY,
    nome VARCHAR,
    id_time INTEGER
);

CREATE TABLE Competicao (
    id_competição INTEGER PRIMARY KEY,
    nome VARCHAR,
    data_inicio TIMESTAMP
);

CREATE TABLE time_competicao (
    id_time INTEGER,
    id_competicao INTEGER,
    PRIMARY KEY (id_time, id_competicao)
);


CREATE TABLE gols (
    id_partida INTEGER,
    id_jogador INTEGER,
    contador_gols INTEGER,
    PRIMARY KEY (id_partida, id_jogador)
);

CREATE TABLE palpite_gol_jogador (
    id_palpite INTEGER,
    id_jogador INTEGER,
    contador_gols INTEGER,
    PRIMARY KEY (id_palpite, id_jogador)
);
 

CREATE TABLE pontuacao_usuario_competicao (
    id_usuario INTEGER NOT NULL,
    id_competicao INTEGER NOT NULL,

    pontos_total INTEGER NOT NULL DEFAULT 0,
    quantidade_palpites INTEGER NOT NULL DEFAULT 0,
    quantidade_placar_exato INTEGER NOT NULL DEFAULT 0,
    quantidade_diferenca_gols INTEGER NOT NULL DEFAULT 0,
    quantidade_vencedor INTEGER NOT NULL DEFAULT 0,

    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_competicao),

    CONSTRAINT fk_pontuacao_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),

    CONSTRAINT fk_pontuacao_competicao
        FOREIGN KEY (id_competicao) REFERENCES competicao(id_competição)
);




CREATE TABLE pontuacao_palpite_partida (
    id_pontuacao_palpite SERIAL PRIMARY KEY,
    id_palpite INTEGER NOT NULL UNIQUE,

    pontos_resultado INTEGER NOT NULL DEFAULT 0,
    pontos_gols_jogadores INTEGER NOT NULL DEFAULT 0,
    pontos_total INTEGER NOT NULL DEFAULT 0,

    criterio_resultado VARCHAR(30),
    -- exemplos:
    -- 'PLACAR_EXATO'
    -- 'DIFERENCA_GOLS'
    -- 'VENCEDOR'
    -- 'ERROU'

    jogo_brasil BOOLEAN NOT NULL DEFAULT FALSE,

    calculado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pontuacao_palpite
        FOREIGN KEY (id_palpite) REFERENCES palpite(id_palpite)
);

ALTER TABLE partida ADD CONSTRAINT FK_partida_2
    FOREIGN KEY (id_competicao)
    REFERENCES Competicao (id_competição);
 
ALTER TABLE partida ADD CONSTRAINT FK_partida_3
    FOREIGN KEY (equipe_1)
    REFERENCES Time (id_time);
 
ALTER TABLE partida ADD CONSTRAINT FK_partida_4
    FOREIGN KEY (equipe_2)
    REFERENCES Time (id_time);
 
 
ALTER TABLE Jogador ADD CONSTRAINT FK_Jogador_2
    FOREIGN KEY (id_time)
    REFERENCES Time (id_time);
 
ALTER TABLE time_competicao ADD CONSTRAINT FK_time_competicao_2
    FOREIGN KEY (id_competicao)
    REFERENCES Competicao (id_competição);
 
ALTER TABLE time_competicao ADD CONSTRAINT FK_time_competicao_3
    FOREIGN KEY (id_time)
    REFERENCES Time (id_time);
 
ALTER TABLE palpite ADD CONSTRAINT FK_palpite_2
    FOREIGN KEY (id_usuario)
    REFERENCES Usuario (id_usuario);
 
ALTER TABLE palpite ADD CONSTRAINT FK_palpite_3
    FOREIGN KEY (id_partida)
    REFERENCES partida (id_partida);
 
ALTER TABLE gols ADD CONSTRAINT FK_gols_2
    FOREIGN KEY (id_jogador)
    REFERENCES Jogador (id_jogador);
 
ALTER TABLE gols ADD CONSTRAINT FK_gols_3
    FOREIGN KEY (id_partida)
    REFERENCES partida (id_partida);
 
ALTER TABLE palpite_gol_jogador ADD CONSTRAINT FK_palpite_gol_jogador_2
    FOREIGN KEY (id_jogador)
    REFERENCES Jogador (id_jogador);
 
ALTER TABLE palpite_gol_jogador ADD CONSTRAINT FK_palpite_gol_jogador_3
    FOREIGN KEY (id_palpite)
    REFERENCES palpite (id_palpite);



 ALTER TABLE palpite ADD  CONSTRAINT uk_palpite_usuario_partida UNIQUE (id_usuario, id_partida);

   ALTER TABLE palpite ADD   CONSTRAINT fk_palpite_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);

    ALTER TABLE palpite ADD   CONSTRAINT fk_palpite_partida
        FOREIGN KEY (id_partida) REFERENCES partida(id_partida);
    
    CREATE TABLE usuario_competicao (
    id_usuario INTEGER NOT NULL,
    id_competicao INTEGER NOT NULL,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_competicao),

    CONSTRAINT fk_usuario_competicao_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_usuario_competicao_competicao
        FOREIGN KEY (id_competicao)
        REFERENCES competicao(id_competição)
);