<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-primary">Mis Torneos</h2>
      <router-link to="/torneos/nuevo" class="btn btn-primary">+ Crear torneo</router-link>
    </div>

    <div v-if="torneos.length > 0" class="table-responsive">
      <table class="table table-hover align-middle shadow-sm">
        <thead class="table-light">
          <tr class="text-muted">
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
          <TournamentItem
            v-for="torneo in torneos"
            :key="torneo.id"
            :torneo="torneo"
            @click="$router.push('/torneos/' + torneo.id)"
          />
        </tbody>
      </table>
    </div>

    <div v-else class="alert alert-light border text-center mt-5">
      <h5 class="mb-3">Aún no tienes torneos creados.</h5>
      <router-link to="/torneos/nuevo" class="btn btn-outline-primary">Crear mi primer torneo</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useUserStore } from "@/stores";
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

<style scoped>
.table thead th {
  vertical-align: middle;
}
.table td,
.table th {
  padding: 0.9rem 1rem;
}
</style>