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
      jugadores: []
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
  <div class="container py-5" v-if="equipo">
    <div class="card shadow">
      <div class="card-body">
        <h2 class="card-title mb-4 text-primary text-center">{{ equipo.nombre }}</h2>

        <p><strong>Entrenador:</strong> {{ equipo.entrenador || 'No especificado' }}</p>
        <p><strong>Color de equipación:</strong> {{ equipo.color_equipacion || 'Sin definir' }}</p>

        <hr />

        <div v-if="jugadores.length > 0">
          <h5>Jugadores:</h5>
          <ul class="list-group">
            <li v-for="jugador in jugadores" :key="jugador.id" class="list-group-item list-group-item-action" 
            @click="verJugador(jugador.id)" style="cursor: pointer;">
              {{ jugador.nombre }} {{ jugador.apellidos }}
            </li>
          </ul>
        </div>
        <div v-else class="alert alert-light border mt-4">
          Este equipo aún no tiene jugadores.
        </div>

        <!--<div class="mt-4 d-flex gap-2" v-if="puedeGestionar">
            <button class="btn btn-outline-primary" @click="editarEquipo">Editar equipo</button>
            <button class="btn btn-outline-danger" @click="eliminarEquipo">Eliminar equipo</button>
          </div>-->
      </div>
    </div>
  </div>

  <div class="container py-5 text-center" v-else>
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando equipo...</span>
    </div>
  </div>
</template>