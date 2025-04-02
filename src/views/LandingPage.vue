<template>
    <header class="masthead text-white text-center">
      <div class="container d-flex align-items-center flex-column">
        <h1 class="masthead-heading mb-0">LigaLocal Pro</h1>
        <p class="masthead-subheading font-weight-light mb-4">Organiza torneos de fútbol 7, sala o 11 con facilidad</p>
        <div class="mt-4">
          <router-link to="/registro" class="btn btn-primary btn-lg me-3">Registrarse</router-link>
          <router-link to="/torneos" class="btn btn-outline-light btn-lg">Ver torneos</router-link>
        </div>
      </div>
    </header>
  
    <section class="page-section bg-primary text-white mb-0" id="about">
      <div class="container">
        <h2 class="page-section-heading text-center text-uppercase text-white">Sobre la plataforma</h2>
        <div class="divider-custom divider-light">
          <div class="divider-custom-line"></div>
          <div class="divider-custom-icon"><i class="bi bi-star-fill"></i></div>
          <div class="divider-custom-line"></div>
        </div>
        <div class="row">
          <div class="col-lg-4 ms-auto"><p class="lead">Crea torneos personalizados y gestiona tus competiciones fácilmente.</p></div>
          <div class="col-lg-4 me-auto"><p class="lead">Registra jugadores, controla estadísticas y comparte resultados con tu comunidad.</p></div>
        </div>
      </div>
    </section>
  
    <section class="page-section" id="contact">
      <div class="container">
        <h2 class="page-section-heading text-center text-uppercase text-secondary mb-0">Contacto</h2>
        <div class="divider-custom">
          <div class="divider-custom-line"></div>
          <div class="divider-custom-icon"><i class="bi bi-envelope-fill"></i></div>
          <div class="divider-custom-line"></div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-8 col-xl-7">
            <form>
              <div class="form-floating mb-3">
                <input class="form-control" id="name" type="text" placeholder="Nombre" />
                <label for="name">Nombre</label>
              </div>
              <div class="form-floating mb-3">
                <input class="form-control" id="email" type="email" placeholder="Email" />
                <label for="email">Email</label>
              </div>
              <div class="form-floating mb-3">
                <textarea class="form-control" id="message" placeholder="Mensaje" style="height: 10rem"></textarea>
                <label for="message">Mensaje</label>
              </div>
              <button class="btn btn-primary btn-xl w-100" type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  // No se requiere lógica por ahora
  </script>
  
  <style scoped>
  .masthead {
    background-image: url('/assets/img/bg-masthead.jpg');
    background-size: cover;
    background-position: center;
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
  .masthead-heading {
    font-size: 3rem;
    font-weight: 700;
  }
  .masthead-subheading {
    font-size: 1.25rem;
    font-style: italic;
  }
  .divider-custom {
    margin: 1.5rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .divider-custom-line {
    width: 100px;
    height: 1px;
    background-color: #2c3e50;
    margin: 0 1rem;
  }
  .divider-custom-icon {
    font-size: 1.5rem;
  }
  </style>
  