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
    <div class="card shadow-sm p-4 rounded-4">
      <h2 class="text-center text-primary mb-4">Detalles del Partido</h2>

      <div class="text-center mb-4">
        <img :src="partido.equipo1?.logo || '/img/logo-default.png'" alt="Logo equipo 1"
          class="rounded-circle border me-2" style="width: 50px; height: 50px; object-fit: cover;" />
        <strong class="me-2">{{ partido.equipo1?.nombre || 'Equipo 1' }}</strong>

        <span class="fs-4 mx-3">{{ partido.goles_equipo1 }} - {{ partido.goles_equipo2 }}</span>

        <strong class="ms-2">{{ partido.equipo2?.nombre || 'Equipo 2' }}</strong>
        <img :src="partido.equipo2?.logo || '/img/logo-default.png'" alt="Logo equipo 2"
          class="rounded-circle border ms-2" style="width: 50px; height: 50px; object-fit: cover;" />
      </div>

      <p class="text-center text-muted">
        <i class="bi bi-calendar-event me-1"></i> {{ partido.fecha_partido }}
      </p>

      <div v-if="partido.mvp" class="alert alert-success text-center mt-4">
        <i class="bi bi-star-fill text-warning me-2"></i>
        MVP: <strong>{{ partido.mvp.nombre }} {{ partido.mvp.apellidos }}</strong>
      </div>

      <hr />

      <h4 class="mb-3">Comentarios</h4>

      <div class="mb-3">
        <textarea v-model="nuevoComentario" class="form-control" rows="3" placeholder="Escribe un comentario..."
          :disabled="enviando"></textarea>
        <button class="btn btn-primary mt-2" @click="mandarComentario" :disabled="enviando || !nuevoComentario">
          Comentar
        </button>
      </div>

      <div v-if="comentarios.length === 0" class="text-muted">No hay comentarios todavía.</div>

      <ul class="list-group">
        <li class="list-group-item" v-for="comentario in comentarios" :key="comentario.id">
          <img :src="comentario.foto_usuario || '/img/avatar-default.png'" alt="Avatar"
            class="rounded-circle border me-2" style="width: 40px; height: 40px; object-fit: cover;" />
          <strong>{{ comentario.nombre_usuario || 'Usuario' }}:</strong>{{
            comentario.contenido }}
          <div class="text-muted small">{{ comentario.created_at }}</div>

          <button v-if="this.user.id == this.torneo.user_id" @click="eliminarComentario(comentario.id)" class="btn btn-sm btn-outline-danger text-danger">
            <i class="bi bi-trash"></i>
          </button>
        </li>

        <div class="text-center mt-3" v-if="hayMasComentarios">
          <button class="btn btn-outline-secondary" @click="verMasComentarios">
            Ver más comentarios
          </button>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 800px;
  margin: auto;
}
</style>
