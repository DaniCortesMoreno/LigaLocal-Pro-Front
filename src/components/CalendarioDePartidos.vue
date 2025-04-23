<script>
import { defineComponent } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import * as bootstrap from "bootstrap";

export default defineComponent({
  name: "CalendarioDePartidos",
  components: {
    VueCal,
  },
  props: {
    partidos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      events: [],
      selectedEvent: null,
      modalInstance: null,
    };
  },
  watch: {
    partidos: {
      handler() {
        this.cargarEventos();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    cargarEventos() {
      this.events = [];

      this.partidos.forEach(partido => {
        console.log(partido);
        const resultado =
          partido.estado_partido === "finalizado"
            ? ` (${partido.goles_equipo1} - ${partido.goles_equipo2})`
            : "";

        this.events.push({
          start: new Date(partido.fecha_partido),
          end: new Date(new Date(partido.fecha_partido).getTime() + 90 * 60 * 1000),
          title: `${partido.equipo1?.nombre} vs ${partido.equipo2?.nombre}${resultado}`,
          content: `Estado: ${partido.estado_partido}`,
          class: partido.estado_partido, // pendiente | finalizado
          id: partido.id,
        });
      });
    },
    getEventClass(event) {
      return event.class; // "pendiente" o "finalizado"
    },

    handleEventClick(event) {
      this.selectedEvent = event;
      if (!this.modalInstance) {
        const modalElement = document.getElementById("matchModal");
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    },
  },
});
</script>

<template>
  <div class="container">
    <h2 class="text-center text-primary my-4">
      <i class="bi bi-calendar-event me-2"></i> Calendario de Partidos
    </h2>

    <!-- Leyenda de colores -->
    <div class="leyenda mb-3">
      <span class="leyenda-item">
        <span class="color-box pendiente"></span> Partido Pendiente
      </span>
      <span class="leyenda-item">
        <span class="color-box finalizado"></span> Partido Finalizado
      </span>
    </div>

    <!-- Calendario -->
    <vue-cal :events="events" locale="es" :on-event-click="handleEventClick" :event-class="getEventClass" />

    <!-- Modal -->
    <div class="modal fade" id="matchModal" tabindex="-1" aria-labelledby="matchModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-white text-center">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="matchModalLabel">
              {{ selectedEvent?.title || "Partido" }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ selectedEvent?.content || "Sin detalles." }}
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vuecal {
  height: 75vh;
  background-color: #fff;
}

.leyenda {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.leyenda-item {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
}

.color-box {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border-radius: 3px;
}

.pendiente {
  background-color: #f39c12;
  border: 1px solid #e67e22;
}

.finalizado {
  background-color: #28a745;
  border: 1px solid #218838;
}

.vuecal__event.pendiente {
  background-color: #f39c12;
  border: 1px solid #e67e22;
  color: #fff;
}

.vuecal__event.finalizado {
  background-color: #28a745;
  border: 1px solid #218838;
  color: #fff;
}
</style>
