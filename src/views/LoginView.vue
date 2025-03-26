<script>
import { mapActions, mapState } from "pinia";
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

        onSubmit(values) {
            if (this.login(values.email, values.password)) {
                router.push("/");
            } else {
                alert("Usuario o contraseña incorrecta.");
            }
        }
    }
}
</script>

<template>
    <div class="container py-5" style="max-width: 500px;">
      <h2 class="text-center mb-4">Iniciar sesión</h2>
  
      <Form :validation-schema="mySchema" @submit="onSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <Field name="email" type="email" class="form-control" id="email" />
          <ErrorMessage name="email" class="text-danger small" />
        </div>
  
        <div class="mb-4">
          <label for="password" class="form-label">Contraseña</label>
          <Field name="password" type="password" class="form-control" id="password" />
          <ErrorMessage name="password" class="text-danger small" />
        </div>
  
        <button type="submit" class="btn btn-primary w-100">Entrar</button>
      </Form>
    </div>
  </template>

<style>
.error-feedback {
    color: red;
}
</style>