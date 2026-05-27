import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.user;

	// 1. Aseguramos que el usuario tiene sesión y su rol es 'cliente'
	if (!session || session.rol !== 'cliente') {
		throw redirect(303, '/auth/registro');
	}

	// 2. Buscamos el perfil del cliente
	const cliente = await prisma.cliente.findUnique({
		where: { usuarioId: session.id },
		include: {
			citas: {
				orderBy: { fechaCreacion: 'desc' },
				take: 5, // Traemos máximo 5 solicitudes para la lista de recientes
				include: { tecnico: true }
			}
		}
	});

	if (!cliente) {
		throw redirect(303, '/auth/registro');
	}

	// 3. Calculamos las estadísticas del cliente
	const activas = await prisma.cita.count({
		where: { clienteId: cliente.id, estado: { in: ['PENDIENTE', 'CONFIRMADA'] } }
	});
	const completados = await prisma.cita.count({
		where: { clienteId: cliente.id, estado: 'COMPLETADA' }
	});
	const favoritos = 0; // O la lógica que desees para técnicos favoritos en un futuro

	// 4. Obtenemos un listado de técnicos disponibles/recomendados
	const tecnicosDisponibles = await prisma.tecnico.findMany({
		take: 6, // Limitamos a 6 para la vista del dashboard
		include: {
			especializacion: true,
			usuario: { include: { calificacionesRecibidas: true } }
		}
	});

	// 5. Retornamos la data limpia
	return {
		cliente: { nombre: cliente.nombre },
		stats: { activas, completados, favoritos },
		misSolicitudes: cliente.citas.map(cita => ({
			id: cita.id,
			tecnicoNombre: cita.tecnico.nombre,
			fechaProgramada: cita.fechaProgramada.toISOString(),
			estado: cita.estado
		})),
		tecnicosRecomendados: tecnicosDisponibles.map(tech => {
			const calificaciones = tech.usuario.calificacionesRecibidas;
			const promedio = calificaciones.length > 0 
				? (calificaciones.reduce((acc, curr) => acc + curr.puntuacion, 0) / calificaciones.length).toFixed(1)
				: "N/A";
			return { id: tech.id, nombre: tech.nombre, especialidad: tech.especializacion?.nombre || 'General', experiencia: tech.experiencia || 'No especificada', calificacion: promedio };
		})
	};
};