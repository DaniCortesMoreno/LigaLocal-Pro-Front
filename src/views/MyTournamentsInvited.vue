<script>
import { mapActions, mapState } from 'pinia';
import { useUserStore } from '@/stores';

export default {
    name: 'MisTorneosInvitado',
    data() {
        return {
            torneos: []
        };
    },
    computed: {
        ...mapState(useUserStore, ['usuario'])
    },
    methods: {
        ...mapActions(useUserStore, ['getTorneosInvitado']),
        async cargarTorneos() {
            this.torneos = await this.getTorneosInvitado();
        }
    },
    async mounted() {
        await this.cargarTorneos();
    }
}
</script>


<template>
    <div class="container py-5">
        <h2 class="fw-bold text-primary mb-5 text-center">
            <i class="bi bi-person-check-fill me-2"></i>Torneos donde soy invitado
        </h2>

        <div v-if="torneos.length === 0" class="alert alert-info text-center">
            No estás invitado a ningún torneo actualmente.
        </div>

        <div v-else class="row g-4">
            <div v-for="torneo in torneos" :key="torneo.id" class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm rounded-4 p-3">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title fw-bold text-primary mb-3">
                                <i class="bi bi-trophy-fill me-2"></i>{{ torneo.nombre }}
                            </h5>

                            <ul class="list-unstyled text-muted small mb-4">
                                <li><i class="bi bi-flag me-2"></i><strong>Tipo:</strong> {{ torneo.tipo }}</li>
                                <li><i class="bi bi-eye-fill me-2"></i><strong>Visibilidad:</strong> {{
                                    torneo.visibilidad }}</li>
                                <li><i class="bi bi-calendar-event me-2"></i><strong>Inicio:</strong> {{
                                    torneo.fecha_inicio }}</li>
                                <li>
                                    <i class="bi bi-person-fill me-2"></i><strong>Creador:</strong>
                                    {{ torneo.user.nombre }} {{ torneo.user.apellidos }}
                                </li>
                            </ul>
                        </div>

                        <router-link :to="`/torneos/${torneo.id}`" class="btn btn-outline-primary w-100">
                            Ver Torneo
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.05);
}
</style>
