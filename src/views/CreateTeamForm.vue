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
    props: {
        torneo_id: {
            type: String
        }
    },

    computed: {
        mySchema() {
            return yup.object({
                nombre: yup.string().required("El nombre del equipo es obligatorio").min(3).max(50),
                color_equipacion: yup.string().required("Selecciona el color de la equipación"),
                entrenador: yup.string().required("Introduce el nombre del entrenador"),
            });
        }
    },

    methods: {
        ...mapActions(useUserStore, ["addEquipo"]),

        async onSubmit(values) {
            const success = await this.addEquipo(this.torneo_id, values);

            if (success) {
                router.push(`/torneos/${this.torneo_id}`);
            } else {
                alert("No se pudo crear el equipo.");
            }
        }

    }

}
</script>


<template>
    <div class="container py-5" style="max-width: 600px">
      <div class="card shadow-sm border-0">
        <div class="card-body p-4">
          <h2 class="mb-4 fw-bold text-primary text-center">Crear nuevo equipo</h2>
  
          <Form :validation-schema="mySchema" @submit="onSubmit">
            <!-- Nombre del equipo -->
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre del equipo</label>
              <Field
                name="nombre"
                type="text"
                class="form-control"
                id="nombre"
                placeholder="Ej: Atlético Alcoyano"
              />
              <ErrorMessage name="nombre" class="text-danger small" />
            </div>
  
            <!-- Color equipación -->
            <div class="mb-3">
              <label for="color_equipacion" class="form-label">Color de la equipación</label>
              <Field
                name="color_equipacion"
                as="select"
                class="form-select"
                id="color_equipacion"
              >
                <option value="" disabled selected>Seleccione un color</option>
                <option value="rojo">Rojo</option>
                <option value="azul">Azul</option>
                <option value="verde">Verde</option>
                <option value="amarillo">Amarillo</option>
                <option value="negro">Negro</option>
                <option value="blanco">Blanco</option>
                <option value="naranja">Naranja</option>
              </Field>
              <ErrorMessage name="color_equipacion" class="text-danger small" />
            </div>
  
            <!-- Entrenador -->
            <div class="mb-4">
              <label for="entrenador" class="form-label">Entrenador</label>
              <Field
                name="entrenador"
                type="text"
                class="form-control"
                id="entrenador"
                placeholder="Ej: Juan Martínez"
              />
              <ErrorMessage name="entrenador" class="text-danger small" />
            </div>
  
            <!-- Botón -->
            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg">Guardar equipo</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </template>
  