<script lang="ts">
    import { enhance } from '$app/forms';

    // Svelte 5 Runes
    let { data, form } = $props();

    // Estado reactivo para la vista actual
    let view = $state<'login' | 'register_client' | 'register_tecnico'>('login');
    let selectedEspecializacion = $state(""); // Inicializa explícitamente

    // Derivados para limpiar el código de UI
    let isClientError = $derived(form?.formName === 'client');
    let isTechError = $derived(form?.formName === 'tecnico');
    let isLoginError = $derived(form?.formName === 'login');
</script>

<div class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {#if view === 'login'}
                Iniciar Sesión
            {:else if view === 'register_client'}
                Registro de Cliente
            {:else}
                Registro de Técnico
            {/if}
        </h2>
    </div>

    <div
        class="mt-8 bg-white px-4 py-8 shadow sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:px-10"
    >
        <!-- Selector de vistas (Pestañas) -->
        <div class="mb-6 flex justify-between border-b pb-4 text-sm">
            <button
                class="font-medium {view === 'login'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500'}"
                onclick={() => (view = 'login')}>Login</button
            >
            <button
                class="font-medium {view === 'register_client'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500'}"
                onclick={() => (view = 'register_client')}>Soy Cliente</button
            >
            <button
                class="font-medium {view === 'register_tecnico'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500'}"
                onclick={() => (view = 'register_tecnico')}>Soy Técnico</button
            >
        </div>

        <!-- Formulario Cliente -->
        {#if view === 'register_client'}
            <form method="POST" action="?/registerClient" use:enhance class="space-y-4">
                {#if isClientError && form?.error}
                    <div class="rounded bg-red-50 p-2 text-sm text-red-500">{form.error}</div>
                {/if}

                <div>
                    <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre completo</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="correo" class="block text-sm font-medium text-gray-700">Correo</label>
                    <input
                        id="correo"
                        name="correo"
                        type="email"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección</label>
                    <input
                        id="direccion"
                        name="direccion"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="contrasena" class="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        id="contrasena"
                        name="contrasena"
                        type="password"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                
                <input
                        id="rol"
                        name="rol"
                        value="Cliente"
                        type="hidden"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />

                <button
                    type="submit"
                    class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                    Registrar Cliente
                </button>
            </form>

            <!-- Formulario Técnico -->
        {:else if view === 'register_tecnico'}
            <form method="POST" action="?/registerTecnico" use:enhance class="space-y-4">
                {#if isTechError && form?.error}
                    <div class="rounded bg-red-50 p-2 text-sm text-red-500">{form.error}</div>
                {/if}

                <div>
                    <label for="nombreTech" class="block text-sm font-medium text-gray-700">Nombre completo</label>
                    <input
                        id="nombreTech"
                        name="nombre"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="correoTech" class="block text-sm font-medium text-gray-700">Correo</label>
                    <input
                        id="correoTech"
                        name="correo"
                        type="email"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="telefonoTech" class="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        id="telefonoTech"
                        name="telefono"
                        type="tel"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <!-- Nuevos campos para el Técnico -->
                <div>
                    <label for="gradoEscolar" class="block text-sm font-medium text-gray-700">Grado Escolar</label>
                    <select 
                        id="gradoEscolar" 
                        name="gradoEscolar" 
                        required 
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="" disabled selected>Seleccione su nivel de estudios</option>
                        <option value="secundaria">Secundaria</option>
                        <option value="preparatoria">Preparatoria / Bachillerato</option>
                        <option value="tecnico">Carrera Técnica</option>
                        <option value="licenciatura">Licenciatura / Ingeniería</option>
                        <option value="maestria">Maestría</option>
                    </select>
                </div>

                <div>
                    <label for="experiencia" class="block text-sm font-medium text-gray-700">Años de experiencia</label>
                    <input
                        id="experiencia"
                        name="experiencia"
                        type="number"
                        min="0"
                        max="50"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="especializacionId" class="block text-sm font-medium text-gray-700">Especialidad</label>
                    <select 
                        id="especializacionId" 
                        name="especializacionId" 
                        bind:value={selectedEspecializacion} 
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="" disabled>Seleccione una especialidad</option>
                        {#if data?.especializaciones}
                            {#each data.especializaciones as esp}
                                <option value={esp.id}>{esp.nombre}</option>
                            {/each}
                        {/if}
                    </select>
                </div>

                <div>
                    <label for="urlIdentificacion" class="block text-sm font-medium text-gray-700">URL de Identificación Oficial (INE, Pasaporte, etc.)</label>
                    <input
                        id="urlIdentificacion"
                        name="urlIdentificacion"
                        type="url"
                        placeholder="https://ejemplo.com/documento.pdf"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <!-- Fin de nuevos campos -->

                <div>
                    <label for="contrasenaTech" class="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        id="contrasenaTech"
                        name="contrasena"
                        type="password"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                 <input
                        id="rol"
                        name="rol"
                        value="Tecnico"
                        type="hidden"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />

                <button
                    type="submit"
                    class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                >
                    Registrar Técnico
                </button>
            </form>

            <!-- (Login Form) -->
        {:else}
            <form method="POST" action="?/login" use:enhance class="space-y-4">
                {#if isLoginError && form?.error}
                    <div class="rounded bg-red-50 p-2 text-sm text-red-500">{form.error}</div>
                {/if}

                <div>
                    <label for="correoLogin" class="block text-sm font-medium text-gray-700">Correo</label>
                    <input
                        id="correoLogin"
                        name="correo"
                        type="email"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="contrasenaLogin" class="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        id="contrasenaLogin"
                        name="contrasena"
                        type="password"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                    Entrar
                </button>
            </form>
        {/if}
    </div>
</div>