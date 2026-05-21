-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "urlIdentificacionOficial" TEXT,
    CONSTRAINT "Cliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tecnico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "urlIdentificacionOficial" TEXT,
    "urlFotoPerfil" TEXT,
    "formacion" TEXT,
    "experiencia" TEXT,
    "estaVerificado" BOOLEAN NOT NULL DEFAULT false,
    "especializacionId" TEXT NOT NULL,
    CONSTRAINT "Tecnico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tecnico_especializacionId_fkey" FOREIGN KEY ("especializacionId") REFERENCES "Especializacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Especializacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "tecnicoId" TEXT NOT NULL,
    "fechaProgramada" DATETIME NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "montoTotal" REAL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" DATETIME NOT NULL,
    CONSTRAINT "Cita_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cita_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Tecnico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citaId" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "metodo" TEXT,
    "fechaPago" DATETIME,
    CONSTRAINT "Pago_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "Cita" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "destinatarioId" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Calificacion_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "Cita" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Calificacion_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Calificacion_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SesionChat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citaId" TEXT,
    "clienteId" TEXT NOT NULL,
    "tecnicoId" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SesionChat_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "Cita" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SesionChat_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SesionChat_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Tecnico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sesionChatId" TEXT NOT NULL,
    "remitenteId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mensaje_sesionChatId_fkey" FOREIGN KEY ("sesionChatId") REFERENCES "SesionChat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mensaje_remitenteId_fkey" FOREIGN KEY ("remitenteId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_usuarioId_key" ON "Cliente"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Tecnico_usuarioId_key" ON "Tecnico"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Especializacion_nombre_key" ON "Especializacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_citaId_key" ON "Pago"("citaId");

-- CreateIndex
CREATE UNIQUE INDEX "Calificacion_citaId_key" ON "Calificacion"("citaId");

-- CreateIndex
CREATE UNIQUE INDEX "SesionChat_citaId_key" ON "SesionChat"("citaId");
