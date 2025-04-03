<template>
  <div class="container py-5">
    <!-- Cabecera -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-primary mb-0">
        <i class="bi bi-person-badge-fill me-2"></i>Mis Torneos
      </h2>
      <router-link to="/torneos/nuevo" class="btn btn-primary shadow-sm">
        <i class="bi bi-plus-circle me-1"></i>Crear torneo
      </router-link>
    </div>

    <!-- Tabla de torneos -->
    <div v-if="torneos.length > 0" class="table-responsive">
      <table class="table table-hover align-middle shadow rounded overflow-hidden">
        <thead class="table-dark text-light">
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
          <TournamentItem
            v-for="torneo in torneos"
            :key="torneo.id"
            :torneo="torneo"
            @click="$router.push('/torneos/' + torneo.id)"
          />
        </tbody>
      </table>
    </div>

    <!-- Sin torneos -->
    <div v-else class="alert alert-info text-center mt-5">
      <h5 class="mb-3">
        <i class="bi bi-emoji-frown me-2"></i>Aún no tienes torneos creados.
      </h5>
      <router-link to="/torneos/nuevo" class="btn btn-outline-primary">
        <i class="bi bi-plus-circle me-1"></i>Crear mi primer torneo
      </router-link>
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