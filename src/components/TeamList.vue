<script>
export default {
    name: "TeamList",
    props: {
        equipos: {
            type: Array,
            required: true
        },
        puedeCrear: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<template>
    <div class="mt-5">
        <h3 class="mb-4 text-center">Equipos del Torneo</h3>

        <div v-if="equipos.length === 0" class="text-center alert alert-light border">
            <p>No hay equipos creados todavía.</p>
            <button v-if="puedeCrear" class="btn btn-primary" @click="$emit('crearEquipo')">
                Crear mi primer equipo
            </button>
        </div>

        <div v-else>
            <div class="d-flex justify-content-end mb-3" v-if="puedeCrear">
                <button class="btn btn-primary" @click="$emit('crearEquipo')">Crear equipo</button>
            </div>

            <!-- Aquí renderizas los equipos -->
        </div>


        <div class="row g-3">
            <div class="col-md-6 col-lg-4" v-for="equipo in equipos" :key="equipo.id">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">{{ equipo.nombre }}</h5>
                        <p class="card-text">
                            <strong>Entrenador:</strong> {{ equipo.entrenador || 'N/A' }}<br />
                            <strong>Color:</strong> {{ equipo.color_equipacion || 'No definido' }}
                        </p>
                        <!-- Aquí podrías añadir botones para ver, editar o eliminar equipo -->
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>