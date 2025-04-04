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
      console.log(this.torneo)
      if (!this.user || !this.torneo) return false;

      // Es el creador del torneo
      const esCreador = this.user.id == this.torneo.user_id;

      // Es un invitado con rol editor
      const esEditor = this.torneo.invited_users?.some(
        invitado => invitado.id == this.user.id && invitado.pivot?.role === 'editor'
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
  <section class="container py-5" v-if="torneo && Object.keys(torneo).length > 0">
    <div class="bg-white shadow-lg rounded-4 p-5 border border-light-subtle">
      <h2 class="text-center text-primary display-4 fw-bold mb-5">
        <i class="bi bi-trophy-fill me-2"></i> {{ torneo.nombre }}
      </h2>

      <div class="row gy-4">
        <div class="col-md-6">
          <i class="bi bi-flag-fill text-primary me-2"></i><strong>Tipo:</strong>
          <span class="text-muted">{{ torneo.tipo }}</span>
        </div>
        <div class="col-md-6">
          <i class="bi bi-stopwatch-fill text-primary me-2"></i><strong>Estado:</strong>
          <span class="badge fs-6" :class="{
            'bg-success': torneo.estado === 'en curso',
            'bg-warning text-dark': torneo.estado === 'pendiente',
            'bg-danger': torneo.estado === 'finalizado'
          }">
            {{ torneo.estado }}
          </span>
        </div>
        <div class="col-md-6">
          <i class="bi bi-calendar-event text-primary me-2"></i><strong>Inicio:</strong>
          <span class="text-muted">{{ torneo.fecha_inicio }}</span>
        </div>
        <div class="col-md-6">
          <i class="bi bi-calendar-check text-primary me-2"></i><strong>Fin:</strong>
          <span class="text-muted">{{ torneo.fecha_fin }}</span>
        </div>
        <!--<div class="col-md-6">
        <i class="bi bi-people-fill text-primary me-2"></i><strong>Equipos permitidos:</strong>
        <span class="text-muted">{{ torneo.cantidad_equipos }}</span>
      </div>-->
        <!--<div class="col-md-6">
        <i class="bi bi-person-lines-fill text-primary me-2"></i><strong>Jugadores por equipo:</strong>
        <span class="text-muted">{{ torneo.cantidad_jugadores }}</span>
      </div>-->
        <div class="col-md-6">
          <i class="bi bi-diagram-3-fill text-primary me-2"></i><strong>Formato:</strong>
          <span class="text-muted">{{ torneo.formato }}</span>
        </div>
        <div class="col-md-6">
          <i class="bi bi-eye-fill text-primary me-2"></i><strong>Visibilidad:</strong>
          <span class="badge fs-6 text-dark" :class="{
            'bg-success': torneo.visibilidad?.toLowerCase() === 'público',
            'bg-secondary': torneo.visibilidad?.toLowerCase() === 'privado'
          }">
            <i class="bi bi-globe me-1"></i> {{ torneo.visibilidad }}
          </span>


        </div>
        <div class="col-12">
          <i class="bi bi-journal-text text-primary me-2"></i><strong>Reglamento:</strong>
          <p class="text-muted border-start border-3 ps-3">{{ torneo.reglamento }}</p>
        </div>
        <div class="col-12">
          <i class="bi bi-person-fill text-primary me-2"></i><strong>Gestor del torneo:</strong>
          <p class="text-muted">{{ creadorTorneo }}</p>
        </div>
      </div>
    </div>
  </section>


  <div class="container text-center py-5" v-else>
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando torneo...</span>
    </div>
  </div>

  <!-- Equipos -->
  <section class="container mt-5">
    <TeamList :equipos="equipos" @crearEquipo="crearEquipo" :puedeCrear="esGestorDelTorneo" @verEquipo="verEquipo" />
  </section>



  <!-- Partidos -->
  <section class="container mt-5">
    <div class="card shadow-sm rounded-3">
      <div class="card-body">
        <h3 class="text-center fw-bold mb-4 text-primary">Partidos del Torneo</h3>

        <div v-if="partidos.length === 0" class="alert alert-light text-center">
          No hay partidos programados todavía.
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle shadow-sm rounded overflow-hidden">
            <thead class="table-dark">
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
      </div>
    </div>
  </section>

  <section v-if="esGestorDelTorneo" class="container mt-5 mb-5">
  <div class="row g-4">
    <!-- Lista de usuarios -->
    <div
      v-if="usuarios.length > 0"
      class="col-md-6"
    >
      <div class="card shadow-sm p-4 h-100">
        <h5 class="mb-3">Usuarios del Torneo</h5>
        <ul class="list-group">
          <li class="list-group-item">{{ creadorTorneo }} (Owner)</li>
          <li
            v-for="usuario in usuarios"
            :key="usuario.id"
            class="list-group-item"
          >
            {{ usuario.nombre }} {{ usuario.apellidos }} ({{ usuario.role || 'Sin Definir' }})
          </li>
        </ul>
      </div>
    </div>

    <!-- Formulario de invitación -->
    <div :class="usuarios.length > 0 ? 'col-md-6' : 'col-12'">
      <div class="card shadow-sm p-4 h-100">
        <h5 class="mb-3">Invitar usuario</h5>
        <InviteUser :torneoId="torneo.id" />
      </div>
    </div>
  </div>
</section>




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
