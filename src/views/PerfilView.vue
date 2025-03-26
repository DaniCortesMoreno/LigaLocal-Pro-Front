<script>
import { mapState, mapActions } from "pinia";
import { useUserStore } from "@/stores";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "PerfilView",
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data() {
    return {
      form: {
        nombre: "",
        apellidos: "",
        email: ""
      }
    };
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
    schema() {
      return yup.object({
        nombre: yup.string().required("Nombre obligatorio").min(3),
        apellidos: yup.string().required("Apellidos obligatorios").min(3),
        email: yup.string().required("Email obligatorio").email()
      });
    }
  },
  methods: {
    ...mapActions(useUserStore, ["actualizarPerfil"]),
    async onSubmit() {
      const exito = await this.actualizarPerfil(this.form);
      if (exito) {
        alert("Perfil actualizado correctamente.");
      } else {
        alert("Error al actualizar el perfil.");
      }
    }
  },
  mounted() {
    // Rellenar el formulario con los datos actuales del usuario
    if (this.user) {
      this.form.nombre = this.user.nombre;
      this.form.apellidos = this.user.apellidos;
      this.form.email = this.user.email;
    }
  }
};
</script>

<template>
    <div class="container py-5" style="max-width: 600px;">
      <h2 class="text-center mb-4">Mi Perfil</h2>
  
      <Form :validation-schema="schema" @submit="onSubmit">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre</label>
          <Field name="nombre" v-model="form.nombre" class="form-control" />
          <ErrorMessage name="nombre" class="text-danger small" />
        </div>
  
        <div class="mb-3">
          <label for="apellidos" class="form-label">Apellidos</label>
          <Field name="apellidos" v-model="form.apellidos" class="form-control" />
          <ErrorMessage name="apellidos" class="text-danger small" />
        </div>
  
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <Field name="email" v-model="form.email" class="form-control" />
          <ErrorMessage name="email" class="text-danger small" />
        </div>
  
        <button type="submit" class="btn btn-primary w-100 mt-3">Guardar cambios</button>
      </Form>
    </div>
  </template>
  

  