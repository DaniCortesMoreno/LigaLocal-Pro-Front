<script>
import { mapState } from 'pinia';
import { useUserStore } from '@/stores';

export default {
  computed: {
    ...mapState(useUserStore, ['loggedIn'])
  }
}
</script>

<template>
  <section class="bg-white text-center py-5 border-bottom">
    <div class="container py-5">
      <h1 class="display-3 fw-bold text-dark mb-3">LigaLocal Pro</h1>
      <p class="lead text-muted mb-4">Organiza torneos de fútbol de forma rápida, sencilla y profesional.</p>
      <div class="d-flex justify-content-center gap-3">
        <!-- Mostrar solo si NO está loggeado -->
        <router-link
          v-if="!loggedIn"
          to="/registro"
          class="btn btn-primary btn-lg px-4 shadow-sm">
          ¡Empieza ahora!
        </router-link>

        <router-link
          to="/torneos"
          class="btn btn-outline-dark btn-lg px-4">
          Explorar torneos
        </router-link>
      </div>
    </div>
  </section>
</template>
