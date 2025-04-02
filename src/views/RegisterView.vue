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
                nombre: yup.string().required("Necesitamos un nombre!").min(3).max(20),
                apellidos: yup.string().required("Necesitamos tus apellidos!").min(3).max(50),
                email: yup.string().email().required("Necesitamos tu correo!"),
                password: yup.string().required("Pon una contraseña de mínimo 6 caracteres").min(6),
                password_confirmation: yup.string().required("Repite la contraseña").oneOf([yup.ref("password")], "Las contraseña deben coincidir"),
            });
        }
    },

    methods: {
        ...mapActions(useUserStore, ["register"]),

        onSubmit(values) {
            if (this.register(values.nombre, values.apellidos, values.password, values.email, values.password_confirmation)) {
                router.push("/");
            } else {
                alert("El usuario no ha podido ser creado");
            }
        }
    }


}

</script>

<template>
    <div class="container py-5" style="max-width: 600px;">
      <h2 class="text-center mb-4">Registro de Usuario</h2>
  
      <Form :validation-schema="mySchema" @submit="onSubmit">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre</label>
          <Field name="nombre" type="text" class="form-control" id="nombre" />
          <ErrorMessage name="nombre" class="text-danger small" />
        </div>
  
        <div class="mb-3">
          <label for="apellidos" class="form-label">Apellidos</label>
          <Field name="apellidos" type="text" class="form-control" id="apellidos" />
          <ErrorMessage name="apellidos" class="text-danger small" />
        </div>
  
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <Field name="email" type="email" class="form-control" id="email" />
          <ErrorMessage name="email" class="text-danger small" />
        </div>
  
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <Field name="password" type="password" class="form-control" id="password" />
          <ErrorMessage name="password" class="text-danger small" />
        </div>
  
        <div class="mb-4">
          <label for="password_confirmation" class="form-label">Repetir contraseña</label>
          <Field name="password_confirmation" type="password" class="form-control" id="password_confirmation" />
          <ErrorMessage name="password_confirmation" class="text-danger small" />
        </div>
  
        <button type="submit" class="btn btn-primary w-100">Registrarme</button>
      </Form>
    </div>
  </template>

<style>
.error-feedback {
    color: red;
}
</style>