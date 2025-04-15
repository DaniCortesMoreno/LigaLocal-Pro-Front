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

body[theme="custom-dark"] .table {
  background-color: #1f1f1f;
  color: #f1f1f1;
}

body[theme="custom-dark"] .table th {
  background-color: #2a2a2a;
  color: #ffffff;
}

body[theme="custom-dark"] .table td {
  background-color: #1f1f1f;
  color: #e0e0e0;
}

body[theme="custom-dark"] .table tbody tr {
  border-color: #333;
}

body[theme="custom-dark"] .table-striped tbody tr:nth-of-type(odd) {
  background-color: #242424;
}

body[theme="custom-dark"] .badge {
  background-color: #ffc107;
  color: #000;
}

/* Cards */
body[theme="custom-dark"] .card {
  background-color: #242424;
  color: #ffffff;
  border-color: #3a3b42;
}

/* List group items dentro de cards */
body[theme="custom-dark"] .list-group-item {
  background-color: #2e2e2e;
  color: #ffffff;
  border-color: #444;
}

/* Botones generales en modo oscuro */
body[theme="custom-dark"] .btn {
  background-color: #2e2e2e;
  border-color: #444;
  color: #ffffff;
}

body[theme="custom-dark"] .btn:hover {
  background-color: #3a3b42;
  border-color: #555;
  color: #ffffff;
}

/* Botones outline (como btn-outline-secondary) */
body[theme="custom-dark"] .btn-outline-secondary {
  border-color: #888;
  color: #cccccc;
}

body[theme="custom-dark"] .btn-outline-secondary:hover {
  background-color: #444;
  color: #ffffff;
  border-color: #aaa;
}

/* Botones de eliminar (si usas btn-danger) */
body[theme="custom-dark"] .btn-danger {
  background-color: #a32929;
  border-color: #882222;
  color: #ffffff;
}

body[theme="custom-dark"] .btn-danger:hover {
  background-color: #c13434;
  border-color: #a32929;
}

/* Transición suave */
.btn {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Estadísticas: fondo y texto en modo oscuro */
body[theme="custom-dark"] .bg-light-subtle {
  background-color: #2b2b2b !important;
  color: #ffffff !important;
}

/* Ajuste para los bordes */
body[theme="custom-dark"] .border {
  border-color: #444 !important;
}

/* Fuentes visibles dentro de tarjetas de stats */
body[theme="custom-dark"] strong,
body[theme="custom-dark"] label {
  color: #ffffff !important;
}

/* Inputs */
body[theme="custom-dark"] input[type="number"] {
  background-color: #2f2f2f;
  color: #ffffff;
  border-color: #555;
}

/* 🌙 Modo oscuro para modales personalizados */
body[theme="custom-dark"] .modal-custom {
  background-color: #1f1f1f !important;
  color: #ffffff !important;
  border-color: #333;
}

/* Inputs dentro del modal */
body[theme="custom-dark"] .modal-custom input,
body[theme="custom-dark"] .modal-custom select,
body[theme="custom-dark"] .modal-custom textarea {
  background-color: #2a2a2a;
  color: #ffffff;
  border-color: #444;
}

/* Botones dentro del modal */
body[theme="custom-dark"] .modal-custom .btn {
  background-color: #2e2e2e;
  border-color: #555;
  color: #ffffff;
}

body[theme="custom-dark"] .modal-custom .btn:hover {
  background-color: #444;
}

/* Texto: etiquetas, títulos, etc. */
body[theme="custom-dark"] .modal-custom label,
body[theme="custom-dark"] .modal-custom strong,
body[theme="custom-dark"] .modal-custom .modal-title {
  color: #ffffff !important;
}

/* 🌙 Modo oscuro: icono del toggler visible */
body[theme="custom-dark"] .navbar-toggler {
  border-color: #ccc;
}

/* 🌙 Icono de hamburguesa en modo oscuro */
body[theme="custom-dark"] .navbar-light .navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='white' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.navbar-toggler {
  border: 1px solid #888;
  border-radius: 0.75rem;
  padding: 0.4rem 0.6rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.navbar-toggler:hover {
  background-color: #444;
  border-color: #aaa;
}

/* Ajuste para modo oscuro */
body[theme="custom-dark"] .navbar-toggler {
  border-color: #bbb;
  background-color: #2d2d2d;
}

body[theme="custom-dark"] .navbar-toggler:hover {
  background-color: #3c3c3c;
  border-color: #fff;
}


</style>

