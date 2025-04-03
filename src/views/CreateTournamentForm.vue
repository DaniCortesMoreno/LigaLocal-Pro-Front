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
                nombre: yup.string().required("Ponle nombre a tu torneo!").min(3).max(50),
                tipo: yup.string().required("Selecciona un tipo de torneo!"),
                fecha_inicio: yup.date().required("Selecciona una fecha de inicio!"),
                fecha_fin: yup.date(),
                formato: yup.string().required("Selecciona un formato!"),
                reglamento: yup.string(),
                visibilidad: yup.string().required("Selecciona la visibilidad!"),
            });
        }
    },

    methods: {
        ...mapActions(useUserStore, ["addTorneo"]),

        onSubmit(values) {
            const userId = JSON.parse(localStorage.getItem("user")).id;
            const newValues = { ...values, user_id: userId };
            console.log(newValues);
            if (this.addTorneo(newValues)) {
                router.push("/mis-torneos");
            } else {
                alert("El torneo no ha podido ser creado");
            }

        }
    }

}
</script>


<template>
  <div class="container py-5" style="max-width: 720px;">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-5">
        <h2 class="text-center text-primary mb-4 fw-bold">
          <i class="bi bi-plus-circle-fill me-2"></i>Crear nuevo torneo
        </h2>

        <Form :validation-schema="mySchema" @submit="onSubmit">
          <!-- Nombre -->
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre del torneo</label>
            <Field name="nombre" type="text" class="form-control" id="nombre" placeholder="Ej: Liga de Verano 2025" />
            <ErrorMessage name="nombre" class="text-danger small" />
          </div>

          <!-- Tipo -->
          <div class="mb-3">
            <label for="tipo" class="form-label">Tipo de torneo</label>
            <Field name="tipo" as="select" class="form-select" id="tipo">
              <option value="" disabled selected>Seleccione una opción</option>
              <option value="futbol11">Fútbol 11</option>
              <option value="futbol7">Fútbol 7</option>
              <option value="sala">Fútbol Sala</option>
            </Field>
            <ErrorMessage name="tipo" class="text-danger small" />
          </div>

          <!-- Fechas -->
          <div class="row g-3">
            <div class="col-md-6">
              <label for="fecha_inicio" class="form-label">Fecha de inicio</label>
              <Field name="fecha_inicio" type="date" class="form-control" id="fecha_inicio" />
              <ErrorMessage name="fecha_inicio" class="text-danger small" />
            </div>
            <div class="col-md-6">
              <label for="fecha_fin" class="form-label">Fecha de fin</label>
              <Field name="fecha_fin" type="date" class="form-control" id="fecha_fin" />
              <ErrorMessage name="fecha_fin" class="text-danger small" />
            </div>
          </div>

          <!-- Formato -->
          <div class="mt-3 mb-3">
            <label for="formato" class="form-label">Formato del torneo</label>
            <Field name="formato" as="select" class="form-select" id="formato">
              <option value="" disabled selected>Seleccione una opción</option>
              <option value="liguilla">Liguilla</option>
              <option value="eliminacion">Eliminación directa</option>
              <option value="grupos_playoffs">Grupos + Playoffs</option>
            </Field>
            <ErrorMessage name="formato" class="text-danger small" />
          </div>

          <!-- Visibilidad -->
          <div class="mb-3">
            <label for="visibilidad" class="form-label">Visibilidad</label>
            <Field name="visibilidad" as="select" class="form-select" id="visibilidad">
              <option value="" disabled selected>Seleccione una opción</option>
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </Field>
            <ErrorMessage name="visibilidad" class="text-danger small" />
          </div>

          <!-- Reglamento -->
          <div class="mb-4">
            <label for="reglamento" class="form-label">Reglamento (opcional)</label>
            <Field name="reglamento" as="textarea" rows="4" class="form-control" id="reglamento"
              placeholder="Describe las reglas principales del torneo aquí..." />
          </div>

          <!-- Botón -->
          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg">
              <i class="bi bi-check2-circle me-2"></i>Guardar torneo
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  resize: vertical;
}
</style>
