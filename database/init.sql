CREATE DATABASE TorneosGamers;
GO
USE TorneosGamers;

CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY IDENTITY,
    nombre NVARCHAR(100),
    email NVARCHAR(100),
    telefono NVARCHAR(20),
    fecha_registro DATETIME DEFAULT GETDATE()
);

CREATE TABLE Torneos (
    id_torneo INT PRIMARY KEY IDENTITY,
    nombre NVARCHAR(100),
    juego NVARCHAR(50),
    formato NVARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE
);

CREATE TABLE Inscripciones (
    id_inscripcion INT PRIMARY KEY IDENTITY,
    id_usuario INT FOREIGN KEY REFERENCES Usuarios(id_usuario),
    id_torneo INT FOREIGN KEY REFERENCES Torneos(id_torneo),
    estado_confirmacion NVARCHAR(20)
);

CREATE TABLE Noticias (
    id_noticia INT PRIMARY KEY IDENTITY,
    titulo NVARCHAR(200),
    contenido NVARCHAR(MAX),
    fecha_publicacion DATETIME DEFAULT GETDATE()
);