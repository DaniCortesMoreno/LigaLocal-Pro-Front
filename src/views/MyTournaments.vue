<script>
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/stores";
import router from "@/router";
import TournamentItem from "@/components/TournamentItem.vue";

export default {
    name: "Mis Torneos",
    components: {
        TournamentItem
    },
    data() {
        return {
            torneos: [],
        }
    },
    methods: {
        ...mapActions(useUserStore, ["getTorneosDelUserActual"]),

        async cargaTorneosDelUserActual() {
            this.torneos = await this.getTorneosDelUserActual()
        }
    },

    async mounted() {
        await this.cargaTorneosDelUserActual()
    }
}
</script>

<template>
    <div class="container py-5">
      <h2 class="text-center mb-4">Mis Torneos</h2>
  
      <div v-if="torneos.length > 0" class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead class="table-primary">
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Formato</th>
              <th>Visibilidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="torneo in torneos" :key="torneo.id">
              <td class="fw-semibold">{{ torneo.nombre }}</td>
              <td>{{ torneo.tipo }}</td>
              <td>{{ torneo.fecha_inicio }}</td>
              <td>{{ torneo.fecha_fin }}</td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-success': torneo.estado === 'en curso',
                    'bg-secondary': torneo.estado === 'pendiente',
                    'bg-danger': torneo.estado === 'finalizado'
                  }"
                >
                  {{ torneo.estado }}
                </span>
              </td>
              <td>{{ torneo.formato }}</td>
              <td>
                <span class="badge bg-info text-dark">{{ torneo.visibilidad }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-else class="alert alert-info text-center mt-4">
        No tienes torneos creados. <br />
        <router-link to="/torneos/nuevo" class="btn btn-sm btn-primary mt-3">Crear mi primer torneo</router-link>
      </div>
    </div>
  </template>
  