CREATE TABLE children (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL CHECK (edad >= 0),
    padre_id BIGINT REFERENCES parents (id) ON DELETE CASCADE,
    minecraft BOOLEAN DEFAULT FALSE,
    roblox BOOLEAN DEFAULT FALSE,
    stumble_guys BOOLEAN DEFAULT FALSE
);

CREATE TABLE parents (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(255) UNIQUE,
    contrasena VARCHAR(255) UNIQUE,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE coaches (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(255) UNIQUE,
    contrasena VARCHAR(255) UNIQUE,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(255) UNIQUE,
    contrasena VARCHAR(255) UNIQUE
);

CREATE TABLE attendances (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    act_eleccion_juego INT DEFAULT 0,
    act_perder INT DEFAULT 0,
    negociar INT DEFAULT 0,
    convivencia INT DEFAULT 0,
    comentarios TEXT,
    nino_id BIGINT REFERENCES children (id) ON DELETE CASCADE,
    coach_id BIGINT REFERENCES coaches (id) ON DELETE SET NULL
);