import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.user;

	// Aseguramos que el usuario tiene sesión y su rol es 'tecnico'
	if (!session || session.rol !== 'tecnico') {
		throw redirect(303, '/auth/registro');
	}

	// 1. Buscamos el perfil del técnico usando el ID de usuario de la sesión
	const tecnico = await prisma.tecnico.findUnique({
		where: { usuarioId: session.id },
		include: {
			especializacion: true,
			citas: {
				orderBy: { fechaCreacion: 'desc' },
				take: 5, // Traemos máximo 5 solicitudes para la lista de recientes
				include: { cliente: true }
			}
		}
	});

	if (!tecnico) {
		throw redirect(303, '/auth/registro');
	}

	// 2. Buscamos todas las calificaciones para sacar un promedio
	const calificaciones = await prisma.calificacion.findMany({
		where: { destinatarioId: session.id }
	});

	// 3. Calculamos las estadísticas
	const nuevas = await prisma.cita.count({ where: { tecnicoId: tecnico.id, estado: 'PENDIENTE' }});
	const completados = await prisma.cita.count({ where: { tecnicoId: tecnico.id, estado: 'COMPLETADA' }});
	
	const promedioCalificacion = calificaciones.length > 0
		? (calificaciones.reduce((acc, curr) => acc + curr.puntuacion, 0) / calificaciones.length).toFixed(1)
		: "0.0";

	// 4. Retornamos la data limpia que consumirá nuestro componente svelte
	return {
		tecnico: {
			nombre: tecnico.nombre,
			especialidad: tecnico.especializacion?.nombre || 'Sin especialidad',
		},
		stats: { nuevas, completados, calificacion: promedioCalificacion },
		solicitudesRecientes: tecnico.citas.map(cita => ({
			id: cita.id,
			clienteNombre: cita.cliente.nombre,
			fechaProgramada: cita.fechaProgramada.toISOString(), // Lo mandamos como string estándar
			estado: cita.estado
		}))
	};
};