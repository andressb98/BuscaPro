import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';

// LEER (GET) - Obtener usuario por ID o lista de usuarios
export const GET: RequestHandler = async ({ url, locals }) => {
	// Protección básica del endpoint
	if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

	const id = url.searchParams.get('id');

	try {
		if (id) {
			const usuario = await prisma.usuario.findUnique({
				where: { id },
				select: { id: true, correo: true, cliente: true, tecnico: true }
			});
			return json(usuario);
		}
		
		// Endpoint escalable: considerar paginación aquí en el futuro
		const usuarios = await prisma.usuario.findMany({
			select: { id: true, correo: true, fechaCreacion: true }
		});
		return json(usuarios);
	} catch (error) {
		return json({ error: 'Error al consultar la base de datos' }, { status: 500 });
	}
};

// ACTUALIZAR (PUT)
export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

	const data = await request.json();
	const { id, correo } = data; // Ajustar campos permitidos

	try {
		const usuarioActualizado = await prisma.usuario.update({
			where: { id },
			data: { correo },
			select: { id: true, correo: true }
		});
		return json(usuarioActualizado);
	} catch (error) {
		return json({ error: 'Error al actualizar' }, { status: 500 });
	}
};

// BORRAR (DELETE)
export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

	const { id } = await request.json();

	try {
		await prisma.usuario.delete({ where: { id } });
		return json({ success: true, message: 'Usuario eliminado' });
	} catch (error) {
		return json({ error: 'Error al eliminar' }, { status: 500 });
	}
};