import { redirect, type Handle } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma'; // Asumiendo que instancias Prisma aquí

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');

	if (!sessionId) {
		event.locals.user = null;
	} else {
		// Buscamos al usuario e incluimos sus perfiles si existen
		const usuario = await prisma.usuario.findUnique({
			where: { id: sessionId },
			select: {
				id: true,
				correo: true,
				cliente: true,
				tecnico: true
			}
		});

		if (usuario) {
			// Determinamos el rol dinámicamente y mapeamos los datos
			const esCliente = !!usuario.cliente;
			event.locals.user = {
				id: usuario.id,
				correo: usuario.correo,
				rol: esCliente ? 'cliente' : 'tecnico',
				perfil: {
					nombre: (usuario.cliente?.nombre || usuario.tecnico?.nombre) as string,
					telefono: (usuario.cliente?.telefono || usuario.tecnico?.telefono) as string,
					estaVerificado: usuario.tecnico?.estaVerificado
				}
			};
		} else {
			// Si la cookie existe pero el usuario no (fue borrado de DB)
			event.locals.user = null;
			event.cookies.delete('session_id', { path: '/' });
		}
	}

	// Log para ver la información de la sesión en consola
	console.log('[Hooks] Información de sesión:', event.locals.user);

	// Protección de Rutas Centralizada
	const pathname = event.url.pathname;

	// 1. Si está en la raíz (/) o rutas de autenticación (/auth) y ya tiene sesión
	if (pathname === '/' || pathname.startsWith('/auth')) {
		if (event.locals.user) {
			const redirectUrl = event.locals.user.rol === 'cliente' ? '/public/clientes' : '/public/tecnicos';
			throw redirect(303, redirectUrl);
		}
	}

	// 2. Solo los clientes pueden acceder a /public/clientes
	if (pathname.startsWith('/public/clientes')) {
		if (!event.locals.user || event.locals.user.rol !== 'cliente') {
			throw redirect(303, '/auth/registro');
		}
	}

	// 3. Solo los técnicos pueden acceder a /public/tecnicos
	if (pathname.startsWith('/public/tecnicos')) {
		if (!event.locals.user || event.locals.user.rol !== 'tecnico') {
			throw redirect(303, '/auth/registro');
		}
	}

	return resolve(event);
};