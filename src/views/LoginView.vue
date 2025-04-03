<script>
import { mapActions } from "pinia";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useUserStore } from "@/stores";
import router from "@/router";

export default {
  components: {
    Field,
    Form,
    ErrorMessage
  },

  computed: {
    mySchema() {
      return yup.object({
        email: yup.string().email().required("Correo necesario."),
        password: yup.string().required("Contraseña necesaria.").min(6),
      });
    }
  },

  methods: {
    ...mapActions(useUserStore, ["login"]),

    async onSubmit(values) {
      const success = await this.login(values.email, values.password);
      if (success) {
        router.push("/");
      } else {
        alert("Usuario o contraseña incorrecta.");
      }
    }
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center py-5 min-vh-100">
    <div class="card shadow-lg p-4" style="max-width: 450px; width: 100%;">
      <div class="text-center mb-4">
        <i class="bi bi-box-arrow-in-right display-4 text-primary"></i>
        <h3 class="mt-2">Iniciar sesión</h3>
        <p class="text-muted small">Accede a tu cuenta para gestionar tus torneos</p>
      </div>

      <Form :validation-schema="mySchema" @submit="onSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
            <Field name="email" type="email" class="form-control" id="email" placeholder="tucorreo@ejemplo.com" />
          </div>
          <ErrorMessage name="email" class="text-danger small" />
        </div>

        <div class="mb-4">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
            <Field name="password" type="password" class="form-control" id="password" placeholder="••••••••" />
          </div>
          <ErrorMessage name="password" class="text-danger small" />
        </div>

        <button type="submit" class="btn btn-primary w-100">Entrar</button>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
