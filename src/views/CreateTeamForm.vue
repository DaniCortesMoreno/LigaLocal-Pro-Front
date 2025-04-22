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
    torneo_id: String,
    equipo_id: String // solo si estamos editando

  },

  data() {
    return {
      equipo: {},
      previewLogo: null,
    }
  },

  async mounted() {
    if (this.equipo_id) {
      this.equipo = await this.getEquipo(this.equipo_id);
      console.log("Equipo cargado:", this.equipo);
      this.previewLogo = this.equipo.logo || null;
    } else {
      this.equipo = {};
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
    ...mapActions(useUserStore, ["addEquipo", "getEquipo", "updateEquipo"]),

    async onSubmit(values) {
      values.logo = this.equipo.logo; // 💥 Aquí está la clave
      console.log("Enviando equipo con logo:", values.logo);

      if (this.equipo_id) {
        const successEdit = await this.updateEquipo(this.equipo_id, values);
        if (successEdit) {
          router.push(`/torneos/${this.equipo.tournament_id}`);
        } else {
          alert("No se pudo actualizar el equipo.");
        }
      } else {
        const success = await this.addEquipo(this.torneo_id, values);
        if (success) {
          router.push(`/torneos/${this.torneo_id}`);
        } else {
          alert("No se pudo crear el equipo.");
        }
      }
    },

    handleLogoChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewLogo = e.target.result;
          this.equipo.logo = e.target.result; // Aquí se guarda el base64
        };
        reader.readAsDataURL(file);
      }
    }



  }

}
</script>


<template>
  <div class="container py-5" style="max-width: 600px">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-4">
        <h2 class="mb-4 fw-bold text-primary text-center">
          <i class="bi bi-people-fill me-2"></i>
          {{ equipo_id ? 'Editar equipo' : 'Crear nuevo equipo' }}
        </h2>

        <Form :validation-schema="mySchema" @submit="onSubmit">
          <!-- Nombre del equipo -->
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre del equipo</label>
            <Field v-model="equipo.nombre" name="nombre" type="text" class="form-control" id="nombre"
              placeholder="Ej: Atlético Alcoyano" />
            <ErrorMessage name="nombre" class="text-danger small" />
          </div>

          <!-- Color equipación -->
          <div class="mb-3">
            <label for="color_equipacion" class="form-label">Color de la equipación</label>
            <Field v-model="equipo.color_equipacion" name="color_equipacion" as="select" class="form-select"
              id="color_equipacion">
              <option value="" disabled selected>Seleccione un color</option>
              <option value="Rojo">🔴 Rojo</option>
              <option value="Azul">🔵 Azul</option>
              <option value="Verde">🟢 Verde</option>
              <option value="Amarillo">🟡 Amarillo</option>
              <option value="Negro">⚫ Negro</option>
              <option value="Blanco">⚪ Blanco</option>
              <option value="Naranja">🟠 Naranja</option>
            </Field>
            <ErrorMessage name="color_equipacion" class="text-danger small" />
          </div>

          <!-- Entrenador -->
          <div class="mb-4">
            <label for="entrenador" class="form-label">Entrenador</label>
            <Field v-model="equipo.entrenador" name="entrenador" type="text" class="form-control" id="entrenador"
              placeholder="Ej: Juan Martínez" />
            <ErrorMessage name="entrenador" class="text-danger small" />
          </div>

          <!-- Logo -->
          <div class="mb-3">
            <label for="logo" class="form-label">Logo del equipo</label>
            <input type="file" class="form-control" id="logo" accept="image/*" @change="handleLogoChange">
          </div>

          <!-- Vista previa del logo -->
          <div class="mb-3" v-if="previewLogo">
            <label class="form-label">Vista previa del logo:</label>
            <img :src="previewLogo" alt="Logo preview" class="img-thumbnail" style="max-height: 150px;" />
          </div>

          <!-- Botón -->
          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg">
              <i class="bi bi-check2-circle me-2"></i>
              {{ equipo_id ? 'Guardar cambios' : 'Guardar equipo' }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
