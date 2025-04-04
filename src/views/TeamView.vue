<script>
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/stores";
import PlayerForm from "./PlayerForm.vue";
export default {
  name: "TeamView",
  props: {
    id: String
  },

  components: {
    PlayerForm
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
      },
      mostrarModal: false,
      jugadorEditando: null,
    };
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
    puedeGestionar() {
      console.log(this.equipo)
      // Puedes extender esto si guardas el torneo en el equipo
      const esCreador = this.user && this.user.id === this.equipo.tournament?.user_id;
      const esEditor = this.equipo.tournaments?.invited_users?.some(
        invitado => invitado.id === this.user.id && invitado.pivot?.role === 'editor'
      );
      return esCreador || esEditor;
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
    },

    cerrarModal() {
      this.jugadorEditando = null;
      this.mostrarModal = false;
    },

    abrirModalEdicion(jugador) {
      this.jugadorEditando = jugador;
      this.mostrarModal = true;
    },
    async onJugadorCreado() {
      this.jugadorEditando = null;
      this.mostrarModal = false;
      this.jugadores = await this.getJugadoresPorEquipo(this.id);
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
              <span>
                <i class="bi bi-person me-2"></i>{{ jugador.nombre }} {{ jugador.apellidos }}
              </span>

              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-chevron-right"></i>

                <button v-if="puedeGestionar" class="btn btn-sm btn-outline-secondary" @click.stop="abrirModalEdicion(jugador)"
                   title="Editar jugador">
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
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

        <!-- Botón para crear jugador -->
        <div class="mt-4" v-if="puedeGestionar">
          <button class="btn btn-success w-100" @click="mostrarModal = true">
            <i class="bi bi-person-plus me-2"></i> Añadir Jugador
          </button>
        </div>

        <!-- Modal Vue puro -->
        <div v-if="mostrarModal" class="modal-backdrop-custom">
          <div class="modal-custom">
            <div class="modal-header d-flex justify-content-between align-items-center">
              <h5 class="modal-title">Añadir jugador</h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body mt-3">
              <PlayerForm :teamId="id" :jugador="jugadorEditando" @jugadorCreado="onJugadorCreado"
                @cancelar="cerrarModal" />
            </div>
          </div>
        </div>


      </div>
    </div>
  </section>

  <div class="container py-5 text-center" v-else>
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando equipo...</span>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-custom {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}
</style>
