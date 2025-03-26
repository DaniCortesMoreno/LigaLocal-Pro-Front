<script setup>
import { computed } from 'vue'
import { useUserStore } from "@/stores";
import router from '@/router';

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.loggedIn)

const logout = () => {
  userStore.logout()
  router.push("/")
}

const welcomeMessage = computed(() => {
  if (isLoggedIn) {
    return `Bienvenido, ${userStore.user?.nombre} ${userStore.user?.apellidos}`
  } else {
    return ''
  }
})
</script>


<template>
  <!-- Mensaje de bienvenida si está logueado -->
  <div v-if="isLoggedIn" class="bg-light text-end pe-4 py-1 border-bottom small text-muted">
    Bienvenido, <strong>{{ userStore.user?.nombre }} {{ userStore.user?.apellidos }}</strong>
  </div>

  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">LigaLocal Pro</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/torneos">Torneos</router-link>
          </li>

          <!-- Si el usuario NO está autenticado -->
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Iniciar sesión</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/registro">Registrarse</router-link>
            </li>
          </template>

          <!-- Si el usuario SÍ está autenticado -->
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/mis-torneos">Mis Torneos</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/perfil">Mi Perfil</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-link nav-link" @click="logout">Cerrar sesión</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
