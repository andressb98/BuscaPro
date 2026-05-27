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

	// Protección de Rutas (Ejemplo: Proteger todo lo que empiece con /dashboard)
	if (event.url.pathname.startsWith('/dashboard') && !event.locals.user) {
		throw redirect(303, '/auth');
	}
*/
	return resolve(event);
};