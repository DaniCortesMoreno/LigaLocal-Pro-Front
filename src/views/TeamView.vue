<script>
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/stores";


export default {
  name: "TeamView",
  props: {
    id: String
  },
  data() {
    return {
      equipo: null,
      jugadores: [],
      coloresEquipacion: {
        Rojo: "#dc3545",
        Azul: "#007bff",
        Verde: "#28a745",
        Amarillo: "#ffc107",
        Negro: "#343a40",
        Blanco: "#f8f9fa",
        Naranja: "#fd7e14",
        Gris: "#6c757d"
      }
    };
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
    puedeGestionar() {
      // Puedes extender esto si guardas el torneo en el equipo
      return this.user && this.user.id === this.equipo?.user_id;
    }
  },
  methods: {
    ...mapActions(useUserStore, ["getEquipo", "getJugadoresPorEquipo", "deleteEquipo"]),

    async cargarEquipo() {
      this.equipo = await this.getEquipo(this.id);
      this.jugadores = await this.getJugadoresPorEquipo(this.id);
    },

    verJugador(id) {
      this.$router.push(`/jugadores/${id}`);
    }


    /*editarEquipo() {
      this.$router.push(`/equipos/${this.id}/editar`);
    },*/

    /*async eliminarEquipo() {
      if (confirm("¿Estás seguro de eliminar este equipo?")) {
        const ok = await this.deleteEquipo(this.id);
        if (ok) {
          this.$router.push(`/torneos/${this.equipo.tournament_id}`);
        }
      }
    }*/
  },
  async mounted() {
    await this.cargarEquipo();
  }
};
</script>

<template>
  <section class="container py-5" v-if="equipo">
    <div class="card shadow-lg rounded-4 border border-light-subtle">
      <div class="card-body">
        <h2 class="text-center text-primary display-4 fw-bold mb-4">
          <i class="bi bi-people-fill me-2"></i> {{ equipo.nombre }}
        </h2>

        <div class="row gy-3 mb-4">
          <div class="col-md-6">
            <i class="bi bi-person-badge-fill text-primary me-2"></i>
            <strong>Entrenador:</strong>
            <span class="text-muted">{{ equipo.entrenador || 'No especificado' }}</span>
          </div>

          <div class="col-md-6">
            <i class="bi bi-palette-fill text-primary me-2"></i>
            <strong>Color de equipación:</strong>
            <span class="badge px-4 py-2 rounded-pill border" :style="{
              backgroundColor: coloresEquipacion[equipo.color_equipacion] || '#dee2e6',
              color: '#000'
            }">
              {{ equipo.color_equipacion || 'Sin definir' }}
            </span>

          </div>
        </div>

        <hr />

        <h4 class="mb-3 text-primary">
          <i class="bi bi-person-lines-fill me-2"></i> Jugadores
        </h4>

        <div v-if="jugadores.length > 0">
          <ul class="list-group list-group-flush">
            <li v-for="jugador in jugadores" :key="jugador.id"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              @click="verJugador(jugador.id)" style="cursor: pointer;">
              <span><i class="bi bi-person me-2"></i>{{ jugador.nombre }} {{ jugador.apellidos }}</span>
              <i class="bi bi-chevron-right"></i>
            </li>
          </ul>
        </div>

        <div v-else class="alert alert-light border mt-4">
          <i class="bi bi-exclamation-circle me-2"></i> Este equipo aún no tiene jugadores.
        </div>

        <!-- Botones de gestión del equipo -->
        <!--
        <div class="mt-4 d-flex gap-2" v-if="puedeGestionar">
          <button class="btn btn-outline-primary" @click="editarEquipo">
            <i class="bi bi-pencil-square me-1"></i> Editar equipo
          </button>
          <button class="btn btn-outline-danger" @click="eliminarEquipo">
            <i class="bi bi-trash-fill me-1"></i> Eliminar equipo
          </button>
        </div>
        -->
      </div>
    </div>
  </section>

  <div class="container py-5 text-center" v-else>
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando equipo...</span>
    </div>
  </div>
</template>
