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
        <div class="card shadow-lg rounded-4 border-0">
            <div class="card-body p-5">
                <h2 class="text-center text-primary fw-bold mb-4">
                    {{ jugador.nombre }} {{ jugador.apellidos }}
                </h2>

                <!-- Escudo del equipo sin fondo -->
                <div class="col-12 text-center" v-if="jugador.foto">
                    <h5 class="text-muted mb-2">
                        <i class="bi bi-person-badge-fill text-primary me-2"></i>Foto del jugador
                    </h5>
                    <img :src="jugador.foto" alt="Foto del jugador" class="img-fluid" style="max-height: 180px;" />
                </div>

                <div class="row gy-3">
                    <div class="col-md-6">
                        <p><i class="bi bi-person-fill"></i> <strong>Dorsal:</strong> {{ jugador.dorsal || 'No asignado' }}</p>
                        <p><i class="bi bi-shield-fill"></i> <strong>Posición:</strong> {{ jugador.posición || 'No definida' }}</p>
                        <p><i class="bi bi-check2-circle"></i> <strong>Estado:</strong> {{ jugador.estado || 'Activo' }}</p>
                    </div>
                    <div class="col-md-6">
                        <p><i class="bi bi-people-fill"></i> <strong>Equipo:</strong> {{ jugador.team?.nombre || 'Sin equipo' }}</p>
                        <p><i class="bi bi-trophy-fill"></i> <strong>Torneo:</strong> {{ jugador.team?.tournament?.nombre || 'Sin torneo' }}</p>
                    </div>
                </div>

                <hr class="my-4"/>

                <div class="text-center">
                    <h4 class="text-dark mb-4">📊 Estadísticas</h4>
                    <div class="row justify-content-center">
                        <div class="col-md-3 col-6 mb-3">
                            <div class="bg-light rounded p-3 shadow-sm">
                                <strong>Goles</strong>
                                <div class="fs-4 text-success">{{ jugador.goles || 0 }}</div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="bg-light rounded p-3 shadow-sm">
                                <strong>Asistencias</strong>
                                <div class="fs-4 text-primary">{{ jugador.asistencias || 0 }}</div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="bg-light rounded p-3 shadow-sm">
                                <strong>Amarillas</strong>
                                <div class="fs-4 text-warning">{{ jugador.amarillas || 0 }}</div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="bg-light rounded p-3 shadow-sm">
                                <strong>Rojas</strong>
                                <div class="fs-4 text-danger">{{ jugador.rojas || 0 }}</div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="bg-light rounded p-3 shadow-sm">
                                <strong>MVP</strong>
                                <div class="fs-4">{{ jugador.mvp_count || 0 }}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="container py-5 text-center" v-else>
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando jugador...</span>
        </div>
    </div>
</template>
