import { z } from 'zod';

export const loginSchema = z.object({
	correo: z.string().email({ message: 'Correo inválido' }),
	contrasena: z.string().min(6, { message: 'Mínimo 6 caracteres' })
});

export const registerClientSchema = z.object({
	correo: z.string().email({ message: 'Correo inválido' }),
	contrasena: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
	nombre: z.string().min(2, { message: 'Nombre requerido' }),
	telefono: z.string().min(10, { message: 'Teléfono inválido' }),
	direccion: z.string().min(5, { message: 'Dirección requerida' })
});

export const registerTechSchema = z.object({
	correo: z.string().email({ message: 'Correo inválido' }),
	contrasena: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
	nombre: z.string().min(2, { message: 'Nombre requerido' }),
	telefono: z.string().min(10, { message: 'Teléfono inválido' }),
	categoriaId: z.string().min(1, { message: 'Debes seleccionar una categoría' })
});