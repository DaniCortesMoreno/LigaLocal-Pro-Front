<script>
import { useUserStore } from '@/stores';
import { mapActions, mapState } from 'pinia';

export default {
  name: 'PartidoView',
  props: {
    id: String
  },
  data() {
    return {
      partido: null,
      comentarios: [],
      nuevoComentario: '',
      enviando: false,
      paginaComentarios: 1,
      hayMasComentarios: true,
      torneo: null,
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  async mounted() {
    await this.cargarPartido();
    await this.cargarComentariosIniciales();
    const comentarios = await this.cargarComentarios(this.id);

    // Enriquecer cada comentario con el nombre del usuario
    for (const comentario of comentarios) {
      const usuario = await this.getUser(comentario.user_id);
      comentario.nombre_usuario = `${usuario.data.nombre} ${usuario.data.apellidos}`;
      comentario.foto_usuario = usuario.data.foto;
    }

    this.comentarios = comentarios;
  },
  methods: {
    ...mapActions(useUserStore, ['cargarComentarios', 'enviarComentario', 'getPartido', 'getUser', 'borrarComentario'
      , 'getTorneo'
    ]),
    async cargarPartido() {
      this.partido = await this.getPartido(this.id);
      this.torneo = await this.getTorneo(this.partido.torneo_id);

    },
    async mandarComentario() {
      if (!this.nuevoComentario.trim()) return;
      this.enviando = true;
      try {
        const nuevo = await this.enviarComentario(this.id, this.nuevoComentario);

        // Obtener y añadir el nombre del usuario al comentario nuevo
        const usuario = await this.getUser(nuevo.user_id);
        nuevo.nombre_usuario = `${usuario.data.nombre} ${usuario.data.apellidos}`;
        nuevo.foto_usuario = usuario.data.foto;

        this.comentarios.unshift(nuevo);
        this.nuevoComentario = '';
      } catch (error) {
        console.log(error);
      } finally {
        this.enviando = false;
      }
    }
    ,

    formatFecha(fecha) {
      return new Date(fecha).toLocaleString('es-ES');
    },
    async cargarComentariosIniciales() {
      this.paginaComentarios = 1;
      this.comentarios = [];

      const nuevos = await this.cargarComentarios(this.id, this.paginaComentarios);
      this.procesarComentarios(nuevos);
    },

    async verMasComentarios() {
      this.paginaComentarios++;
      const nuevos = await this.cargarComentarios(this.id, this.paginaComentarios);
      if (nuevos.length === 0) {
        this.hayMasComentarios = false;
        return;
      }
      this.procesarComentarios(nuevos);
    },

    async procesarComentarios(lista) {
      for (const comentario of lista) {
        const usuario = await this.getUser(comentario.user_id);
        comentario.nombre_usuario = `${usuario.data.nombre} ${usuario.data.apellidos}`;
        comentario.foto_usuario = usuario.data.foto;
        this.comentarios.push(comentario);
      }
    },

    async eliminarComentario(comentarioId) {
      if (confirm('¿Seguro que deseas eliminar este comentario?')) {
        await this.borrarComentario(comentarioId);
        this.comentarios = this.comentarios.filter(comentario => comentario.id !== comentarioId);
      }
    }
  },
}
</script>
<template>
  <div class="container py-5" v-if="partido">
    <div class="mb-4 text-center" v-if="torneo">
      <h3 class="text-primary mb-1">
        <router-link :to="`/torneos/${torneo.id}`" class="text-decoration-none text-primary">
          {{ torneo.nombre }}
        </router-link>
      </h3>
      <div class="text-muted small">
        <i class="bi bi-trophy me-1"></i> Tipo: {{ torneo.formato.toUpperCase() }} |
        <i class="bi bi-eye me-1"></i> Visibilidad: {{ torneo.visibilidad }}
      </div>
    </div>

    <div class="card shadow-sm p-4 rounded-4">
      <div class="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
        <div class="text-center mb-3 mb-md-0">
          <img :src="partido.equipo1?.logo || '/img/logo-default.png'" class="rounded-circle border mb-2"
            style="width: 80px; height: 80px; object-fit: cover;" alt="Logo equipo 1" />
          <h5 class="mb-0">{{ partido.equipo1?.nombre || 'Equipo 1' }}</h5>
        </div>

        <div class="text-center">
          <div class="fs-1 fw-bold">{{ partido.goles_equipo1 }} - {{ partido.goles_equipo2 }}</div>
          <div class="text-muted">{{ formatFecha(partido.fecha_partido) }}</div>
          <div v-if="partido.arbitro" class="text-muted small mt-1">
            <i class="bi bi-whistle me-1"></i> Árbitro: {{ partido.arbitro }}
          </div>
        </div>

        <div class="text-center mt-3 mt-md-0">
          <img :src="partido.equipo2?.logo || '/img/logo-default.png'" class="rounded-circle border mb-2"
            style="width: 80px; height: 80px; object-fit: cover;" alt="Logo equipo 2" />
          <h5 class="mb-0">{{ partido.equipo2?.nombre || 'Equipo 2' }}</h5>
        </div>
      </div>

      <div v-if="partido.mvp" class="alert alert-success text-center mt-4">
        <i class="bi bi-star-fill text-warning me-2"></i>
        MVP del partido: <strong>{{ partido.mvp.nombre }} {{ partido.mvp.apellidos }}</strong>
      </div>

      <div class="mt-2">
        <span class="badge px-3 py-2 fs-6" :class="{
          'bg-secondary': partido.estado_partido === 'pendiente',
          'bg-info text-dark': partido.estado_partido === 'en juego',
          'bg-success': partido.estado_partido === 'finalizado',
          'bg-warning text-dark': partido.estado_partido === 'aplazado'
        }">
          {{ partido.estado_partido.toUpperCase() }}
        </span>
      </div>


      <hr />

      <!-- Sección de comentarios -->
      <div>
        <h4 class="mb-3">Comentarios</h4>

        <div class="mb-3">
          <textarea v-model="nuevoComentario" class="form-control" rows="3" placeholder="Escribe un comentario..."
            :disabled="enviando"></textarea>
          <button class="btn btn-primary mt-2" @click="mandarComentario" :disabled="enviando || !nuevoComentario">
            Comentar
          </button>
        </div>

        <div v-if="comentarios.length === 0" class="text-muted text-center">
          No hay comentarios todavía.
        </div>

        <ul class="list-group mb-3">
          <li class="list-group-item d-flex align-items-start justify-content-between" v-for="comentario in comentarios"
            :key="comentario.id">
            <div class="d-flex align-items-center">
              <img :src="comentario.foto_usuario || '/img/avatar-default.png'" class="rounded-circle border me-2"
                style="width: 40px; height: 40px; object-fit: cover;" alt="Avatar" />
              <div>
                <strong>{{ comentario.nombre_usuario || 'Usuario' }}</strong>
                <p class="mb-1">{{ comentario.contenido }}</p>
                <small class="text-muted">{{ formatFecha(comentario.created_at) }}</small>
              </div>
            </div>
            <div>
              <button v-if="comentario.puede_borrar" @click="eliminarComentario(comentario.id)"
                class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </li>
        </ul>

        <div class="text-center" v-if="hayMasComentarios">
          <button class="btn btn-outline-secondary" @click="verMasComentarios">
            Ver más comentarios
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.card {
  max-width: 900px;
  margin: auto;
}

img {
  background-color: #fff;
}

.list-group-item {
  background-color: #f8f9fa;
  border: none;
  border-bottom: 1px solid #dee2e6;
}

.list-group-item:last-child {
  border-bottom: none;
}

.card {
  max-width: 900px;
  margin: auto;
}

a {
  transition: 0.2s;
}

a:hover {
  text-decoration: underline;
  color: #0d6efd;
}
</style>