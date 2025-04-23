<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { mapActions } from "pinia";
import { useUserStore } from "@/stores";

export default {
  name: "PlayerForm",
  props: {
    teamId: Number,
    jugador: Object // Nuevo prop para edición
  },
  components: {
    Form, Field, ErrorMessage
  },
  data() {
    return {
      previewLogo: null,
      fotoSubmit: null,
      initialValues: {
        nombre: "",
        apellidos: "",
        edad: "",
        posición: "",
        dorsal: "",
        estado: "activo",
        team_id: this.teamId,
        foto: null
      }
    };
  },
  computed: {
    esEdicion() {
      return !!this.jugador;
    },
    schema() {
      return yup.object({
        nombre: yup.string().required(),
        apellidos: yup.string().required(),
        edad: yup.number().required(),
        posición: yup.string().required(),
        dorsal: yup.number().required().min(0),
        estado: this.esEdicion ? yup.string().required() : yup.string().nullable(),
        team_id: yup.number().required()
      });
    }
  },
  methods: {
    ...mapActions(useUserStore, ["createJugador", "updateJugador"]),
    async onSubmit(values) {
      values.foto = this.fotoSubmit;
      if (this.jugador) {
        const ok = await this.updateJugador(this.jugador.id, values);
        if (ok) this.$emit("jugadorCreado");
      } else {
        const ok = await this.createJugador(values);
        if (ok) this.$emit("jugadorCreado");
      }
    },

    handleLogoChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewLogo = e.target.result;
          this.fotoSubmit = e.target.result; // Aquí se guarda el base64
        };
        reader.readAsDataURL(file);
      }
    }
  },
  mounted() {
    this.previewLogo = this.jugador.foto || null
    if (this.esEdicion) {
      this.initialValues = {
        nombre: this.jugador.nombre,
        apellidos: this.jugador.apellidos,
        edad: this.jugador.edad,
        posición: this.jugador.posición,
        dorsal: this.jugador.dorsal,
        estado: this.jugador.estado,
        team_id: this.jugador.team_id,
        foto: this.jugador.foto,
      };
    }
  }
};
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="schema" :initial-values="initialValues"
    :key="JSON.stringify(initialValues)">
    <!-- campos básicos -->
    <div class="mb-3">
      <label class="form-label">Nombre</label>
      <Field name="nombre" type="text" class="form-control" />
      <ErrorMessage name="nombre" class="text-danger small" />
    </div>

    <div class="mb-3">
      <label class="form-label">Apellidos</label>
      <Field name="apellidos" type="text" class="form-control" />
      <ErrorMessage name="apellidos" class="text-danger small" />
    </div>

    <div class="mb-3">
      <label class="form-label">Edad</label>
      <Field name="edad" type="number" class="form-control" />
      <ErrorMessage name="edad" class="text-danger small" />
    </div>

    <div class="mb-3">
      <label class="form-label">Posición</label>
      <Field name="posición" as="select" class="form-select">
        <option disabled value="">Selecciona posición</option>
        <option value="portero">Portero</option>
        <option value="defensa">Defensa</option>
        <option value="centrocampista">Centrocampista</option>
        <option value="delantero">Delantero</option>
      </Field>
      <ErrorMessage name="posición" class="text-danger small" />
    </div>

    <div class="mb-3">
      <label class="form-label">Dorsal</label>
      <Field name="dorsal" type="number" class="form-control" />
      <ErrorMessage name="dorsal" class="text-danger small" />
    </div>

    <!-- Foto -->
    <div class="mb-3">
      <label for="foto" class="form-label">Foto del jugador</label>
      <input type="file" class="form-control" id="foto" accept="image/*" @change="handleLogoChange">
    </div>

    <!-- Vista previa de la foto -->
    <div class="mb-3" v-if="previewLogo">
      <label class="form-label">Vista previa de la foto:</label>
      <img :src="previewLogo" alt="Foto preview" class="img-thumbnail" style="max-height: 150px;" />
    </div>

    <!-- solo si es edición -->
    <div class="mb-3" v-if="esEdicion">
      <label class="form-label">Estado</label>
      <Field name="estado" as="select" class="form-select">
        <option disabled value="">Selecciona estado</option>
        <option value="activo">Activo</option>
        <option value="lesionado">Lesionado</option>
        <option value="suspendido">Suspendido</option>
      </Field>
      <ErrorMessage name="estado" class="text-danger small" />
    </div>

    <div class="text-end">
      <button type="button" class="btn btn-outline-secondary me-2" @click="$emit('cancelar')">Cancelar</button>
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </Form>
</template>
