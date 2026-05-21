/*
  Warnings:

  - Added the required column `rol` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" DATETIME NOT NULL
);
INSERT INTO "new_Usuario" ("contrasena", "correo", "fechaActualizacion", "fechaCreacion", "id") SELECT "contrasena", "correo", "fechaActualizacion", "fechaCreacion", "id" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
