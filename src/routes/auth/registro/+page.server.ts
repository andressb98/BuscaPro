import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcrypt';
import { registerClientSchema, registerTechSchema } from '$lib/server/schemas/register.schema';
export const load: PageServerLoad = async ({ locals }) => {
	// Si ya está logueado, redirigir
	if (locals.user) throw redirect(303, '/dashboard');
	
	// Aquí podrías cargar las especializaciones para el select de técnicos
	const especializaciones = await prisma.especializacion.findMany();
	return { especializaciones };
};

export const actions: Actions = {
	registerClient: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parsed = registerClientSchema.safeParse(formData);

		if (!parsed.success) {
			return fail(400, { formName: 'client', errors: parsed.error.flatten().fieldErrors });
		}

		console.log('Datos recibidos para registro cliente:', parsed.data);

		const { correo, contrasena, nombre, telefono, direccion, urlIdentificacionOficial } = parsed.data;

		try {
			// Verificar si existe el correo
			const existe = await prisma.usuario.findUnique({ where: { correo } });
			if (existe) return fail(400, { formName: 'client', error: 'El correo ya está registrado.' });

			const hashedContrasena = await bcrypt.hash(contrasena, 12);

			// Prisma Nested Insert (Transacción automática)
			const nuevoUsuario = await prisma.usuario.create({
				data: {
					correo,
					contrasena: hashedContrasena,
					rol: 'CLIENTE',
					cliente: {
						create: {
							nombre,
							telefono,
							direccion,
							urlIdentificacionOficial
						}
					}
				}
			});

			// Setear cookie HttpOnly
			cookies.set('session_id', nuevoUsuario.id, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 semana
			});

		} catch (error) {
			return fail(500, { formName: 'client', error: 'Error interno del servidor.' });
		}

		throw redirect(303, '/completar_perfil');
	},
	

	registerTecnico: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parsed = registerTechSchema.safeParse(formData);

		if (!parsed.success) {
			return fail(400, { formName: 'tecnico', errors: parsed.error.flatten().fieldErrors });
		}

		const {
			correo,
			contrasena,
			nombre,
			telefono,
			especializacionId,
			direccion,
			gradoEscolar,
			experiencia,
			urlIdentificacion
		} = parsed.data;

		try {
			const existe = await prisma.usuario.findUnique({ where: { correo } });
			if (existe) return fail(400, { formName: 'tecnico', error: 'El correo ya está registrado.' });

			// Validar existencia de especialización (Obligatorio por regla de negocio)
			const espExiste = await prisma.especializacion.findUnique({ where: { id: especializacionId } });
			if (!espExiste) return fail(400, { formName: 'tecnico', error: 'Especialización inválida.' });

			const hashedContrasena = await bcrypt.hash(contrasena, 12);

			console.log('Creando usuario técnico con datos):', {
				correo,
				nombre,
				telefono,
				direccion,
				formacion: gradoEscolar,
				experiencia,
				especializacionId,
				estaVerificado: false
			});

			// Prisma Nested Insert

			const nuevoUsuario = await prisma.usuario.create({
				data: {
					correo,
					contrasena: hashedContrasena,
					rol: 'TECNICO',
					tecnico: {
						create: {
							nombre,
							telefono,
							direccion,
							formacion: gradoEscolar,
							experiencia,
							especializacionId,
							urlIdentificacionOficial: urlIdentificacion,
							estaVerificado: false
						}
					}
				}
			});

			cookies.set('session_id', nuevoUsuario.id, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});

		} catch (error) {
			return fail(500, { formName: 'tecnico', error: 'Error interno del servidor.' });
		}

		throw redirect(303, '../../public/tecnicos');
	}
};