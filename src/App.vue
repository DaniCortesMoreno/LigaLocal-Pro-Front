<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import AppMessages from './components/AppMessages.vue';
import Footer from './components/Footer.vue';

</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <main class="flex-fill">
      <router-view />
      <AppMessages />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Importaciones */
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.2/zephyr/bootstrap.min.css');

/* Estilo general del body */
body {
  background-color: #f8f9fa;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Enlaces */
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

/* Formularios */
input[type="text"],
input[type="email"],
input[type="password"],
select,
textarea {
  border-radius: 0.5rem !important;
}

/* Botones */
.btn {
  border-radius: 0.5rem !important;
}

/* Cards */
.card {
  border-radius: 1rem !important;
}

/* Tables */
.table {
  border-radius: 0.75rem !important;
  overflow: hidden;
}

/* Errores de validación */
.text-danger.small {
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}
</style>

