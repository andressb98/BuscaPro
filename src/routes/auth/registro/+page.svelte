<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	// Estado reactivo en Svelte 5 para el control de vistas aisladas
	let view = $state<'login' | 'registerClient' | 'registerTecnico'>('login');
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
		
		<!-- Selector de Navegación Aislada -->
		<div class="flex flex-col gap-2 border-b pb-4 mb-6">
			<h2 class="text-center text-3xl font-extrabold text-gray-900 mb-4">
				{#if view === 'login'} Iniciar Sesión 
				{:else if view === 'registerClient'} Portal de Clientes
				{:else} Portal para Técnicos {/if}
			</h2>
			
			<div class="grid grid-cols-3 gap-2">
				<button onclick={() => view = 'login'} class="text-sm font-medium p-2 rounded-md transition-colors {view === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">Ingresar</button>
				<button onclick={() => view = 'registerClient'} class="text-sm font-medium p-2 rounded-md transition-colors {view === 'registerClient' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">Soy Cliente</button>
				<button onclick={() => view = 'registerTecnico'} class="text-sm font-medium p-2 rounded-md transition-colors {view === 'registerTecnico' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">Soy Técnico</button>
			</div>
		</div>

		{#if form?.formError}
			<div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
				<p class="text-sm text-red-700">{form.formError}</p>
			</div>
		{/if}

		<!-- FLUJO 1: LOGIN -->
		{#if view === 'login'}
			<form method="POST" action="?/login" use:enhance class="space-y-4">
				<div>
					<label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
					<input id="correo" name="correo" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
				</div>
				<div>
					<label for="contrasena" class="block text-sm font-medium text-gray-700">Contraseña</label>
					<input id="contrasena" name="contrasena" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
				</div>
				<button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
					Ingresar al Sistema
				</button>
			</form>
		{/if}

		<!-- FLUJO 2: REGISTRO CLIENTE (Estrictamente separado) -->
		{#if view === 'registerClient'}
			<form method="POST" action="?/registerClient" use:enhance class="space-y-4">
				<div>
					<label for="nombre_c" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
					<input id="nombre_c" name="nombre" type="text" value={form?.clientData?.nombre || ''} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
					{#if form?.errors?.nombre} <p class="text-xs text-red-500 mt-1">{form.errors.nombre[0]}</p> {/if}
				</div>
				<div>
					<label for="correo_c" class="block text-sm font-medium text-gray-700">Correo</label>
					<input id="correo_c" name="correo" type="email" value={form?.clientData?.correo || ''} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
				</div>
				<div>
					<label for="telefono_c" class="block text-sm font-medium text-gray-700">Teléfono</label>
					<input id="telefono_c" name="telefono" type="tel" value={form?.clientData?.telefono || ''} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
				</div>
				<div>
					<label for="direccion_c" class="block text-sm font-medium text-gray-700">Dirección</label>
					<input id="direccion_c" name="direccion" type="text" value={form?.clientData?.direccion || ''} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
				</div>
				<div>
					<label for="contrasena_c" class="block text-sm font-medium text-gray-700">Contraseña</label>
					<input id="contrasena_c" name="contrasena" type="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
				</div>
				<button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
					Crear Cuenta de Cliente
				</button>
			</form>
		{/if}

		<!-- FLUJO 3: REGISTRO TÉCNICO (Estrictamente separado) -->
		{#if view === 'registerTecnico'}
			<form method="POST" action="?/registerTecnico" use:enhance class="space-y-4">
				<div>
					<label for="nombre_t" class="block text-sm font-medium text-gray-700">Nombre del Especialista</label>
					<input id="nombre_t" name="nombre" type="text" value={form?.techData?.nombre || ''} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
				</div>
				<div>
					<label for="correo_t" class="block text-sm font-medium text-gray-700">Correo Profesional</label>
					<input id="correo_t" name="correo" type="email" value={form?.techData?.correo || ''} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
				</div>
				<div>
					<label for="telefono_t" class="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
					<input id="telefono_t" name="telefono" type="tel" value={form?.techData?.telefono || ''} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
				</div>
				
				<!-- Select alimentado desde el Server Load -->
				<div>
					<label for="categoriaId" class="block text-sm font-medium text-gray-700">Categoría de Servicio</label>
					<select id="categoriaId" name="categoriaId" class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
						<option value="" disabled selected>Seleccione una especialidad</option>
						{#each data.categorias as cat}
							<option value={cat.id}>{cat.nombre}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="contrasena_t" class="block text-sm font-medium text-gray-700">Contraseña</label>
					<input id="contrasena_t" name="contrasena" type="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
				</div>
				<button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
					Solicitar Ingreso como Técnico
				</button>
			</form>
		{/if}
	</div>
</div>