<template>
  <div class="container py-5">
    <h2 class="text-center fw-semibold mb-5">Torneos Públicos</h2>

    <div v-if="torneos.length > 0" class="row g-4">
      <div
        class="col-md-6 col-lg-4"
        v-for="torneo in torneos"
        :key="torneo.id"
      >
        <div
          class="card h-100 border-0 shadow-sm rounded-4 p-3 torneo-card"
          @click="verTorneo(torneo.id)"
        >
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary mb-3">
              <i class="bi bi-shield-check me-2"></i>{{ torneo.nombre }}
            </h5>

            <ul class="list-unstyled small text-muted mb-3">
              <li><strong>Tipo:</strong> {{ torneo.tipo }}</li>
              <li><strong>Inicio:</strong> {{ torneo.fecha_inicio }}</li>
              <li>
                <strong>Estado:</strong>
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
              </li>
            </ul>

            <div class="text-end">
              <span class="text-primary fw-semibold">Ver detalles →</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info text-center mt-5">
      No hay torneos públicos disponibles.
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useUserStore } from "@/stores";
import router from "@/router";

export default {
  name: "TorneosView",

  data() {
    return {
      torneos: [],
    };
  },

  methods: {
    ...mapActions(useUserStore, ["getTorneos"]),

    async cargarTorneosPublicos() {
      const todos = await this.getTorneos();
      this.torneos = todos.filter(t => t.visibilidad === "publico");
    },

    verTorneo(id) {
      router.push(`/torneos/${id}`);
    }
  },

  async mounted() {
    await this.cargarTorneosPublicos();
  }
};
</script>

<style scoped>
.torneo-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.torneo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.05);
}
</style>
