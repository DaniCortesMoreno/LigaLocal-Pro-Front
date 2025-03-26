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
    <tr>
        <td>{{ torneo.nombre }}</td>
        <td>{{ torneo.tipo }}</td>
        <td>{{ torneo.fecha_inicio }}</td>
        <td>{{ torneo.fecha_fin }}</td>
        <td>{{ torneo.estado }}</td>
        <td>{{ torneo.formato }}</td>
        <td>{{ torneo.visibilidad }}</td>
    </tr>

</template>