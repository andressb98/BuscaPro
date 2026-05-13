<script lang="ts">
	import { enhance } from '$app/forms';

	// Así se reciben las props en Svelte 5
	let { data, form } = $props();

	let view: 'login' | 'registerClient' | 'registerTecnico' = $state('login');
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
		<!-- Navegación de Flujos -->
		<div class="mb-6 flex justify-between border-b pb-4">
			<button
				class={view === 'login'
					? 'border-b-2 border-blue-600 font-bold text-blue-600'
					: 'text-gray-500'}
				on:click={() => (view = 'login')}>Login</button
			>
			<button
				class={view === 'registerClient'
					? 'border-b-2 border-blue-600 font-bold text-blue-600'
					: 'text-gray-500'}
				on:click={() => (view = 'registerClient')}>Soy Cliente</button
			>
			<button
				class={view === 'registerTecnico'
					? 'border-b-2 border-blue-600 font-bold text-blue-600'
					: 'text-gray-500'}
				on:click={() => (view = 'registerTecnico')}>Soy Técnico</button
			>
		</div>

		{#if form?.error}
			<div class="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{form.error}</div>
		{/if}

		{#if view === 'login'}
			<form method="POST" action="?/login" use:enhance class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">Correo</label>
					<input
						type="email"
						name="correo"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						required
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">Contraseña</label>
					<input
						type="password"
						name="contrasena"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						required
					/>
				</div>
				<button
					type="submit"
					class="w-full rounded-md bg-blue-600 p-2 text-white transition hover:bg-blue-700"
					>Entrar</button
				>
			</form>
		{/if}

		{#if view === 'registerClient'}
			<form method="POST" action="?/registerClient" use:enhance class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
					<input
						type="text"
						name="nombre"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						required
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">Correo</label>
					<input
						type="email"
						name="correo"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						required
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">Contraseña</label>
					<input
						type="password"
						name="contrasena"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						required
					/>
				</div>
				<button
					type="submit"
					class="w-full rounded-md bg-green-600 p-2 text-white transition hover:bg-green-700"
					>Registrar como Cliente</button
				>
			</form>
		{/if}

		{#if view === 'registerTecnico'}
			<form method="POST" action="?/registerTecnico" use:enhance class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
					<input
						type="text"
						name="nombre"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						required
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">Correo</label>
					<input
						type="email"
						name="correo"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						required
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700"
						>ID de Categoría (Especialidad)</label
					>
					<!-- Idealmente esto sería un <select> poblado desde la BD -->
					<input
						type="text"
						name="categoriaId"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						required
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">Contraseña</label>
					<input
						type="password"
						name="contrasena"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						required
					/>
				</div>
				<button
					type="submit"
					class="w-full rounded-md bg-purple-600 p-2 text-white transition hover:bg-purple-700"
					>Registrar como Técnico</button
				>
			</form>
		{/if}
	</div>
</div>
