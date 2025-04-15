<!-- src/components/BracketView.vue -->
<template>
    <div class="bracket-container">
      <h3 class="text-center text-primary mb-4">🏆 Cuadro Eliminatorio</h3>
      <Bracket :rounds="rounds">
        <template #player="{ player }">
          {{ player.name }}
        </template>
        <template #player-extension-bottom="{ match }">
          {{ match.title || '' }}
        </template>
      </Bracket>
    </div>
  </template>
  
  <script>
  import Bracket from "vue-tournament-bracket";
  
  export default {
    name: "BracketView",
    components: { Bracket },
    props: {
      rounds: Array // Estructura generada en el backend o frontend
    }
  };
  </script>
  
  <style scoped>
  .bracket-container {
    overflow-x: auto;
  }
  </style>
  