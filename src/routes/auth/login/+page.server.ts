import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import prisma from '$lib/server/prisma' // Asumiendo que tienes tu instancia de Prisma aquí
import { loginSchema, registerClientSchema, registerTechSchema } from '$lib/server/schemas/login.schema';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
	// Si ya está logueado, redirigir al área protegida
	if (locals.user) throw redirect(302, '/dashboard');
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = loginSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { data: formData, errors: result.error.flatten().fieldErrors });
		}

		const { correo, contrasena } = result.data;
		const usuario = await prisma.usuario.findUnique({
			where: { correo },
			include: { cliente: true, tecnico: true }
		});

		if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
			return fail(401, { error: 'Credenciales inválidas' });
		}

		// Establecer sesión (En producción, idealmente guardar un sessionId en BD)
		cookies.set('session_id', usuario.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 1 semana
		});

		throw redirect(302, '/dashboard');
	},

	// Flujo aislado: Cliente
	registerClient: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = registerClientSchema.safeParse(formData);

		if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

		const { correo, contrasena, nombre, telefono, direccion } = result.data;
		const hashedContrasena = await bcrypt.hash(contrasena, 12);

		try {
			const nuevoUsuario = await prisma.usuario.create({
				data: {
					correo,
					contrasena: hashedContrasena,
					cliente: {
						create: { nombre, telefono, direccion }
					}
				}
			});

			cookies.set('session_id', nuevoUsuario.id, { path: '/', httpOnly: true, maxAge: 604800 });
		} catch (error) {
			return fail(500, { error: 'El correo ya está registrado o hubo un error de servidor.' });
		}
		throw redirect(302, '/dashboard');
	},

	// Flujo aislado: Técnico
	registerTecnico: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = registerTechSchema.safeParse(formData);

		if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

		const { correo, contrasena, nombre, telefono, especializacionId } = result.data;
		const hashedContrasena = await bcrypt.hash(contrasena, 12);

		try {
			const nuevoUsuario = await prisma.usuario.create({
				data: {
					correo,
					contrasena: hashedContrasena,
					tecnico: {
						create: { nombre, telefono, especializacionId, estaVerificado: false }
					}
				}
			});

			cookies.set('session_id', nuevoUsuario.id, { path: '/', httpOnly: true, maxAge: 604800 });
		} catch (error) {
			return fail(500, { error: 'El correo ya está registrado o hubo un error de servidor.' });
		}
		throw redirect(302, '/dashboard');
	}
};