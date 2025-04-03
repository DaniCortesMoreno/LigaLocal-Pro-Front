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
        <h2 class="mb-4">Torneos donde soy invitado</h2>

        <div v-if="torneos.length === 0" class="alert alert-info">
            No estás invitado a ningún torneo.
        </div>

        <div v-else class="row">
            <div v-for="torneo in torneos" :key="torneo.id" class="col-md-6 col-lg-4 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="card-title">{{ torneo.nombre }}</h5>
                        <p class="card-text">
                            <strong>Deporte:</strong> {{ torneo.tipo }}<br />
                            <strong>Visibilidad:</strong> {{ torneo.visibilidad }}<br />
                            <strong>Fecha Inicio:</strong> {{ torneo.fecha_inicio }}<br />
                            <strong>Creador:</strong> {{ torneo.user.nombre }} {{ torneo.user.apellidos }}
                        </p>
                        <router-link :to="`/torneos/${torneo.id}`" class="btn btn-primary w-100">Ver
                            Torneo</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
