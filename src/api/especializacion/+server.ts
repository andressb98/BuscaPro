import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {prisma} from '$lib/server/prisma';

// CREAR (POST) - (Añadido por utilidad, ya que no estaba en tu ejemplo pero es necesario para crear especializaciones)
export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

    const data = await request.json();
    const { nombre, descripcion } = data;

    if (!nombre) {
        return json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    try {
        const nuevaEspecializacion = await prisma.especializacion.create({
            data: { nombre, descripcion }
        });
        return json(nuevaEspecializacion, { status: 201 });
    } catch (error) {
        return json({ error: 'Error al crear la especialización' }, { status: 500 });
    }
};

// LEER (GET) - Obtener especialización por ID o lista completa
export const GET: RequestHandler = async ({ url, locals }) => {
    // Protección básica del endpoint
    if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

    const id = url.searchParams.get('id');

    try {
        if (id) {
            const especializacion = await prisma.especializacion.findUnique({
                where: { id },
                // Seleccionamos los campos, incluyendo la relación si necesitas saber cuántos técnicos la tienen
                select: { 
                    id: true, 
                    nombre: true, 
                    descripcion: true,
                    _count: {
                        select: { tecnicos: true } // Opcional: te devuelve cuántos técnicos tienen esta especialidad
                    }
                }
            });
            
            if (!especializacion) {
                return json({ error: 'Especialización no encontrada' }, { status: 404 });
            }
            
            return json(especializacion);
        }
        
        // Endpoint escalable: obtener todas las especializaciones
        const especializaciones = await prisma.especializacion.findMany({
            select: { 
                id: true, 
                nombre: true, 
                descripcion: true 
            },
            orderBy: { nombre: 'asc' } // Ordenado alfabéticamente por buena práctica
        });
        
        return json(especializaciones);
    } catch (error) {
        return json({ error: 'Error al consultar la base de datos' }, { status: 500 });
    }
};

// ACTUALIZAR (PUT)
export const PUT: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

    const data = await request.json();
    const { id, nombre, descripcion } = data;

    if (!id) {
        return json({ error: 'El ID es obligatorio para actualizar' }, { status: 400 });
    }

    try {
        const especializacionActualizada = await prisma.especializacion.update({
            where: { id },
            data: { 
                ...(nombre && { nombre }), // Solo actualiza si se envía el valor
                ...(descripcion !== undefined && { descripcion }) // Permite actualizar a null/vacío
            },
            select: { id: true, nombre: true, descripcion: true }
        });
        return json(especializacionActualizada);
    } catch (error) {
        return json({ error: 'Error al actualizar la especialización' }, { status: 500 });
    }
};

// BORRAR (DELETE)
export const DELETE: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

    const { id } = await request.json();

    if (!id) {
        return json({ error: 'El ID es obligatorio para eliminar' }, { status: 400 });
    }

    try {
        await prisma.especializacion.delete({ where: { id } });
        return json({ success: true, message: 'Especialización eliminada' });
    } catch (error) {
        // Prisma lanza un error específico si intentas borrar algo que tiene relaciones anidadas exigidas
        return json({ error: 'Error al eliminar. Es posible que haya técnicos asignados a esta especialización.' }, { status: 500 });
    }
};