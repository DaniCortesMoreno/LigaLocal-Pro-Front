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
      console.log(this.user)
      return esCreador || esEditor;
    },

    puedeVerInvitadoEspectador() {

      if (!this.user || !this.torneo) return false;

      // Es el creador del torneo
      const esCreador = this.user.id === this.torneo.user_id;

      // Es un invitado con rol editor
      const esEditor = this.torneo.invited_users?.some(
        invitado => invitado.id === this.user.id && invitado.pivot?.role === 'editor'
      );

      // Es un invitado con rol espectador
      const esEspectador = this.torneo.invited_users?.some(
        invitado => invitado.id === this.user.id && invitado.pivot?.role === 'viewer'
      )

      return esCreador || esEditor || esEspectador;
    }

  },


  data() {
    return {
      torneo: {

      },
      creadorTorneo: "Cargando...",
      equipos: [],
      partidos: [],
      usuarios: [],
    }
  },
  async mounted() {
    this.torneo = await this.getTorneo(this.id);

    if (this.torneo && this.torneo.user_id) {
      this.creadorTorneo = await this.getCreadorTorneo();
    }

    this.equipos = await this.getTeamsXTorneo(this.id);

    this.partidos = await this.getPartidosXTorneo(this.id);

    this.usuarios = await this.getUsersInvitadosTorneo(this.id)


  },
  methods: {
    ...mapActions(useUserStore, ['getTorneo', 'getUser', 'getTeamsXTorneo', 'getPartidosXTorneo', 'deletePartido', 'getUsersInvitadosTorneo']),

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
    },


  }
}

</script>



<template>
  <div class="container py-5" v-if="torneo && Object.keys(torneo).length > 0">
    <div class="card border-0 shadow-sm rounded-4 p-4">
      <div class="card-body">
        <h2 class="text-center text-primary fw-bold mb-4">{{ torneo.nombre }}</h2>

        <div class="row gy-3">
          <div class="col-md-6">
            <strong>Tipo:</strong> <span class="text-muted">{{ torneo.tipo }}</span>
          </div>
          <div class="col-md-6">
            <strong>Estado:</strong>
            <span class="badge" :class="{
              'bg-success': torneo.estado === 'en curso',
              'bg-warning text-dark': torneo.estado === 'pendiente',
              'bg-danger': torneo.estado === 'finalizado'
            }">
              {{ torneo.estado }}
            </span>
          </div>
          <div class="col-md-6">
            <strong>Inicio:</strong> <span class="text-muted">{{ torneo.fecha_inicio }}</span>
          </div>
          <div class="col-md-6">
            <strong>Fin:</strong> <span class="text-muted">{{ torneo.fecha_fin }}</span>
          </div>
          <div class="col-md-6">
            <strong>Equipos permitidos:</strong> <span class="text-muted">{{ torneo.cantidad_equipos }}</span>
          </div>
          <div class="col-md-6">
            <strong>Jugadores por equipo:</strong> <span class="text-muted">{{ torneo.cantidad_jugadores }}</span>
          </div>
          <div class="col-md-6">
            <strong>Formato:</strong> <span class="text-muted">{{ torneo.formato }}</span>
          </div>
          <div class="col-md-6">
            <strong>Visibilidad:</strong>
            <span class="badge" :class="{
              'bg-info text-dark': torneo.visibilidad === 'público',
              'bg-secondary': torneo.visibilidad === 'privado'
            }">
              {{ torneo.visibilidad }}
            </span>
          </div>
          <div class="col-12">
            <strong>Reglamento:</strong>
            <p class="text-muted">{{ torneo.reglamento }}</p>
          </div>
          <div class="col-12">
            <strong>Gestor del torneo:</strong>
            <p class="text-muted">{{ creadorTorneo }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container text-center py-5" v-else>
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando torneo...</span>
    </div>
  </div>

  <!-- Equipos -->
  <div class="mt-5">
    <TeamList :equipos="equipos" @crearEquipo="crearEquipo" :puedeCrear="esGestorDelTorneo" @verEquipo="verEquipo" />
  </div>

  <!-- Invitación -->
  <div v-if="esGestorDelTorneo" class="mt-4 container">
    <InviteUser :torneoId="torneo.id" />
  </div>

  <!-- Partidos -->
  <div class="container mt-5">
    <h3 class="text-center fw-bold mb-4">Partidos del Torneo</h3>

    <div v-if="partidos.length === 0" class="alert alert-light text-center">
      No hay partidos programados todavía.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle shadow-sm rounded overflow-hidden">
        <thead class="table-primary">
          <tr>
            <th>Equipo 1</th>
            <th>Goles</th>
            <th>Equipo 2</th>
            <th>Fecha / Hora</th>
            <th v-if="esGestorDelTorneo">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="partido in partidos" :key="partido.id">
            <td>{{ partido.equipo1?.nombre || 'Equipo 1' }}</td>
            <td>{{ partido.goles_equipo1 }} - {{ partido.goles_equipo2 }}</td>
            <td>{{ partido.equipo2?.nombre || 'Equipo 2' }}</td>
            <td>{{ partido.fecha_partido }}</td>
            <td v-if="esGestorDelTorneo">
              <button class="btn btn-sm btn-outline-primary me-2" @click="editarPartido(partido.id)">Editar</button>
              <button class="btn btn-sm btn-outline-danger" @click="eliminarPartido(partido.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center mt-3" v-if="esGestorDelTorneo">
      <router-link class="btn btn-success btn-sm" :to="`/torneos/${id}/partidos/nuevo`">
        Crear nuevo partido
      </router-link>
    </div>

    <div v-if="(esGestorDelTorneo || this.user) && usuarios.length > 0">
      <h5>Usuarios Del Torneo</h5>
      <ul>
        <li>{{ creadorTorneo }} (Owner)</li>
        <li v-for="usuario in usuarios" :key="usuario.id">
          {{ usuario.nombre }} {{ usuario.apellidos }} ({{ usuario.role || 'Sin Definir' }})
        </li>
      </ul>
    </div>


  </div>
</template>

<style scoped>
.card-title {
  font-size: 1.8rem;
}

.table thead th {
  vertical-align: middle;
}

.table td,
.table th {
  padding: 0.9rem 1rem;
}
</style>
