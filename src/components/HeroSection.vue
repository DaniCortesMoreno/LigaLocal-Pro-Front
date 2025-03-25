<!-- Componente para mostrar la parte del Inicio del banner de arriba-->
<template>
    <section class="bg-light py-5 text-center">
      <div class="container">
        <h1 class="display-4 fw-bold">LigaLocal Pro</h1>
        <p class="lead">Organiza torneos de fútbol de forma fácil, rápida y profesional.</p>
        <div class="mt-4">
          <router-link to="/registro" class="btn btn-primary me-2">¡Empieza ahora!</router-link>
          <router-link to="/torneos" class="btn btn-outline-secondary">Explorar torneos</router-link>
        </div>
      </div>
    </section>
  </template>
  