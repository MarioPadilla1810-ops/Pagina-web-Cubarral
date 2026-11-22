CREATE DATABASE IF NOT EXISTS ecoturismo_cubarral_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecoturismo_cubarral_db;

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  tipo_entidad ENUM('Servicio', 'Atractivo') NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS operadores (
  id_operador INT AUTO_INCREMENT PRIMARY KEY,
  nombre_comercial VARCHAR(150) NOT NULL,
  representante VARCHAR(120),
  whatsapp_comercial VARCHAR(20) NOT NULL,
  verificado BOOLEAN DEFAULT TRUE,
  fecha_verificacion DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS servicios_atractivos (
  id_item INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  id_operador INT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  tarifa_referencial VARCHAR(100) NOT NULL,
  horario VARCHAR(100) NOT NULL,
  ubicacion_texto VARCHAR(150) NOT NULL,
  url_mapa VARCHAR(255) NOT NULL,
  imagen_url VARCHAR(255),
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
  FOREIGN KEY (id_operador) REFERENCES operadores(id_operador) ON DELETE SET NULL
);
