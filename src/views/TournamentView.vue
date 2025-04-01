<script>
import { mapActions, mapState } from 'pinia';
import { useUserStore } from '../stores/index'
import TeamList from '@/components/TeamList.vue';
import router from "@/router";
import InviteUser from '@/components/InviteUser.vue';

export default {
  name: "TournamentView",
  props: {
    id: String
  },

  components: {
    TeamList,
    InviteUser
  },

  computed: {
    /*esGestorDelTorneo() {
      return this.user && this.user.id === this.torneo.user_id;
    },*/
    ...mapState(useUserStore, ['user']),
    esGestorDelTorneo() {

      if (!this.user || !this.torneo) return false;

      // Es el creador del torneo
      const esCreador = this.user.id === this.torneo.user_id;

      // Es un invitado con rol editor
      const esEditor = this.torneo.invited_users?.some(
        invitado => invitado.id === this.user.id && invitado.pivot?.role === 'editor'
      );

      return esCreador || esEditor;
    }

  },


  data() {
    return {
      torneo: {

      },
      creadorTorneo: "Cargando...",
      equipos: [],
      partidos: []
    }
  },
  async mounted() {
    this.torneo = await this.getTorneo(this.id);

    if (this.torneo && this.torneo.user_id) {
      this.creadorTorneo = await this.getCreadorTorneo();
    }

    this.equipos = await this.getTeamsXTorneo(this.id);

    this.partidos = await this.getPartidosXTorneo(this.id);
  },
  methods: {
    ...mapActions(useUserStore, ['getTorneo', 'getUser', 'getTeamsXTorneo', 'getPartidosXTorneo', 'deletePartido']),

    async getCreadorTorneo() {
      const response = await this.getUser(this.torneo.user_id);
      if (response && response.success) {
        const user = response.data;
        return `${user.nombre} ${user.apellidos}`;
      } else {
        return "Desconocido";
      }
    },

    eliminarPartido(idPartido) {
      this.deletePartido(idPartido);
      this.partidos = this.partidos.filter(partido => partido.id !== idPartido);
    },

    crearEquipo() {
      // Aquí rediriges al formulario o abres modal, lo que prefieras
      this.$router.push(`/torneos/${this.id}/equipos/crear`);
    },

    editarPartido(idPartido) {
      this.$router.push(`/partidos/${idPartido}/editar`);
    },

    verEquipo(idEquipo) {
      this.$router.push(`/equipos/${idEquipo}`);
    }


  }
}

</script>



<template>
  <div class="container py-5" v-if="torneo && Object.keys(torneo).length > 0">
    <div class="card shadow-lg">
      <div class="card-body">
        <h2 class="card-title text-center mb-4 text-primary">{{ torneo.nombre }}</h2>
        <div class="row">
          <div class="col-md-6 mb-3">
            <strong>Tipo:</strong> {{ torneo.tipo }}
          </div>
          <div class="col-md-6 mb-3">
            <strong>Estado:</strong>
            <span class="badge" :class="{
              'bg-success': torneo.estado === 'en curso',
              'bg-warning text-dark': torneo.estado === 'pendiente',
              'bg-danger': torneo.estado === 'finalizado'
            }">
              {{ torneo.estado }}
            </span>
          </div>

          <div class="col-md-6 mb-3">
            <strong>Fecha de Inicio:</strong> {{ torneo.fecha_inicio }}
          </div>
          <div class="col-md-6 mb-3">
            <strong>Fecha de Fin:</strong> {{ torneo.fecha_fin }}
          </div>

          <div class="col-md-6 mb-3">
            <strong>Equipos Permitidos:</strong> {{ torneo.cantidad_equipos }}
          </div>
          <div class="col-md-6 mb-3">
            <strong>Jugadores por Equipo:</strong> {{ torneo.cantidad_jugadores }}
          </div>

          <div class="col-md-6 mb-3">
            <strong>Formato:</strong> {{ torneo.formato }}
          </div>
          <div class="col-md-6 mb-3">
            <strong>Visibilidad:</strong>
            <span class="badge" :class="{
              'bg-info text-dark': torneo.visibilidad === 'público',
              'bg-secondary': torneo.visibilidad === 'privado'
            }">
              {{ torneo.visibilidad }}
            </span>
          </div>

          <div class="col-12 mt-4">
            <strong>Reglamento:</strong>
            <p class="mt-2">{{ torneo.reglamento }}</p>
          </div>
          <div class="col-12 mt-4">
            <strong>Gestor del Torneo:</strong>
            <p class="mt-2">{{ creadorTorneo }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container py-5 text-center" v-else>
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando torneo...</span>
    </div>
  </div>

  <div>
    <TeamList :equipos="equipos" @crearEquipo="crearEquipo" :puedeCrear="esGestorDelTorneo" @verEquipo="verEquipo">
    </TeamList>
  </div>

  <div>
    <InviteUser v-if="esGestorDelTorneo" :torneoId="torneo.id" class="mt-4 container" />
  </div>


  <div class="mt-5">
    <h3 class="mb-3 text-center">Partidos del Torneo</h3>

    <div v-if="partidos.length === 0" class="alert alert-light text-center">
      No hay partidos programados todavía.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-primary">
          <tr>
            <th>Equipo 1</th>
            <th>Goles</th>
            <th>Equipo 2</th>
            <th>Fecha Hora</th>
            <th v-if="esGestorDelTorneo">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="partido in partidos" :key="partido.id">
            <td>{{ partido.equipo1?.nombre || 'Equipo 1' }}</td>
            <td>{{ partido.goles_equipo1 }} - {{ partido.goles_equipo2 }}</td>
            <td>{{ partido.equipo2?.nombre || 'Equipo 2' }}</td>
            <td>{{ partido.fecha_partido }}</td>
            <td>
              <button v-if="esGestorDelTorneo" class="btn btn-sm btn-outline-primary me-2"
                @click="editarPartido(partido.id)">
                Editar
              </button>
              <button v-if="esGestorDelTorneo" class="btn btn-sm btn-outline-danger"
                @click="eliminarPartido(partido.id)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link v-if="esGestorDelTorneo" class="btn btn-sm btn-success mb-3" :to="`/torneos/${id}/partidos/nuevo`">
      Crear nuevo partido
    </router-link>
  </div>
</template>
