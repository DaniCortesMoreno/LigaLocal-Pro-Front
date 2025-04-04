<template>
    <div class="container py-5">
      <h2 class="text-center text-primary mb-4">
        <i class="bi bi-trophy-fill me-2"></i> Clasificación
      </h2>
  
      <div v-if="clasificacion.length > 0" class="table-responsive">
        <table class="table table-striped table-bordered shadow-sm">
          <thead class="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>Pts</th>
              <th>Jugados</th>
              <th>Ganados</th>
              <th>Empatados</th>
              <th>Perdidos</th>
              <th>GF</th>
              <th>GC</th>
              <th>DIF</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(equipo, index) in clasificacion" :key="equipo.team_id" class="text-center">
              <td>{{ index + 1 }}</td>
              <td>{{ equipo.nombre }}</td>
              <td>{{ equipo.puntos }}</td>
              <td>{{ equipo.jugados }}</td>
              <td>{{ equipo.ganados }}</td>
              <td>{{ equipo.empatados }}</td>
              <td>{{ equipo.perdidos }}</td>
              <td>{{ equipo.goles_favor }}</td>
              <td>{{ equipo.goles_contra }}</td>
              <td>{{ equipo.diferencia_goles }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-else class="alert alert-info text-center">
        <i class="bi bi-exclamation-circle me-2"></i>
        Todavía no hay datos para mostrar la clasificación.
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from "pinia";
  import { useUserStore } from "@/stores";
  
  export default {
    name: "ClasificacionView",
    props: {
      tournamentId: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        clasificacion: []
      }
    },
    methods: {
      ...mapActions(useUserStore, ["getClasificacionTorneo"]),
      async cargarClasificacion() {
        this.clasificacion = await this.getClasificacionTorneo(this.tournamentId);
      }
    },
    async mounted() {
      await this.cargarClasificacion();
    }
  }
  </script>
  