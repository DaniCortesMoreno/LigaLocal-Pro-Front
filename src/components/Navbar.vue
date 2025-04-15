<script setup>
import { computed } from 'vue'
import { useUserStore } from "@/stores"
import router from '@/router'
import { useDark, useToggle } from '@vueuse/core'
import { Collapse } from 'bootstrap'
import { ref } from 'vue'

const menuAbierto = ref(false)


const isDark = useDark()
const toggleDark = useToggle(isDark)

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.loggedIn)

const logout = () => {
  userStore.logout()
  router.push("/")
}


const cerrarMenu = () => {
  const el = document.getElementById('navbarMenu')
  if (el) {
    const collapseInstance = Collapse.getInstance(el) || new Collapse(el, { toggle: false })
    collapseInstance.hide()
    menuAbierto.value = false
  }
}

const toggleMenu = () => {
  const el = document.getElementById('navbarMenu')
  if (el && !el.classList.contains('collapsing')) {
    const instance = Collapse.getInstance(el) || new Collapse(el, { toggle: false })
    menuAbierto.value ? instance.hide() : instance.show()
    menuAbierto.value = !menuAbierto.value
  }
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
      <!-- Marca -->
      <router-link class="navbar-brand fw-bold text-primary fs-4" to="/">LigaLocal Pro</router-link>

      <!-- BOTONES VISIBLES SOLO EN MOBILE -->
      <div class="d-lg-none d-flex align-items-center gap-2 ms-auto">
        <!-- Hamburguesa primero -->
        <!-- Con animación -->
        <button class="custom-toggler animated" :class="{ open: menuAbierto }" @click="toggleMenu"
          aria-label="Abrir menú">
          <span></span>
          <span></span>
          <span></span>
        </button>


        <!-- 2️⃣ Toggle después -->
        <button class="btn btn-outline-secondary btn-sm" @click="toggleDark()" title="Cambiar tema">
          <i :class="isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill'"></i>
        </button>
      </div>


      <!-- Menú -->
      <div class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">
          <li class="nav-item">
            <router-link class="nav-link fw-medium" to="/torneos" @click="cerrarMenu">Torneos</router-link>
          </li>

          <!-- No logueado -->
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link fw-medium" to="/login" @click="cerrarMenu">Iniciar sesión</router-link>
            </li>
            <li class="nav-item">
              <router-link class="btn btn-primary btn-sm px-3" to="/registro"
                @click="cerrarMenu">Registrarse</router-link>
            </li>
          </template>

          <!-- Logueado -->
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link fw-medium" to="/mis-torneos" @click="cerrarMenu">Mis Torneos</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link fw-medium" to="/mis-torneos-invitado" @click="cerrarMenu">Mis Torneos
                Invitado</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link fw-medium" to="/perfil" @click="cerrarMenu">Mi Perfil</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-secondary btn-sm px-3" @click="() => { logout(); cerrarMenu() }">Cerrar
                sesión</button>
            </li>

            <!-- Toggle visible solo en desktop -->
            <li class="nav-item d-none d-lg-block">
              <button class="btn btn-outline-secondary btn-sm" @click="toggleDark()" title="Cambiar tema">
                <i :class="isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill'"></i>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>


<style>
.custom-toggler.animated {
  width: 30px;
  height: 24px;
  position: relative;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.custom-toggler.animated span {
  position: relative;
  height: 3px;
  width: 100%;
  background: #333;
  border-radius: 3px;
  transition: all 0.3s ease;
}

body[theme="custom-dark"] .custom-toggler.animated span {
  background: #fff;
}

/* Animación cuando está abierto */
.custom-toggler.animated.open span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.custom-toggler.animated.open span:nth-child(2) {
  opacity: 0;
}

.custom-toggler.animated.open span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.custom-toggler.animated:hover {
  opacity: 0.8;
}


</style>