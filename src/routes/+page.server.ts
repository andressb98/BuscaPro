import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = () => {
    // Redirige en el servidor antes de que la página llegue al navegador
    redirect(302, '/auth/registro');
};