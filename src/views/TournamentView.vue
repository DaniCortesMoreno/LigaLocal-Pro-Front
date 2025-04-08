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
      const esCreador = this.user.id == this.torneo.user_id;

      // Es un invitado con rol editor
      const esEditor = this.torneo.invited_users?.some(
        invitado => invitado.id == this.user.id && invitado.pivot?.role === 'editor'
      );
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
      clasificacion: [],
      pestañaActiva: 'equipos', // pestaña activa
      ranking: [],
      ordenRanking: 'goles',
      ordenDesc: true,


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
    ...mapActions(useUserStore, ['getTorneo', 'getUser', 'getTeamsXTorneo', 'getPartidosXTorneo',
      'deletePartido', 'getUsersInvitadosTorneo', 'getClasificacionTorneo', 'getTeam', 'getRankingTorneo']),
    async getNombreTeam(id) {
      return await this.getTeam(id).nombre;
    },

    async mountedClasificacion() {
      this.clasificacion = await this.getClasificacionTorneo(this.id);
    },

    async mountedRanking() {
      this.ranking = await this.getRankingTorneo(this.id);
      this.ordenarPor(this.ordenRanking); // orden inicial
    },


    ordenarPor(campo) {
      if (this.ordenRanking === campo) {
        this.ordenDesc = !this.ordenDesc;
      } else {
        this.ordenRanking = campo;
        this.ordenDesc = true;
      }

      this.ranking.sort((a, b) => {
        if (this.ordenDesc) {
          return b[campo] - a[campo];
        } else {
          return a[campo] - b[campo];
        }
      });
    },


    cambiarPestana(nombre) {
      this.pestañaActiva = nombre;

      if (nombre === 'clasificacion') {
        this.mountedClasificacion();
      } else if (nombre === 'ranking') {
        this.mountedRanking();
      }
    },

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
          <i class="bi bi-flag-fill text-primary me-2"></i><strong>Tipo: </strong>
          <span class="text-muted">{{ torneo.tipo }}</span>
        </div>
        <div class="col-md-6">
          <i class="bi bi-stopwatch-fill text-primary me-2"></i><strong>Estado: </strong>
          <span class="badge fs-6" :class="{
            'bg-success': torneo.estado === 'en curso',
            'bg-warning text-dark': torneo.estado === 'pendiente',
            'bg-danger': torneo.estado === 'finalizado'
          }">
            {{ torneo.estado }}
          </span>
        </div>
        <div class="col-md-6">
          <i class="bi bi-calendar-event text-primary me-2"></i><strong>Inicio: </strong>
          <span class="text-muted">{{ torneo.fecha_inicio }}</span>
        </div>
        <div class="col-md-6">
          <i class="bi bi-calendar-check text-primary me-2"></i><strong>Fin: </strong>
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
          <i class="bi bi-diagram-3-fill text-primary me-2"></i><strong>Formato: </strong>
          <span class="text-muted">{{ torneo.formato }}</span>
        </div>
        <div class="col-md-6">
          <i class="bi bi-eye-fill text-primary me-2"></i><strong>Visibilidad: </strong>
          <span class="badge fs-6 text-dark" :class="{
            'bg-success': torneo.visibilidad?.toLowerCase() === 'público',
            'bg-secondary': torneo.visibilidad?.toLowerCase() === 'privado'
          }">
            <i class="bi bi-globe me-1"></i> {{ torneo.visibilidad }}
          </span>


        </div>
        <div class="col-12">
          <i class="bi bi-journal-text text-primary me-2"></i><strong>Reglamento: </strong>
          <p class="text-muted border-start border-3 ps-3">{{ torneo.reglamento }}</p>
        </div>
        <div class="col-12">
          <i class="bi bi-person-fill text-primary me-2"></i><strong>Gestor del torneo: </strong>
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


  <!-- Navegación entre pestañas -->
  <div class="container mt-5">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: pestañaActiva === 'equipos' }" href="#"
          @click.prevent="cambiarPestana('equipos')">
          <i class="bi bi-people-fill me-1"></i> Equipos
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: pestañaActiva === 'partidos' }" href="#"
          @click.prevent="cambiarPestana('partidos')">
          <i class="bi bi-calendar-event me-1"></i> Partidos
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: pestañaActiva === 'clasificacion' }" href="#"
          @click.prevent="cambiarPestana('clasificacion')">
          <i class="bi bi-list-ol me-1"></i> Clasificación
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: pestañaActiva === 'ranking' }" href="#"
          @click.prevent="cambiarPestana('ranking')">
          <i class="bi bi-bar-chart-fill me-1"></i> Ranking
        </a>
      </li>

    </ul>
  </div>

  <!-- Equipos -->
  <section class="container mt-4" v-if="pestañaActiva === 'equipos'">
    <TeamList :equipos="equipos" @crearEquipo="crearEquipo" :puedeCrear="esGestorDelTorneo" @verEquipo="verEquipo" />
  </section>



  <!-- Partidos -->
  <section class="container mt-5" v-if="pestañaActiva === 'partidos'">
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


    <!-- Clasificacion -->
  </section>
  <section class="container mt-4" v-if="pestañaActiva === 'clasificacion'">
    <div class="card shadow-sm rounded-4 p-4">
      <h3 class="text-center mb-4 text-primary">
        <i class="bi bi-list-ol me-2"></i>Clasificación del Torneo
      </h3>

      <div v-if="clasificacion.length === 0" class="alert alert-warning text-center">
        Aún no hay datos suficientes para calcular la clasificación.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>GF</th>
              <th>GC</th>
              <th>DIF</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody> 
            <tr v-for="(equipo, index) in clasificacion" :key="equipo.id"> <!--:class="{ 'primer-puesto': index == 0 }"-->
              <td>{{ index + 1 }}</td>
              <td>{{ equipo.nombre_equipo }}</td>
              <td>{{ equipo.jugados }}</td>
              <td>{{ equipo.ganados }}</td>
              <td>{{ equipo.empatados }}</td>
              <td>{{ equipo.perdidos }}</td>
              <td>{{ equipo.goles_favor }}</td>
              <td>{{ equipo.goles_contra }}</td>
              <td>{{ equipo.diferencia_goles }}</td>
              <td><strong>{{ equipo.puntos }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="container mt-4" v-if="pestañaActiva === 'ranking'">
    <div class="card shadow-sm rounded-4 p-4">
      <h3 class="text-center mb-4 text-primary">
        <i class="bi bi-bar-chart-fill me-2"></i>Ranking de Jugadores
      </h3>

      <div v-if="ranking.length === 0" class="alert alert-warning text-center">
        Aún no hay estadísticas suficientes para mostrar el ranking.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover table-striped">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Equipo</th>
              <th @click="ordenarPor('goles')" style="cursor: pointer;">
                Goles
                <i
                  :class="ordenRanking === 'goles' ? (ordenDesc ? 'bi bi-caret-down-fill' : 'bi bi-caret-up-fill') : ''"></i>
              </th>

              <th @click="ordenarPor('asistencias')" style="cursor: pointer;">
                Asistencias
                <i
                  :class="ordenRanking === 'asistencias' ? (ordenDesc ? 'bi bi-caret-down-fill' : 'bi bi-caret-up-fill') : ''"></i>
              </th>

              <th @click="ordenarPor('amarillas')" style="cursor: pointer;">
                Amarillas
                <i
                  :class="ordenRanking === 'amarillas' ? (ordenDesc ? 'bi bi-caret-down-fill' : 'bi bi-caret-up-fill') : ''"></i>
              </th>

              <th @click="ordenarPor('rojas')" style="cursor: pointer;">
                Rojas
                <i
                  :class="ordenRanking === 'rojas' ? (ordenDesc ? 'bi bi-caret-down-fill' : 'bi bi-caret-up-fill') : ''"></i>
              </th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(jugador, index) in ranking" :key="jugador.player_id">
              <td>{{ index + 1 }}</td>
              <td>{{ jugador.nombre }}</td>
              <td>{{ jugador.equipo }}</td>
              <td>{{ jugador.goles }}</td>
              <td>{{ jugador.asistencias }}</td>
              <td>{{ jugador.amarillas }}</td>
              <td>{{ jugador.rojas }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>



  <section v-if="esGestorDelTorneo" class="container mt-5 mb-5">
    <div class="row g-4">
      <!-- Lista de usuarios -->
      <div v-if="usuarios.length > 0" class="col-md-6">
        <div class="card shadow-sm p-4 h-100">
          <h5 class="mb-3">Usuarios del Torneo</h5>
          <ul class="list-group">
            <li class="list-group-item">{{ creadorTorneo }} (Owner)</li>
            <li v-for="usuario in usuarios" :key="usuario.id" class="list-group-item">
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

.table tbody .primer-puesto td {
  background-color: #d4edda !important;
}
</style>
