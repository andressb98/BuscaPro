import { z } from 'zod';

// Esquema para completar datos del Cliente
export const completarClienteSchema = z.object({
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  direccion: z.string().min(10, 'Proporciona una dirección completa'),
  urlIdentificacionOficial: z.string().url('Debe ser una URL válida (ej. link de S3 o Cloudinary)').optional().or(z.literal(''))
});

// Esquema para completar datos del Técnico
export const completarTecnicoSchema = z.object({
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  direccion: z.string().min(10, 'Proporciona una dirección completa'),
  formacion: z.string().min(5, 'Describe brevemente tu formación (ej. Técnico en Electricidad)'),
  experiencia: z.string().min(10, 'Describe tu experiencia laboral'),
  especializacionId: z.string().min(1, 'Debes seleccionar una especialización'),
  urlIdentificacionOficial: z.string().url('URL inválida').optional().or(z.literal('')),
  urlFotoPerfil: z.string().url('URL inválida').optional().or(z.literal(''))
});