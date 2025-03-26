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
<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Torneos Públicos</h2>

    <div v-if="torneos.length > 0" class="row g-4">
      <div
        class="col-md-6 col-lg-4"
        v-for="torneo in torneos"
        :key="torneo.id"
      >
        <div
          class="card h-100 shadow-sm cursor-pointer"
          @click="verTorneo(torneo.id)"
          style="transition: transform 0.2s; cursor: pointer"
          @mouseover="$event.currentTarget.style.transform = 'scale(1.02)'"
          @mouseleave="$event.currentTarget.style.transform = 'scale(1)'"
        >
          <div class="card-body">
            <h5 class="card-title">{{ torneo.nombre }}</h5>
            <p class="card-text">
              <strong>Tipo:</strong> {{ torneo.tipo }}<br />
              <strong>Inicio:</strong> {{ torneo.fecha_inicio }}<br />
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
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info text-center mt-4">
      No hay torneos públicos disponibles.
    </div>
  </div>
</template>


