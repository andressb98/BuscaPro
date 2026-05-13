import { z } from 'zod';

// Esquema para Login
export const loginSchema = z.object({
	correo: z.string().email({ message: 'Correo electrónico inválido' }),
	contrasena: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

// Ruta estricta: Registro de Cliente
export const registerClientSchema = z.object({
	correo: z.string().email({ message: 'Correo electrónico inválido' }),
	contrasena: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
	nombre: z.string().min(2, { message: 'El nombre es obligatorio' }),
	telefono: z.string().optional(),
	direccion: z.string().optional()
});

// Ruta estricta: Registro de Técnico
export const registerTechSchema = z.object({
	correo: z.string().email({ message: 'Correo electrónico inválido' }),
	contrasena: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
	nombre: z.string().min(2, { message: 'El nombre es obligatorio' }),
	telefono: z.string().optional(),
	categoriaId: z.string().min(1, { message: 'Debes seleccionar una categoría' })
});