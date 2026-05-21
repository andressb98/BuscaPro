<script lang="ts">
  // Estado inicial del cascarón usando Runes de Svelte 5
  let nombreTecnico = $state("Nombre del Técnico");
  let especialidad = $state("Plomero");
  let estaDisponible = $state(true);

  let stats = $state({
    nuevas: 0,
    completados: 0,
    calificacion: "0.0"
  });

  // Lista de solicitudes (vacía por ahora para mostrar el diseño inicial)
  let solicitudesRecientes: any[] = $state([]);
</script>

<div class="min-h-screen bg-gray-50 flex flex-col md:flex-row">
  
  <!-- BARRA LATERAL (SIDEBAR) -->
  <aside class="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-6 border-b border-gray-100">
      <h2 class="text-2xl font-bold text-blue-600">BuscaPro</h2>
      <p class="text-xs text-gray-500 uppercase tracking-wider mt-1">Panel de Especialista</p>
    </div>
    

    
    <div class="p-4 border-t border-gray-100">
      <button class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">
        Cerrar Sesión
      </button>
    </div>
  </aside>

  <!-- CONTENIDO PRINCIPAL -->
  <main class="flex-1 flex flex-col">
    
    <!-- ENCABEZADO (HEADER) -->
    <header class="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <h1 class="text-xl font-semibold text-gray-800 hidden md:block">
        Bienvenido, {nombreTecnico}
      </h1>
      <h1 class="text-xl font-semibold text-gray-800 md:hidden">
        Dashboard
      </h1>
      
      <div class="flex items-center space-x-4">
        <!-- Switch de Disponibilidad (Cascarón) -->
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-600 hidden sm:block">Estado:</span>
          {#if estaDisponible}
            <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              Disponible
            </span>
          {:else}
            <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
              No Disponible
            </span>
          {/if}
        </div>
        
        <!-- Avatar del Técnico -->
        <div class="h-10 w-10 bg-gray-200 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
          <span class="text-gray-500 font-medium">Pic</span>
        </div>
      </div>
    </header>

    <!-- ÁREA DE DATOS DEL DASHBOARD -->
    <div class="p-6 space-y-6 flex-1 overflow-y-auto">
      
      <!-- Banner de Anuncio -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-800">Tu anuncio: {especialidad}</h2>
          <p class="text-sm text-gray-500 mt-1">
            Tu perfil está visible para los clientes. Asegúrate de mantener tu información actualizada para recibir más solicitudes.
          </p>
        </div>
        <button class="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Editar Perfil
        </button>
      </div>

      <!-- Tarjetas de Estadísticas (Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-sm font-medium text-gray-500">Nuevas Solicitudes</h3>
          <div class="mt-2 flex items-baseline">
            <p class="text-3xl font-bold text-gray-900">{stats.nuevas}</p>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-sm font-medium text-gray-500">Trabajos Completados</h3>
          <div class="mt-2 flex items-baseline">
            <p class="text-3xl font-bold text-gray-900">{stats.completados}</p>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-sm font-medium text-gray-500">Calificación Promedio</h3>
          <div class="mt-2 flex items-baseline space-x-1">
            <p class="text-3xl font-bold text-gray-900">{stats.calificacion}</p>
            <span class="text-yellow-400 text-2xl">★</span>
          </div>
        </div>

      </div>

      <!-- Lista de Solicitudes Recientes (Cascarón) -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-base font-semibold text-gray-800">Solicitudes Recientes</h3>
        </div>
        
        {#if solicitudesRecientes.length === 0}
        <!-- Estado Vacío -->
        <div class="p-10 text-center flex flex-col items-center justify-center">
          <div class="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <p class="text-gray-600 font-medium">Aún no tienes solicitudes.</p>
          <p class="text-sm text-gray-400 mt-1">Cuando un cliente requiera tus servicios, aparecerá aquí.</p>
        </div>
        {:else}
        <!-- Lista con datos -->
        <ul class="divide-y divide-gray-100">

        </ul>
        {/if}
        
      </div>
      
    </div>
  </main>
</div>
