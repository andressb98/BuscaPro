import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma'; // Ajusta la ruta a tu cliente de Prisma
import { completarClienteSchema, completarTecnicoSchema } from '$lib/server/schemas/perfil.schema'; // Ajusta la ruta a tus esquemas de validación
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Asumimos que locals.user ya tiene el ID y el ROL del usuario registrado
  const session = locals.user; 
  if (!session) redirect(302, '/login');

};

export const actions: Actions = {
  // Acción para el formulario del Cliente
  actualizarCliente: async ({ request, locals }) => {
    const session = locals.user;
    if (!session || session.rol !== 'cliente') return fail(401, { error: 'No autorizado' });

    const formData = Object.fromEntries(await request.formData());
    const result = completarClienteSchema.safeParse(formData);

    if (!result.success) {
      return fail(400, {
        data: formData,
        errors: result.error.flatten().fieldErrors
      });
    }

    try {
      await prisma.cliente.update({
        where: { usuarioId: session.id },
        data: result.data
      });
    } catch (error) {
      return fail(500, { error: 'Error al actualizar el perfil en la base de datos' });
    }

    redirect(302, '/dashboard-cliente');
  },

  // Acción para el formulario del Técnico
  actualizarTecnico: async ({ request, locals }) => {
    const session = locals.user;
    if (!session || session.rol !== 'tecnico') return fail(401, { error: 'No autorizado' });

    const formData = Object.fromEntries(await request.formData());
    const result = completarTecnicoSchema.safeParse(formData);

    if (!result.success) {
      return fail(400, {
        data: formData,
        errors: result.error.flatten().fieldErrors
      });
    }

    try {
      await prisma.tecnico.update({
        where: { usuarioId: session.id },
        data: result.data
      });
    } catch (error) {
      return fail(500, { error: 'Error al actualizar el perfil en la base de datos' });
    }

    redirect(302, '$routes/public/tecnicos');
  }
};