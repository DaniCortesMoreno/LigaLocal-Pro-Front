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
  <section class="text-center py-5 border-bottom hero-section">
    <div class="container py-5">
      <h1 class="display-3 fw-bold text-dark mb-3">⚽ LigaLocal Pro</h1>
      <p class="lead text-muted mb-4">Organiza torneos de fútbol de forma rápida, sencilla y profesional.</p>
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <router-link
          v-if="!loggedIn"
          to="/registro"
          class="btn btn-primary btn-lg px-4 shadow-sm">
          <i class="bi bi-person-plus me-2"></i> ¡Empieza ahora!
        </router-link>

        <router-link
          to="/torneos"
          class="btn btn-outline-secondary btn-lg px-4">
          <i class="bi bi-search me-2"></i> Explorar torneos
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>

