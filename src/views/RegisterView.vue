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
        nombre: yup.string().required("Necesitamos un nombre!").min(3).max(20),
        apellidos: yup.string().required("Necesitamos tus apellidos!").min(3).max(50),
        email: yup.string().email().required("Necesitamos tu correo!"),
        password: yup.string().required("Pon una contraseña de mínimo 6 caracteres").min(6),
        password_confirmation: yup
          .string()
          .required("Repite la contraseña")
          .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
      });
    }
  },

  methods: {
    ...mapActions(useUserStore, ["register"]),

    async onSubmit(values) {
      const ok = await this.register(
        values.nombre,
        values.apellidos,
        values.password,
        values.email,
        values.password_confirmation
      );
      if (ok) {
        router.push("/");
      } else {
        alert("El usuario no ha podido ser creado");
      }
    }
  }
};
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center py-5 min-vh-100">
    <div class="card shadow-lg p-4" style="max-width: 550px; width: 100%;">
      <div class="text-center mb-4">
        <i class="bi bi-person-plus-fill display-4 text-primary"></i>
        <h3 class="mt-2">Registro de Usuario</h3>
        <p class="text-muted small">¡Crea una cuenta para empezar a gestionar tus torneos!</p>
      </div>

      <Form :validation-schema="mySchema" @submit="onSubmit">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
            <Field name="nombre" type="text" class="form-control" id="nombre" />
          </div>
          <ErrorMessage name="nombre" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label for="apellidos" class="form-label">Apellidos</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-person-lines-fill"></i></span>
            <Field name="apellidos" type="text" class="form-control" id="apellidos" />
          </div>
          <ErrorMessage name="apellidos" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
            <Field name="email" type="email" class="form-control" id="email" />
          </div>
          <ErrorMessage name="email" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
            <Field name="password" type="password" class="form-control" id="password" />
          </div>
          <ErrorMessage name="password" class="text-danger small" />
        </div>

        <div class="mb-4">
          <label for="password_confirmation" class="form-label">Repetir contraseña</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-shield-lock-fill"></i></span>
            <Field name="password_confirmation" type="password" class="form-control" id="password_confirmation" />
          </div>
          <ErrorMessage name="password_confirmation" class="text-danger small" />
        </div>

        <button type="submit" class="btn btn-primary w-100">Registrarme</button>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
