<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import AppMessages from './components/AppMessages.vue';
import Footer from './components/Footer.vue';
import { useDark, useToggle } from "@vueuse/core";
const isDark = useDark({
  selector: "body", //element to add attribute to
  attribute: "theme", // attribute name
  valueDark: "custom-dark", // attribute value for dark mode
  valueLight: "custom-light", // attribute value for light mode
});

const toggleDark = useToggle(isDark);
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.2/litera/bootstrap.min.css');


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
.dark {
  background: #16171d;
  color: #fff;
}

/* 🌙 Estilos globales para el modo oscuro */
body[theme="custom-dark"] {
  background-color: #16171d;
  color: #ffffff;
}

/* TEXTOS que podrían quedar en negro */
body[theme="custom-dark"] .text-dark {
  color: #ffffff !important;
}
body[theme="custom-dark"] .text-muted {
  color: #bbbbbb !important;
}
body[theme="custom-dark"] .form-text {
  color: #bbbbbb !important;
}
body[theme="custom-dark"] .badge {
  color: #ffffff !important;
}

/* BACKGROUND LIGHT que oscurecemos */
body[theme="custom-dark"] .bg-light {
  background-color: #1f2027 !important;
}
body[theme="custom-dark"] .bg-white {
  background-color: #1f2027 !important;
}
body[theme="custom-dark"] .bg-body {
  background-color: #1f2027 !important;
}

/* NAVBAR */
body[theme="custom-dark"] .navbar {
  background-color: #1f2027 !important;
  color: #ffffff !important;
}
body[theme="custom-dark"] .navbar .navbar-brand,
body[theme="custom-dark"] .navbar .nav-link {
  color: #ffffff !important;
}
body[theme="custom-dark"] .navbar .nav-link:hover {
  color: #cccccc !important;
}

/* FOOTER */
body[theme="custom-dark"] footer {
  background-color: #1f2027;
  color: #ffffff;
}

/* CARDS */
body[theme="custom-dark"] .card {
  background-color: #24252d;
  color: #ffffff;
  border-color: #3a3b42;
}

/* BUTTONS */
body[theme="custom-dark"] .btn {
  background-color: #2d2e36;
  border-color: #444;
  color: #ffffff;
}
body[theme="custom-dark"] .btn:hover {
  background-color: #3a3b42;
}

/* FORMULARIOS */
body[theme="custom-dark"] input,
body[theme="custom-dark"] textarea,
body[theme="custom-dark"] select {
  background-color: #2d2e36;
  color: #ffffff;
  border: 1px solid #444;
}
body[theme="custom-dark"] input:focus,
body[theme="custom-dark"] textarea:focus,
body[theme="custom-dark"] select:focus {
  background-color: #3a3b42;
  color: #ffffff;
  border-color: #66b2ff;
}

/* TABLAS */
body[theme="custom-dark"] .table {
  background-color: #1e1f25;
  color: #ffffff;
}
body[theme="custom-dark"] .table thead {
  background-color: #2b2c33;
  color: #ffffff;
}
body[theme="custom-dark"] .table-striped tbody tr:nth-of-type(odd) {
  background-color: #25262c;
}

/* ENLACES */
body[theme="custom-dark"] a {
  color: #66b2ff;
}
body[theme="custom-dark"] a:hover {
  color: #99ccff;
}

/* ERRORES Y VALIDACIONES */
body[theme="custom-dark"] .text-danger {
  color: #ff6b6b !important;
}
body[theme="custom-dark"] .text-success {
  color: #66ff99 !important;
}

/* 🎯 Modo oscuro: mejora la visibilidad de todos los placeholders */
body[theme="custom-dark"] ::placeholder {
  color: #dddddd !important;
  opacity: 1 !important;
}

/* Opcional: mejora inputs y selects también */
body[theme="custom-dark"] input,
body[theme="custom-dark"] textarea,
body[theme="custom-dark"] select {
  color: #ffffff !important;
  background-color: #2c2c2c !important;
  border-color: #444 !important;
}
</style>

