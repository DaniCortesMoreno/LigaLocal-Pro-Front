<script>
import { mapActions } from 'pinia';
import { useUserStore } from '@/stores';

export default {
    name: "PlayerView",
    props: {
        id: String
    },
    data() {
        return {
            jugador: null
        }
    },
    methods: {
        ...mapActions(useUserStore, ['getJugador']),
        async cargarJugador() {
            const data = await this.getJugador(this.id);
            this.jugador = data;
        }
    },
    async mounted() {
        await this.cargarJugador();
    }
}
</script>

<template>
    <div class="container py-5" v-if="jugador">
        <div class="card shadow">
            <div class="card-body">
                <h2 class="card-title text-center text-primary">{{ jugador.nombre }} {{ jugador.apellidos }}</h2>

                <div class="mt-3">
                    <p><strong>Dorsal:</strong> {{ jugador.dorsal || 'No asignado' }}</p>
                    <p><strong>Posición:</strong> {{ jugador.posición || 'No definida' }}</p>
                    <p><strong>Estado:</strong> {{ jugador.estado || 'Activo' }}</p>

                    <p><strong>Equipo:</strong> {{ jugador.team?.nombre || 'Sin equipo' }}</p>
                    <p><strong>Torneo:</strong> {{ jugador.team.tournament?.nombre || 'Sin torneo' }}</p>
                </div>

                <!-- Aquí podrías mostrar estadísticas si ya están -->
                <!-- <div class="mt-4">
            <h5>Estadísticas</h5>
            ...
          </div> -->
            </div>
        </div>
    </div>

    <div class="container py-5 text-center" v-else>
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando jugador...</span>
        </div>
    </div>
</template>