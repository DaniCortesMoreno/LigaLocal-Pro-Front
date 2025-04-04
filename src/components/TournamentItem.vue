<script>
import { useUserStore } from '@/stores';
import { mapActions } from 'pinia'

export default {
    name: "TournamentItem",
    props: {
        torneo: Object
    },

}
</script>


<template>
    <tr class="torneo-item" style="cursor: pointer;">
      <!-- Nombre con icono -->
      <td class="fw-semibold text-primary">
        <i class="bi bi-shield-check me-2"></i>{{ torneo.nombre }}
      </td>
  
      <!-- Tipo -->
      <td>{{ torneo.tipo }}</td>
  
      <!-- Fechas -->
      <td>{{ torneo.fecha_inicio }}</td>
      <td>{{ torneo.fecha_fin }}</td>
  
      <!-- Estado con badge -->
      <td>
        <span class="badge text-capitalize" :class="{
          'bg-success': torneo.estado === 'en curso',
          'bg-warning text-dark': torneo.estado === 'pendiente',
          'bg-danger': torneo.estado === 'finalizado'
        }">
          {{ torneo.estado }}
        </span>
      </td>
  
      <!-- Formato -->
      <td>{{ torneo.formato }}</td>
  
      <!-- Visibilidad con badge -->
      <td>
        <span class="badge text-dark" :class="{
          'bg': torneo.visibilidad === 'público',
          'bg': torneo.visibilidad === 'privado'
        }">
          {{ torneo.visibilidad }}
        </span>
      </td>
    </tr>
  </template>
  
  <style scoped>
  .torneo-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  </style>