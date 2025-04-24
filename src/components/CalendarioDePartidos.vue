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
          equipo1: {
            nombre: partido.equipo1?.nombre,
            logo: partido.equipo1?.logo || '/img/logo-default.png',
          },
          equipo2: {
            nombre: partido.equipo2?.nombre,
            logo: partido.equipo2?.logo || '/img/logo-default.png',
          },
          class: partido.estado_partido,
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
    <vue-cal :events="events" locale="es" :on-event-click="handleEventClick" :event-class="getEventClass">
      <template #event="{ event }">
        <div class="evento-calendario d-flex align-items-center justify-content-between">
          <div class="equipo d-flex align-items-center">
            <img :src="event.equipo1.logo" alt="Logo 1" class="logo-equipo me-2 escudo-equipo" />
            <span>{{ event.equipo1.nombre }}</span>
          </div>
          <span class="mx-1 fw-bold">vs</span>
          <div class="equipo d-flex align-items-center">
            <img :src="event.equipo2.logo" alt="Logo 2" class="logo-equipo me-2 escudo-equipo" />
            <span>{{ event.equipo2.nombre }}</span>
          </div>
        </div>
      </template>

    </vue-cal>

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

.logo-equipo {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
}

.evento-calendario {
  font-size: 13px;
  padding: 2px 4px;
  line-height: 1.2;
  color: white;
  gap: 4px;
}

.vuecal__event.pendiente .evento-calendario,
.vuecal__event.finalizado .evento-calendario {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
