import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcrypt';
import { registerClientSchema, registerTechSchema } from '$lib/server/schemas/register.schemas';

export const load: PageServerLoad = async ({ locals }) => {
	// Si ya está logueado, redirigir
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}
	
	// Pre-cargar categorías para el formulario de técnicos
	const categorias = await prisma.categoria.findMany({
		select: { id: true, nombre: true }
	});
	
	return { categorias };
};

export const actions: Actions = {
	registerClient: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parsed = registerClientSchema.safeParse(formData);

		if (!parsed.success) {
			return fail(400, { formError: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors, clientData: formData });
		}

		const { correo, contrasena, nombre, telefono, direccion } = parsed.data;

		try {
			const userExists = await prisma.usuario.findUnique({ where: { correo } });
			if (userExists) return fail(400, { formError: 'El correo ya está registrado', clientData: formData });

			const hashedPassword = await bcrypt.hash(contrasena, 12);

			// Inserción anidada: Usuario + Cliente
			const nuevoUsuario = await prisma.usuario.create({
				data: {
					correo,
					contrasena: hashedPassword,
					cliente: {
						create: { nombre, telefono, direccion }
					}
				}
			});

			cookies.set('session_id', nuevoUsuario.id, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
		} catch (error) {
			console.error(error);
			return fail(500, { formError: 'Error interno del servidor' });
		}

		throw redirect(303, '/dashboard');
	},

	registerTecnico: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parsed = registerTechSchema.safeParse(formData);

		if (!parsed.success) {
			return fail(400, { formError: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors, techData: formData });
		}

		const { correo, contrasena, nombre, telefono, categoriaId } = parsed.data;

		try {
			// Validación de regla de negocio: ¿Existe la categoría?
			const catExists = await prisma.categoria.findUnique({ where: { id: categoriaId } });
			if (!catExists) return fail(400, { formError: 'Categoría no válida', techData: formData });

			const userExists = await prisma.usuario.findUnique({ where: { correo } });
			if (userExists) return fail(400, { formError: 'El correo ya está registrado', techData: formData });

			const hashedPassword = await bcrypt.hash(contrasena, 12);

			// Inserción anidada: Usuario + Técnico
			const nuevoUsuario = await prisma.usuario.create({
				data: {
					correo,
					contrasena: hashedPassword,
					tecnico: {
						create: { nombre, telefono, categoriaId, estaVerificado: false }
					}
				}
			});

			cookies.set('session_id', nuevoUsuario.id, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
		} catch (error) {
			console.error(error);
			return fail(500, { formError: 'Error interno del servidor' });
		}

		throw redirect(303, '/dashboard');
	},

	login: async ({ request, cookies }) => {
        // Lógica estándar de login con bcrypt.compare...
        // (Omitido por brevedad, sigue el mismo patrón de validación y seteo de cookie)
        return fail(501, { formError: 'Login no implementado en este snippet' });
    }
};