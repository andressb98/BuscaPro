import { writable } from 'svelte/store';

export type UserContext = {
	id: string;
	correo: string;
	rol: 'Cliente' | 'Tecnico' | 'Admin';
	perfil: any; // Datos del perfil específico (nombre, telefono, etc.)
} | null;

export const currentUser = writable<UserContext>(null);