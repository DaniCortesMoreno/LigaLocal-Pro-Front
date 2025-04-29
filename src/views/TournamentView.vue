<script>
import { mapActions, mapState } from 'pinia';
import { useUserStore } from '../stores/index';
import TeamList from '@/components/TeamList.vue';
import router from "@/router";
import InviteUser from '@/components/InviteUser.vue';
import Bracket from 'vue-tournament-bracket'; // ⬅️ NUEVO
import CalendarioDePartidos from '@/components/CalendarioDePartidos.vue';


export default {
  name: "TournamentView",
  props: {
    id: String
  },

  components: {
    TeamList,
    InviteUser,
    Bracket, // ⬅️ NUEVO
    CalendarioDePartidos
  },

  computed: {
    ...mapState(useUserStore, ['user']),
    esCreadorDelTorneo() {
      return this.user && this.torneo && this.user.id === this.torneo.user_id;
    },
    window() {
      return window;
    },

    esGestorDelTorneo() {
      if (!this.user || !this.torneo) return false;
      const esCreador = this.user.id == this.torneo.user_id;
      const esEditor = this.torneo.invited_users?.some(
        invitado => invitado.id == this.user.id && invitado.pivot?.role === 'editor'
      );
      return esCreador || esEditor;
    },

    puedeVerInvitadoEspectador() {
      if (!this.user || !this.torneo) return false;
      const esCreador = this.user.id === this.torneo.user_id;
      const esEditor = this.torneo.invited_users?.some(
        invitado => invitado.id === this.user.id && invitado.pivot?.role === 'editor'
      );
      const esEspectador = this.torneo.invited_users?.some(
        invitado => invitado.id === this.user.id && invitado.pivot?.role === 'viewer'
      );
      return esCreador || esEditor || esEspectador;
    },

    mostrarBracket() {
      return this.torneo?.formato === 'eliminacion';
    },

    mostrarClasificacion() {
      return this.torneo?.formato === 'liguilla';
    },

    rounds() {
      if (!this.mostrarBracket || this.partidos.length === 0) return [];

      const rounds = [];
      const partidosPorRonda = {};

      for (const partido of this.partidos) {
        const ronda = partido.ronda || 1;
        if (!partidosPorRonda[ronda]) partidosPorRonda[ronda] = [];

        const player1 = partido.equipo1
          ? { id: partido.equipo1.id, name: partido.equipo1.nombre, winner: partido.goles_equipo1 > partido.goles_equipo2 }
          : { id: "bye1", name: "Por definir", winner: false };

        const player2 = partido.equipo2
          ? { id: partido.equipo2.id, name: partido.equipo2.nombre, winner: partido.goles_equipo2 > partido.goles_equipo1 }
          : { id: "bye2", name: "Por definir", winner: false };

        partidosPorRonda[ronda].push({ player1, player2 });
      }

      const rondasOrdenadas = Object.keys(partidosPorRonda)
        .map(r => parseInt(r))
        .sort((a, b) => a - b);

      for (const r of rondasOrdenadas) {
        rounds.push({ games: partidosPorRonda[r] });
      }

      return rounds;
    },

    puedeAbandonarTorneo() {
      if (!this.user || !this.torneo || !this.torneo.invited_users) return false;

      const estaInvitado = this.torneo.invited_users.some(
        invitado => invitado.id === this.user.id
      );

      return !this.esCreadorDelTorneo && estaInvitado;
    }

  },

  data() {
    return {
      torneo: {},
      creadorTorneo: "Cargando...",
      equipos: [],
      partidos: [],
      usuarios: [],
      clasificacion: [],
      pestañaActiva: 'equipos',
      ranking: [],
      ordenRanking: 'goles',
      ordenDesc: true,
      enlaceCopiado: false // 👈
    };
  },

  async mounted() {
    this.torneo = await this.getTorneo(this.id);
    if (this.torneo?.user_id) {
      this.creadorTorneo = await this.getCreadorTorneo();
    }
    this.equipos = await this.getTeamsXTorneo(this.id);
    this.partidos = await this.getPartidosXTorneo(this.id);
    this.usuarios = await this.getUsersInvitadosTorneo(this.id);
  },

  methods: {
    ...mapActions(useUserStore, [
      'getTorneo', 'getUser', 'getTeamsXTorneo', 'getPartidosXTorneo',
      'deletePartido', 'getUsersInvitadosTorneo', 'getClasificacionTorneo',
      'getTeam', 'getRankingTorneo', 'generarPartidosTorneo', 'expulsarUsuario', 'salirDelTorneo',
      'descargarPartidos'
    ]),

    async descargarPartidosPDF() {
      try {
        const blob = await this.descargarPartidos(this.torneo.id);

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `partidos_${this.torneo.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error descargando PDF:', error);
      }
    },

    async generarPartidos() {
      const confirmado = confirm("¿Deseas generar automáticamente los partidos?. Si ya lo hiciste antes, evitar repetirlo.");
      if (!confirmado) return;

      try {
        await this.generarPartidosTorneo(this.torneo.id);
        this.partidos = await this.getPartidosXTorneo(this.torneo.id);
        alert("¡Partidos generados con éxito!");
      } catch (err) {
        alert("Hubo un error generando los partidos.");
      }
    },
    /*ALEATORIO
      async generarPartidos() {
  const idaVuelta = confirm("¿Quieres que sea ida y vuelta? Pulsa 'Aceptar' para ida y vuelta, 'Cancelar' para solo ida.");

  try {
    await this.generarPartidosTorneo(this.torneo.id, idaVuelta);
    this.partidos = await this.getPartidosXTorneo(this.torneo.id);
    alert("¡Partidos generados con éxito!");
  } catch (err) {
    console.error("Error al generar partidos:", err.response?.data || err);
    this.$store.app.setMessage({
      type: 'error',
      message: "Error al generar los partidos"
    });
  }
}
    */

    async getNombreTeam(id) {
      return await this.getTeam(id).nombre;
    },

    async mountedClasificacion() {
      this.clasificacion = await this.getClasificacionTorneo(this.id);
    },

    async mountedRanking() {
      this.ranking = await this.getRankingTorneo(this.id);
      this.ordenarPor(this.ordenRanking);
    },

    ordenarPor(campo) {
      this.ordenRanking === campo ? this.ordenDesc = !this.ordenDesc : (this.ordenRanking = campo, this.ordenDesc = true);
      this.ranking.sort((a, b) => this.ordenDesc ? b[campo] - a[campo] : a[campo] - b[campo]);
    },

    cambiarPestana(nombre) {
      this.pestañaActiva = nombre;
      if (nombre === 'clasificacion') this.mountedClasificacion();
      else if (nombre === 'ranking') this.mountedRanking();
    },

    async getCreadorTorneo() {
      const response = await this.getUser(this.torneo.user_id);
      return response?.success ? `${response.data.nombre} ${response.data.apellidos}` : "Desconocido";
    },

    eliminarPartido(idPartido) {
      this.deletePartido(idPartido);
      this.partidos = this.partidos.filter(p => p.id !== idPartido);
    },

    crearEquipo() {
      this.$router.push(`/torneos/${this.id}/equipos/crear`);
    },

    editarPartido(idPartido) {
      this.$router.push(`/partidos/${idPartido}/editar`);
    },

    verEquipo(idEquipo) {
      this.$router.push(`/equipos/${idEquipo}`);
    },

    async echarUsuario(userId) {
      const confirmado = confirm("¿Seguro que deseas expulsar a este usuario?");
      if (!confirmado) return;
      await this.expulsarUsuario(this.torneo.id, userId);
      this.usuarios = await this.getUsersInvitadosTorneo(this.torneo.id);
    },

    async abandonarTorneo() {
      const confirmado = confirm("¿Seguro que deseas salir del torneo?");
      if (!confirmado) return;
      await this.salirDelTorneo(this.torneo.id);
      this.$router.push('/torneos');
    },
    copiarEnlace() {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        this.enlaceCopiado = true;
        setTimeout(() => {
          this.enlaceCopiado = false;
        }, 3000);
      });
    },

    verPartido(id) {
      this.$router.push(`/partidos/${id}`)
    }



  }
};
</script>



<template>

  <section class="container py-5" v-if="torneo && Object.keys(torneo).length > 0">
    <div class="bg-white shadow-lg rounded-4 p-5 border border-light-subtle">
      <h2 class="text-center text-primary display-4 fw-bold mb-5">
        <i class="bi bi-trophy-fill me-2"></i> {{ torneo.nombre }}
      </h2>

      <!-- Botón para abrir el modal de compartir -->
      <div v-if="esGestorDelTorneo" class="text-center mb-4">
        <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalCompartir">
          <i class="bi bi-share-fill me-1"></i> Compartir torneo
        </button>
      </div>

      <!-- Modal de compartir -->
      <div class="modal fade" id="modalCompartir" tabindex="-1" aria-labelledby="modalCompartirLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content text-center p-4">
            <h5 class="modal-title mb-3" id="modalCompartirLabel">Compartir torneo</h5>
            <p class="text-muted">Elige una opción para compartir este torneo:</p>

            <div class="d-flex justify-content-around mb-3">
              <a :href="`https://wa.me/?text=${encodeURIComponent(window.location.href)}`" target="_blank"
                class="btn btn-success">
                <i class="bi bi-whatsapp me-1"></i> WhatsApp
              </a>

              <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent('¡Mira este torneo! ' + window.location.href)}`"
                target="_blank" class="btn btn-primary">
                <i class="bi bi-twitter me-1"></i> Twitter
              </a>

              <button class="btn btn-outline-secondary" @click="copiarEnlace">
                <i class="bi bi-clipboard me-1"></i> Copiar
              </button>
            </div>

            <div v-if="enlaceCopiado" class="text-success fw-semibold">
              <i class="bi bi-check-circle me-1"></i> ¡Enlace copiado!
            </div>

            <div class="mt-3">
              <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

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
          <i class="bi bi-person-fill text-primary me-2"></i><strong>Creador del torneo: </strong>
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
      <li class="nav-item" v-if="mostrarClasificacion">
        <a class="nav-link" :class="{ active: pestañaActiva === 'clasificacion' }" href="#"
          @click.prevent="cambiarPestana('clasificacion')">
          <i class="bi bi-list-ol me-1"></i> Clasificación
        </a>
      </li>
      <li class="nav-item" v-if="mostrarBracket">
        <a class="nav-link" :class="{ active: pestañaActiva === 'bracket' }" href="#"
          @click.prevent="cambiarPestana('bracket')">
          <i class="bi bi-diagram-2-fill me-1"></i> Eliminatorias
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
              <template v-for="partido in partidos" :key="partido.id">
                <tr @click="verPartido(partido.id)">
                  <td class="d-flex align-items-center">
                    <img v-if="partido.equipo1?.logo" :src="partido.equipo1.logo" alt="Logo equipo 1"
                      class="rounded-circle border me-2 escudo-equipo"
                      style="width: 36px; height: 36px; object-fit: cover;" />
                    <img v-else src="/img/logo-default.png" alt="Logo por defecto"
                      class="rounded-circle border me-2 escudo-equipo"
                      style="width: 36px; height: 36px; object-fit: cover;" />
                    <span>{{ partido.equipo1?.nombre || 'Equipo 1' }}</span>
                  </td>

                  <td>{{ partido.goles_equipo1 }} - {{ partido.goles_equipo2 }}</td>

                  <td class="d-flex align-items-center">
                    <img v-if="partido.equipo2?.logo" :src="partido.equipo2.logo" alt="Logo equipo 2"
                      class="rounded-circle border me-2 escudo-equipo"
                      style="width: 36px; height: 36px; object-fit: cover;" />
                    <img v-else src="/img/logo-default.png" alt="Logo por defecto"
                      class="rounded-circle border me-2 escudo-equipo"
                      style="width: 36px; height: 36px; object-fit: cover;" />
                    <span>{{ partido.equipo2?.nombre || 'Equipo 2' }}</span>
                  </td>

                  <td>{{ partido.fecha_partido }}</td>

                  <td v-if="esGestorDelTorneo">
                    <button class="btn btn-sm btn-outline-primary me-2"
                      @click="editarPartido(partido.id)">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" @click="eliminarPartido(partido.id)">Eliminar</button>
                  </td>
                </tr>

                <tr v-if="partido.mvp">
                  <td colspan="5" class="text-center text-success">
                    <i class="bi bi-star-fill text-warning me-2"></i>
                    MVP del Partido: <strong>{{ partido.mvp.nombre }} {{ partido.mvp.apellidos }}</strong>
                  </td>
                </tr>
              </template>


            </tbody>
          </table>
        </div>

        <div class="text-center mt-3" v-if="esGestorDelTorneo">
          <router-link class="btn btn-success btn-sm" :to="`/torneos/${id}/partidos/nuevo`">
            Crear nuevo partido
          </router-link>
        </div>

        <div class="text-center mt-3" v-if="esGestorDelTorneo">
          <button class="btn btn-outline-secondary btn-sm me-2" @click="generarPartidos">
            <i class="bi bi-shuffle me-1"></i> Generar partidos
          </button>

          <router-link class="btn btn-success btn-sm" :to="`/torneos/${id}/partidos/nuevo`">
            Crear nuevo partido
          </router-link>
        </div>

        <div class="text-center mt-3" v-if="esGestorDelTorneo">
          <button class="btn btn-outline-primary" @click="descargarPartidosPDF">
            Descargar partidos en PDF
          </button>
        </div>

      </div>
    </div>


    <CalendarioDePartidos :partidos="partidos" />


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
            <tr v-for="(equipo, index) in clasificacion" :key="equipo.id">
              <!--:class="{ 'primer-puesto': index == 0 }"-->
              <td>{{ index + 1 }}</td>
              <td class="d-flex align-items-center gap-2">
                <img v-if="equipo.logo" :src="equipo.logo" alt="Foto Equi" class="rounded-circle border escudo-equipo"
                  style="width: 40px; height: 40px; object-fit: cover;" />
                <img v-else src="/img/logo-default.png" alt="Escudo por defecto"
                  class="rounded-circle border escudo-equipo" style="width: 40px; height: 40px; object-fit: cover;" />
                <span>{{ equipo.nombre_equipo }}</span>
              </td>
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
              <td class="d-flex align-items-center gap-2">
                <img v-if="jugador.foto" :src="jugador.foto" alt="Foto Jug" class="rounded-circle border escudo-equipo"
                  style="width: 40px; height: 40px; object-fit: cover;" />
                <img v-else src="/img/avatar-default.png" alt="Avatar por defecto"
                  class="rounded-circle border escudo-equipo" style="width: 40px; height: 40px; object-fit: cover;" />
                <span>{{ jugador.nombre }} {{ jugador.apellido }}</span>
              </td>

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

  <section class="container mt-4" v-if="pestañaActiva === 'bracket' && rounds.length > 0">
    <div class="card shadow-sm rounded-4 p-4">
      <h3 class="text-center mb-4 text-primary">
        <i class="bi bi-diagram-2-fill me-2"></i>Cuadro de Eliminatorias
      </h3>
      <Bracket :rounds="rounds">
        <template #player="{ player }">
          {{ player.name }}
        </template>
      </Bracket>
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
            <li v-for="usuario in usuarios" :key="usuario.id"
              class="list-group-item d-flex justify-content-between align-items-center">
              {{ usuario.nombre }} {{ usuario.apellidos }} ({{ usuario.role || 'Sin Definir' }})

              <button v-if="esGestorDelTorneo && usuario.id !== user.id" @click="echarUsuario(usuario.id)"
                class="btn btn-sm btn-outline-danger">
                Expulsar
              </button>
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


  <!-- Botón de abandonar torneo -->
  <div class="mt-4 text-center" v-if="puedeAbandonarTorneo">
    <button @click="abandonarTorneo" class="btn btn-outline-warning">
      <i class="bi bi-box-arrow-left me-1"></i> Abandonar torneo
    </button>
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

.table tbody .primer-puesto td {
  background-color: #d4edda !important;
}

.btn-outline-primary {
  transition: all 0.2s ease;
}

.btn-outline-primary:hover {
  transform: scale(1.03);
}

.modal-content {
  border-radius: 16px;
  background-color: #fff;
}

.modal-title {
  font-weight: 600;
  color: #0d6efd;
}
</style>