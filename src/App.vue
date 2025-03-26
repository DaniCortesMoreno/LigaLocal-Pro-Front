<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import AppMessages from './components/AppMessages.vue';
</script>

<template>
  <header>
  </header>
  <div>
    <Navbar />
    <RouterView />
    <AppMessages />
  </div>

</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css');

</style>
