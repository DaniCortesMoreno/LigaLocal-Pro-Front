<template>
  <div class="row mb-4">
    <div class="col-md-6">
      <input v-model="filtroBusqueda" type="text" class="form-control"
        placeholder="Buscar por nombre, tipo o estado..." />
    </div>
    <div class="col-md-3">
      <select v-model="filtroEstado" class="form-select">
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="en curso">En curso</option>
        <option value="finalizado">Finalizado</option>
      </select>
    </div>
    <div class="col-md-3">
      <select v-model="filtroTipo" class="form-select">
        <option value="">Todos los tipos</option>
        <option value="futbol11">Fútbol 11</option>
        <option value="futbol7">Fútbol 7</option>
        <option value="sala">Fútbol Sala</option>
      </select>
    </div>
  </div>

  <div class="container py-5">
    <h2 class="text-center display-6 fw-bold mb-5 text-primary">
      <i class="bi bi-globe-americas me-2"></i>Torneos Públicos
    </h2>

    <div v-if="torneos.length > 0" class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="torneo in torneosFiltrados" :key="torneo.id">
        <div class="card h-100 border-0 shadow-sm rounded-4 torneo-card bg-white" @click="verTorneo(torneo.id)">
          <div class="card-body p-4">
            <h5 class="card-title fw-semibold text-primary mb-3">
              <i class="bi bi-shield-check me-2"></i>{{ torneo.nombre }}
            </h5>

            <ul class="list-unstyled text-muted small mb-4">
              <li><i class="bi bi-flag-fill me-2 text-secondary"></i><strong>Tipo:</strong> {{ torneo.tipo }}</li>
              <li><i class="bi bi-calendar-event me-2 text-secondary"></i><strong>Inicio:</strong> {{
                torneo.fecha_inicio }}</li>
              <li>
                <i class="bi bi-info-circle-fill me-2 text-secondary"></i><strong>Estado:</strong>
                <span class="badge rounded-pill px-3 py-1" :class="{
                  'bg-success': torneo.estado === 'en curso',
                  'bg-warning text-dark': torneo.estado === 'pendiente',
                  'bg-danger': torneo.estado === 'finalizado'
                }">
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
      <i class="bi bi-exclamation-circle me-2"></i>No hay torneos públicos disponibles.
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
      filtroBusqueda: "",
      filtroEstado: "",
      filtroTipo: ""
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
  },

  computed: {
    torneosFiltrados() {
      return this.torneos.filter(torneo => {
        const coincideBusqueda =
          this.filtroBusqueda === "" ||
          torneo.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
          torneo.tipo.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
          torneo.estado.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

        const coincideEstado =
          this.filtroEstado === "" || torneo.estado === this.filtroEstado;

        const coincideTipo =
          this.filtroTipo === "" || torneo.tipo === this.filtroTipo;

        return coincideBusqueda && coincideEstado && coincideTipo;
      });
    }
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
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 1.1rem;
}

/* Modo oscuro: estilos para input y select placeholders */
:deep(body[theme="custom-dark"]) ::placeholder {
  color: #dddddd !important;
  opacity: 1; /* Mejora la visibilidad en algunos navegadores */
}

/* Si usas selects y quieres también texto blanco en modo oscuro */
:deep(body[theme="custom-dark"]) select {
  color: #ffffff !important;
}

</style>