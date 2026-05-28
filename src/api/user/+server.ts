import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcrypt';
import { registerTechSchema } from '$lib/server/schemas/register.schema';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const parsed = registerTechSchema.safeParse(data);

		if (!parsed.success) {
			return json(
				{ success: false, errors: parsed.error.flatten().fieldErrors },
				{ status: 400 }
			);
		}

		const {
			correo,
			contrasena,
			nombre,
			telefono,
			especializacionId,
			direccion,
			rol,
			gradoEscolar,
			experiencia,
			urlIdentificacion
		} = parsed.data;

		// Verificamos si el correo ya está en uso
		const existe = await prisma.usuario.findUnique({ where: { correo } });
		if (existe) {
			return json({ success: false, error: 'El correo ya está registrado.' }, { status: 400 });
		}

		// Validamos que la especialización ingresada exista
		const espExiste = await prisma.especializacion.findUnique({ where: { id: especializacionId } });
		if (!espExiste) {
			return json({ success: false, error: 'Especialización inválida.' }, { status: 400 });
		}

		const hashedContrasena = await bcrypt.hash(contrasena, 12);
		console.log('Creando usuario técnico con datos):', {
			correo,
			nombre,
			telefono,
			direccion,
			formacion: gradoEscolar,
			experiencia,
			especializacionId,
			urlIdentificacionOficial: urlIdentificacion,
			estaVerificado: false
		});
		console.log('Rol asignado para nuevo usuario:', rol);

		const nuevoUsuario = await prisma.usuario.create({
			data: {
				correo,
				contrasena: hashedContrasena,
				rol: rol, // Se asigna de forma segura desde el backend
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

		return json({ success: true, userId: nuevoUsuario.id }, { status: 201 });
	} catch (error) {
		console.error('API Registro Técnico Error:', error);
		return json({ success: false, error: 'Error interno del servidor.' }, { status: 500 });
	}
};