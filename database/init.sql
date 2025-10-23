-- Script de inicialización de base de datos
-- Autor: Hugo Francisco Luis Inclán
-- Base de datos: hugo_francisco_luis_inclan_db

USE hugo_francisco_luis_inclan_db;

-- Crear tabla de canciones favoritas
CREATE TABLE IF NOT EXISTS canciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    artista VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    url VARCHAR(500) NOT NULL,
    genero VARCHAR(100),
    anio INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_artista (artista),
    INDEX idx_genero (genero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO canciones (nombre, artista, album, url, genero, anio) VALUES
('Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 'Rock', 1975),
('Imagine', 'John Lennon', 'Imagine', 'https://www.youtube.com/watch?v=YkgkThdzX-8', 'Pop', 1971),
('Hotel California', 'Eagles', 'Hotel California', 'https://www.youtube.com/watch?v=09839DpTctU', 'Rock', 1976),
('Billie Jean', 'Michael Jackson', 'Thriller', 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y', 'Pop', 1982),
('Smells Like Teen Spirit', 'Nirvana', 'Nevermind', 'https://www.youtube.com/watch?v=hTWKbfoikeg', 'Grunge', 1991);

-- Verificar datos insertados
SELECT 'Tabla canciones creada e inicializada correctamente' AS mensaje;
SELECT COUNT(*) AS total_canciones FROM canciones;