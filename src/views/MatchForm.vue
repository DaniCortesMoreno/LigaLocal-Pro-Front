<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { mapActions } from "pinia";
import { useUserStore } from "@/stores";

export default {
  name: "MatchForm",
  props: {
    id: String, // torneo_id (crear) o partido_id (editar)
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data() {
    return {
      esEdicion: this.$route.name === 'EditarPartido',
      equipos: [],
      partidoOriginal: null, // para saber torneo_id en edición
      initialValues: {
        equipo1_id: '',
        equipo2_id: '',
        fecha_partido: '',
        hora: '',
        estado_partido: 'pendiente',
        arbitro: '',
        goles_equipo1: '',
        goles_equipo2: '',
      }
    }
  },
  computed: {
    schema() {
      return yup.object({
        equipo1_id: yup.string().required(),
        equipo2_id: yup.string().required().notOneOf([yup.ref('equipo1_id')], 'Los equipos deben ser distintos.'),
        fecha_partido: yup.string().required(),
        hora: yup.string().required(),
        arbitro: yup.string().required("Introduce el nombre del árbitro"),
        estado_partido: this.esEdicion ? yup.string().required() : yup.string(),
        goles_equipo1: this.esEdicion ? yup.number().min(0).nullable() : yup.mixed(),
        goles_equipo2: this.esEdicion ? yup.number().min(0).nullable() : yup.mixed(),
      });
    }
  },
  methods: {
    ...mapActions(useUserStore, ['getTeamsXTorneo', 'createPartido', 'getPartido', 'updatePartido']),
    async cargarDatos() {
      if (this.esEdicion) {
        const partido = await this.getPartido(this.id);
        this.partidoOriginal = partido;

        // Cargar equipos del torneo al que pertenece el partido
        this.equipos = await this.getTeamsXTorneo(partido.torneo_id);

        // Inicializar valores del formulario
        this.initialValues = {
          equipo1_id: partido.equipo1_id,
          equipo2_id: partido.equipo2_id,
          fecha_partido: partido.fecha_partido?.split(' ')[0] || '',
          hora: partido.fecha_partido?.split(' ')[1]?.slice(0, 5) || '',
          estado_partido: partido.estado_partido || 'pendiente',
          arbitro: partido.arbitro || '',
          goles_equipo1: partido.goles_equipo1 ?? '',
          goles_equipo2: partido.goles_equipo2 ?? '',
        };
      } else {
        this.equipos = await this.getTeamsXTorneo(this.id); // this.id = torneo_id en creación
      }
    },
    async onSubmit(values) {
      const fechaCompleta = `${values.fecha_partido} ${values.hora}:00`;

      const payload = {
        ...values,
        fecha_partido: fechaCompleta,
      };

      if (!this.esEdicion) payload.estado_partido = 'pendiente';

      if (this.esEdicion) {
        const ok = await this.updatePartido(this.id, payload);
        if (ok) this.$router.push(`/torneos/${this.partidoOriginal.torneo_id}`);
      } else {
        const ok = await this.createPartido({ ...payload, torneo_id: this.id });
        if (ok) this.$router.push(`/torneos/${this.id}`);
      }
    }
  },
  async mounted() {
    await this.cargarDatos();
  }
}
</script>


<template>
  <div class="container py-5">
    <h3 class="text-center mb-4">{{ esEdicion ? 'Editar Partido' : 'Crear Partido' }}</h3>

    <Form :key="JSON.stringify(initialValues)" :initial-values="initialValues" @submit="onSubmit" :validation-schema="schema">
      <!-- EQUIPOS -->
      <div class="mb-3">
        <label for="equipo1" class="form-label">Equipo 1</label>
        <Field name="equipo1_id" as="select" class="form-select">
          <option disabled value="">Selecciona un equipo</option>
          <option v-for="equipo in equipos" :key="equipo.id" :value="equipo.id">
            {{ equipo.nombre }}
          </option>
        </Field>
        <ErrorMessage name="equipo1_id" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label for="equipo2" class="form-label">Equipo 2</label>
        <Field name="equipo2_id" as="select" class="form-select">
          <option disabled value="">Selecciona un equipo</option>
          <option v-for="equipo in equipos" :key="equipo.id" :value="equipo.id">
            {{ equipo.nombre }}
          </option>
        </Field>
        <ErrorMessage name="equipo2_id" class="text-danger small" />
      </div>

      <!-- FECHA Y HORA -->
      <div class="mb-3">
        <label for="fecha_partido" class="form-label">Fecha</label>
        <Field name="fecha_partido" type="date" class="form-control" />
        <ErrorMessage name="fecha_partido" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label for="hora" class="form-label">Hora</label>
        <Field name="hora" type="time" class="form-control" />
        <ErrorMessage name="hora" class="text-danger small" />
      </div>

      <!-- ÁRBITRO -->
      <div class="mb-3">
        <label for="arbitro" class="form-label">Árbitro</label>
        <Field name="arbitro" type="text" class="form-control" />
        <ErrorMessage name="arbitro" class="text-danger small" />
      </div>

      <!-- ESTADO (SOLO EDICIÓN) -->
      <div class="mb-3" v-if="esEdicion">
        <label for="estado_partido" class="form-label">Estado del Partido</label>
        <Field name="estado_partido" as="select" class="form-select">
          <option value="pendiente">Pendiente</option>
          <option value="en_curso">En curso</option>
          <option value="finalizado">Finalizado</option>
        </Field>
        <ErrorMessage name="estado_partido" class="text-danger small" />
      </div>

      <!-- GOLES (SOLO EDICIÓN) -->
      <div class="row" v-if="esEdicion">
        <div class="col-md-6 mb-3">
          <label for="goles_equipo1" class="form-label">Goles Equipo 1</label>
          <Field name="goles_equipo1" type="number" min="0" class="form-control" />
          <ErrorMessage name="goles_equipo1" class="text-danger small" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="goles_equipo2" class="form-label">Goles Equipo 2</label>
          <Field name="goles_equipo2" type="number" min="0" class="form-control" />
          <ErrorMessage name="goles_equipo2" class="text-danger small" />
        </div>
      </div>

      <div class="mt-4">
        <button type="submit" class="btn btn-primary w-100">
          {{ esEdicion ? 'Guardar Cambios' : 'Crear Partido' }}
        </button>
      </div>
    </Form>
  </div>
</template>
