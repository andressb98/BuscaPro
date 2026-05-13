import type { Handle } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');

	if (sessionId) {
		const user = await prisma.usuario.findUnique({
			where: { id: sessionId },
			// Solo traemos los datos necesarios, NUNCA la contraseña
			select: {
				id: true,
				correo: true,
				cliente: { select: { id: true, nombre: true } },
				tecnico: { select: { id: true, nombre: true, estaVerificado: true } }
			}
		});

		if (user) {
			event.locals.user = user;
		} else {
			// Cookie inválida o usuario eliminado
			event.cookies.delete('session_id', { path: '/' });
		}
	}

	// Middleware de protección de rutas privadas
	if (event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/perfil')) {
		if (!event.locals.user) {
			return new Response('Redirigiendo...', { status: 303, headers: { Location: '/auth' } });
		}
		// Podrías agregar más lógica aquí (ej. si requiere rol de Técnico para ciertas rutas)
	}

	return resolve(event);
};