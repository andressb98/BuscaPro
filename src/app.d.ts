// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string;
				correo: string;
				rol: 'cliente' | 'tecnico';
				perfil: {
					nombre: string;
					telefono: string;
					estaVerificado?: boolean; // Solo para técnicos
				};
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
