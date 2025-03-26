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
      <router-link to="/torneos/nuevo" class="btn btn-sm btn-primary mt-3">Crear torneo</router-link>
  
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
            <TournamentItem v-for="torneo in torneos" :key="torneo.id" :torneo="torneo" 
            @click="$router.push('/torneos/' + torneo.id)"></TournamentItem>
          </tbody>
        </table>
      </div>
  
      <div v-else class="alert alert-info text-center mt-4">
        No tienes torneos creados. <br />
        <router-link to="/torneos/nuevo" class="btn btn-sm btn-primary mt-3">Crear mi primer torneo</router-link>
      </div>
    </div>
  </template>
  