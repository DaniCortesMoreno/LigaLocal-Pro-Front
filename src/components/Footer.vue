<script>
export default {
  name: "AppFooter",
};
</script>

<template>
  <footer class="bg-white border-top shadow-sm mt-auto py-4">
    <div class="container">
      <div class="row align-items-center text-center text-md-start gy-3">
        <!-- Marca -->
        <div class="col-md-4">
          <h5 class="fw-bold text-primary mb-1">
            <i class="bi bi-shield-check me-2"></i> LigaLocal Pro
          </h5>
          <p class="text-muted small mb-0">Organiza y gestiona tus torneos locales como un profesional.</p>
        </div>

        <!-- Enlaces -->
        <div class="col-md-4">
          <ul class="list-unstyled d-flex flex-column gap-2 small mb-0">
            <li><router-link to="/" class="text-decoration-none text-muted">Inicio</router-link></li>
            <li><router-link to="/torneos" class="text-decoration-none text-muted">Torneos</router-link></li>
            <li><router-link to="/login" class="text-decoration-none text-muted">Iniciar sesión</router-link></li>
            <li><a href="#" class="text-decoration-none text-muted">Política de Privacidad</a></li>
          </ul>
        </div>

        <!-- Redes sociales -->
        <div class="col-md-4 text-md-end">
          <div class="d-flex justify-content-center justify-content-md-end gap-3">
            <a href="https://facebook.com" target="_blank" class="text-muted fs-5"><i class="bi bi-facebook"></i></a>
            <a href="https://twitter.com" target="_blank" class="text-muted fs-5"><i class="bi bi-twitter-x"></i></a>
            <a href="https://instagram.com" target="_blank" class="text-muted fs-5"><i class="bi bi-instagram"></i></a>
            <a href="mailto:contacto@ligalocalpro.com" class="text-muted fs-5"><i class="bi bi-envelope-fill"></i></a>
          </div>
        </div>
      </div>

      <hr class="my-4" />

      <div class="text-center text-muted small">
        © {{ new Date().getFullYear() }} LigaLocal Pro · Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>
