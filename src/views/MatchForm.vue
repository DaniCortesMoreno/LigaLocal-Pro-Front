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
        mvp_id: '' // NUEVO
      },
      jugadores: [],
      estadisticas: []
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
    ...mapActions(useUserStore, ['getTeamsXTorneo', 'createPartido', 'getPartido', 'updatePartido',
      'getJugadoresPorEquipo', 'registrarEstadisticas', 'getEstadisticasPartido']),
    async cargarDatos() {
      if (this.esEdicion) {
        const partido = await this.getPartido(this.id);
        this.partidoOriginal = partido;
        this.initialValues.mvp_id = partido.mvp_id ?? '';
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
          mvp_id: partido.mvp_id ?? '',

        };
        const jugadoresEquipo1 = await this.getJugadoresPorEquipo(partido.equipo1_id);
        const jugadoresEquipo2 = await this.getJugadoresPorEquipo(partido.equipo2_id);
        this.jugadores = [...jugadoresEquipo1, ...jugadoresEquipo2];

        const statsGuardadas = await this.getEstadisticasPartido(this.id);

        this.estadisticas = this.jugadores.map(jugador => {
          const previa = statsGuardadas.find(e => e.id === jugador.id);
          return {
            player_id: jugador.id,
            partidos_jugados: previa?.pivot?.partidos_jugados ?? 0,
            goles: previa?.pivot?.goles ?? 0,
            asistencias: previa?.pivot?.asistencias ?? 0,
            amarillas: previa?.pivot?.amarillas ?? 0,
            rojas: previa?.pivot?.rojas ?? 0
          };
        });
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
        if (ok) {
          const statsValidas = this.estadisticas
            .filter(e => e.player_id !== undefined && e.player_id !== null)
            .map(e => ({
              ...e,
              partidos_jugados: e.partidos_jugados ? 1 : 0, //conversión aquí
            }));

          console.log('Enviando estadísticas:', JSON.stringify(statsValidas));
          await this.registrarEstadisticas(this.id, statsValidas);
          this.$router.push(`/torneos/${this.partidoOriginal.torneo_id}`);
        }
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
    <div class="card shadow-sm border-0 rounded-4 p-4">
      <h3 class="text-center mb-4 text-primary">
        <i class="bi bi-calendar2-plus me-2"></i>{{ esEdicion ? 'Editar Partido' : 'Crear Partido' }}
      </h3>

      <Form :key="JSON.stringify(initialValues)" :initial-values="initialValues" @submit="onSubmit"
        :validation-schema="schema">

        <!-- Equipos -->
        <div class="row g-3">
          <div class="col-md-6">
            <label for="equipo1_id" class="form-label">Equipo 1</label>
            <Field name="equipo1_id" as="select" class="form-select">
              <option disabled value="">Selecciona un equipo</option>
              <option v-for="equipo in equipos" :key="equipo.id" :value="equipo.id">
                {{ equipo.nombre }}
              </option>
            </Field>
            <ErrorMessage name="equipo1_id" class="text-danger small" />
          </div>

          <div class="col-md-6">
            <label for="equipo2_id" class="form-label">Equipo 2</label>
            <Field name="equipo2_id" as="select" class="form-select">
              <option disabled value="">Selecciona un equipo</option>
              <option v-for="equipo in equipos" :key="equipo.id" :value="equipo.id">
                {{ equipo.nombre }}
              </option>
            </Field>
            <ErrorMessage name="equipo2_id" class="text-danger small" />
          </div>
        </div>

        <!-- Fecha y hora -->
        <div class="row mt-3 g-3">
          <div class="col-md-6">
            <label for="fecha_partido" class="form-label">Fecha</label>
            <Field name="fecha_partido" type="date" class="form-control" />
            <ErrorMessage name="fecha_partido" class="text-danger small" />
          </div>

          <div class="col-md-6">
            <label for="hora" class="form-label">Hora</label>
            <Field name="hora" type="time" class="form-control" />
            <ErrorMessage name="hora" class="text-danger small" />
          </div>
        </div>

        <!-- Árbitro -->
        <div class="mt-3">
          <label for="arbitro" class="form-label">Árbitro</label>
          <Field name="arbitro" type="text" class="form-control" />
          <ErrorMessage name="arbitro" class="text-danger small" />
        </div>

        <!-- Estado y goles -->
        <div class="row mt-3 g-3" v-if="esEdicion">
          <div class="col-md-4">
            <label for="estado_partido" class="form-label">Estado del partido</label>
            <Field name="estado_partido" as="select" class="form-select">
              <option value="pendiente">Pendiente</option>
              <option value="en_curso">En curso</option>
              <option value="finalizado">Finalizado</option>
            </Field>
            <ErrorMessage name="estado_partido" class="text-danger small" />
          </div>

          <div class="col-md-4">
            <label for="goles_equipo1" class="form-label">Goles Equipo 1</label>
            <Field name="goles_equipo1" type="number" min="0" class="form-control" />
            <ErrorMessage name="goles_equipo1" class="text-danger small" />
          </div>

          <div class="col-md-4">
            <label for="goles_equipo2" class="form-label">Goles Equipo 2</label>
            <Field name="goles_equipo2" type="number" min="0" class="form-control" />
            <ErrorMessage name="goles_equipo2" class="text-danger small" />
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="mt-5" v-if="esEdicion">
          <h5 class="text-primary mb-3"><i class="bi bi-graph-up-arrow me-2"></i>Estadísticas por jugador</h5>

          <div class="row g-4">
            <!-- Equipo 1 -->
            <div class="col-12 col-lg-6">
              <h6 class="text-primary">{{equipos.find(e => e.id == initialValues.equipo1_id)?.nombre || 'Equipo 1'}}
              </h6>

              <div
                v-for="estat in estadisticas.filter(e => jugadores.find(j => j.id === e.player_id)?.team_id == initialValues.equipo1_id)"
                :key="estat.player_id" class="border p-3 rounded mb-3 bg-light-subtle">
                <strong>{{jugadores.find(j => j.id === estat.player_id)?.nombre}} {{jugadores.find(j => j.id ===
                  estat.player_id)?.apellidos}}</strong>
                <div class="row mt-2 g-2">
                  <div class="col">
                    <label class="form-check-label d-block">Jugó</label>
                    <input type="checkbox" v-model="estat.partidos_jugados" class="form-check-input" />
                  </div>
                  <div class="col"><label>Goles</label><input type="number" v-model.number="estat.goles" min="0"
                      class="form-control" /></div>
                  <div class="col"><label>Asistencias</label><input type="number" v-model.number="estat.asistencias"
                      min="0" class="form-control" /></div>
                  <div class="col"><label>Amarillas</label><input type="number" v-model.number="estat.amarillas" min="0"
                      class="form-control" /></div>
                  <div class="col"><label>Rojas</label><input type="number" v-model.number="estat.rojas" min="0"
                      class="form-control" /></div>
                </div>
              </div>
            </div>

            <!-- Equipo 2 -->
            <div class="col-12 col-lg-6">
              <h6 class="text-success">{{equipos.find(e => e.id == initialValues.equipo2_id)?.nombre || 'Equipo 2'}}
              </h6>

              <div
                v-for="estat in estadisticas.filter(e => jugadores.find(j => j.id === e.player_id)?.team_id == initialValues.equipo2_id)"
                :key="estat.player_id" class="border p-3 rounded mb-3 bg-light-subtle">
                <strong>{{jugadores.find(j => j.id === estat.player_id)?.nombre}}</strong>
                <div class="row mt-2 g-2">
                  <div class="col">
                    <label class="form-check-label d-block">Jugó</label>
                    <input type="checkbox" v-model="estat.partidos_jugados" class="form-check-input" />
                  </div>
                  <div class="col"><label>Goles</label><input type="number" v-model.number="estat.goles" min="0"
                      class="form-control" /></div>
                  <div class="col"><label>Asistencias</label><input type="number" v-model.number="estat.asistencias"
                      min="0" class="form-control" /></div>
                  <div class="col"><label>Amarillas</label><input type="number" v-model.number="estat.amarillas" min="0"
                      class="form-control" /></div>
                  <div class="col"><label>Rojas</label><input type="number" v-model.number="estat.rojas" min="0"
                      class="form-control" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-3" v-if="esEdicion && initialValues.estado_partido === 'finalizado'">
          <label for="mvp_id" class="form-label">MVP del Partido</label>
          <Field name="mvp_id" as="select" class="form-select">
            <option disabled value="">Selecciona un jugador</option>
            <option v-for="jugador in jugadores" :key="jugador.id" :value="jugador.id">
              {{ jugador.nombre }} {{ jugador.apellidos }}
            </option>
          </Field>
          <ErrorMessage name="mvp_id" class="text-danger small" />
        </div>


        <!-- Botón -->
        <div class="mt-4">
          <button type="submit" class="btn btn-primary w-100">
            {{ esEdicion ? 'Guardar Cambios' : 'Crear Partido' }}
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>
