<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  // Svelte 5: Uso de Runes para props
  let { data, form }: { data: PageData; form: ActionData } = $props();
  
  // Estado para manejar el loading de los botones
  let enviando = $state(false);
</script>

<div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
  <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Completa tu Perfil en BuscaPro</h1>

  {#if data.usuario.rol === 'TECNICO'}
    <!-- BLOQUE DEL TÉCNICO -->
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-blue-600">Perfil de Especialista</h2>
      <p class="text-gray-500 text-sm">Completa tu información profesional para que los clientes puedan encontrarte.</p>
    </div>

    <form 
      method="POST" 
      action="?/actualizarTecnico" 
      use:enhance={() => { enviando = true; return async ({ update }) => { enviando = false; update(); }; }}
      class="space-y-4"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" name="telefono" value={form?.data?.telefono ?? ''} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
          {#if form?.errors?.telefono}<p class="text-red-500 text-xs mt-1">{form.errors.telefono[0]}</p>{/if}
        </div>
        
        <div>
          <label for="especializacionId" class="block text-sm font-medium text-gray-700">Especialidad Principal</label>
          <select name="especializacionId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
            <option value="">Selecciona una...</option>
            {#each data.especializaciones as esp}
              <option value={esp.id}>{esp.nombre}</option>
            {/each}
          </select>
          {#if form?.errors?.especializacionId}<p class="text-red-500 text-xs mt-1">{form.errors.especializacionId[0]}</p>{/if}
        </div>
      </div>

      <div>
        <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección Operativa</label>
        <input type="text" name="direccion" value={form?.data?.direccion ?? ''} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
      </div>

      <div>
        <label for="formacion" class="block text-sm font-medium text-gray-700">Formación (Certificaciones, cursos)</label>
        <input type="text" name="formacion" value={form?.data?.formacion ?? ''} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
      </div>

      <div>
        <label for="experiencia" class="block text-sm font-medium text-gray-700">Experiencia Laboral (Años, trabajos previos)</label>
        <textarea name="experiencia" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>{form?.data?.experiencia ?? ''}</textarea>
      </div>

      <button type="submit" disabled={enviando} class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {enviando ? 'Guardando...' : 'Finalizar Perfil'}
      </button>
    </form>

  {:else if data.usuario.rol === 'CLIENTE'}
    <!-- BLOQUE DEL CLIENTE -->
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-green-600">Perfil de Cliente</h2>
      <p class="text-gray-500 text-sm">Necesitamos algunos datos para que los técnicos puedan contactarte y llegar a tu ubicación.</p>
    </div>

    <form 
      method="POST" 
      action="?/actualizarCliente" 
      use:enhance={() => { enviando = true; return async ({ update }) => { enviando = false; update(); }; }}
      class="space-y-4"
    >
      <div>
        <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
        <input type="tel" name="telefono" value={form?.data?.telefono ?? ''} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
        {#if form?.errors?.telefono}<p class="text-red-500 text-xs mt-1">{form.errors.telefono[0]}</p>{/if}
      </div>

      <div>
        <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección Principal (Donde requieres los servicios)</label>
        <input type="text" name="direccion" value={form?.data?.direccion ?? ''} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
        {#if form?.errors?.direccion}<p class="text-red-500 text-xs mt-1">{form.errors.direccion[0]}</p>{/if}
      </div>

      <button type="submit" disabled={enviando} class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50">
        {enviando ? 'Guardando...' : 'Ir al Buscador de Técnicos'}
      </button>
    </form>
  {/if}

  {#if form?.error}
    <div class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
      {form.error}
    </div>
  {/if}
</div>