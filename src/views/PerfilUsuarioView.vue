<script setup>
import { useUserStore } from "@/stores";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { reactive } from "vue";

// Tienda de usuario (Pinia)
const userStore = useUserStore();

const perfil = reactive({
  nombre: userStore.user?.nombre || '',
  apellidos: userStore.user?.apellidos || '',
  email: userStore.user?.email || ''
});

const schema = yup.object({
  nombre: yup.string().required("Nombre requerido").min(3),
  apellidos: yup.string().required("Apellidos requeridos").min(3),
  email: yup.string().email().required("Correo requerido")
});

function onSubmit() {
  userStore.actualizarPerfil(perfil);
  alert("Perfil actualizado correctamente.");
}
</script>


<template>
    <div class="container py-5" style="max-width: 600px;">
      <h2 class="text-center mb-4">Mi Perfil</h2>
  
      <Form :validation-schema="schema" @submit="onSubmit">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre</label>
          <Field name="nombre" v-model="perfil.nombre" class="form-control" />
          <ErrorMessage name="nombre" class="text-danger small" />
        </div>
  
        <div class="mb-3">
          <label for="apellidos" class="form-label">Apellidos</label>
          <Field name="apellidos" v-model="perfil.apellidos" class="form-control" />
          <ErrorMessage name="apellidos" class="text-danger small" />
        </div>
  
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <Field name="email" v-model="perfil.email" type="email" class="form-control" />
          <ErrorMessage name="email" class="text-danger small" />
        </div>
  
        <button type="submit" class="btn btn-success w-100 mt-3">Guardar cambios</button>
      </Form>
    </div>
  </template>