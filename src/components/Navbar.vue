<script setup>
import { computed } from 'vue'
import { useUserStore } from "@/stores"
import router from '@/router'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.loggedIn)

const logout = () => {
  userStore.logout()
  router.push("/")
}
</script>

<template>
  <!-- Bienvenida -->
  <div v-if="isLoggedIn" class="bg-light small text-muted text-end px-4 py-1 border-bottom">
    Bienvenido, <strong>{{ userStore.user?.nombre }} {{ userStore.user?.apellidos }}</strong>
  </div>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container">
      <router-link class="navbar-brand fw-bold text-primary fs-4" to="/">LigaLocal Pro</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">
          <li class="nav-item">
            <router-link class="nav-link fw-medium" to="/torneos">Torneos</router-link>
          </li>

          <!-- Si no está logueado -->
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link fw-medium" to="/login">Iniciar sesión</router-link>
            </li>
            <li class="nav-item">
              <router-link class="btn btn-primary btn-sm px-3" to="/registro">Registrarse</router-link>
            </li>
          </template>

          <!-- Si está logueado -->
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link fw-medium" to="/mis-torneos">Mis Torneos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/mis-torneos-invitado" class="nav-link fw-medium">Mis Torneos Invitado</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link fw-medium" to="/perfil">Mi Perfil</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-secondary btn-sm px-3" @click="logout">Cerrar sesión</button>
            </li>
            <!--<li class="nav-item">
              <button class="btn btn-sm btn-outline-light" @click="$emit('cambiar-tema')">
                <i class="bi bi-moon-stars"></i> Cambiar tema
              </button>
            </li>-->
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>