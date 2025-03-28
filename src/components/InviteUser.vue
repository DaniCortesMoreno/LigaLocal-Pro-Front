<template>
    <form @submit.prevent="handleSubmit" class="card card-body mt-4">
      <h5>Invitar usuario al torneo</h5>
  
      <div class="mb-3">
        <label>Email del usuario:</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
  
      <div class="mb-3">
        <label>Rol del usuario:</label>
        <select v-model="role" class="form-select" required>
          <option value="viewer">Espectador</option>
          <option value="editor">Editor</option>
        </select>
      </div>
  
      <button class="btn btn-primary" :disabled="loading">Invitar</button>
      <p class="text-success mt-2" v-if="successMessage">{{ successMessage }}</p>
      <p class="text-danger mt-2" v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </template>
  
  <script>
  import { useUserStore } from '@/stores';
  import { mapActions } from 'pinia';
  
  export default {
    props: {
      torneoId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        email: '',
        role: 'viewer',
        loading: false,
        successMessage: '',
        errorMessage: '',
      };
    },
    methods: {
      ...mapActions(useUserStore, ['enviarInvitacion']),
  
      async handleSubmit() {
        this.loading = true;
        this.successMessage = '';
        this.errorMessage = '';
  
        const { success, message } = await this.enviarInvitacion(this.torneoId, this.email, this.role);
  
        if (success) {
          this.successMessage = 'Invitación enviada correctamente.';
          this.email = '';
          this.role = 'viewer';
        } else {
          this.errorMessage = message || 'Error al invitar.';
        }
  
        this.loading = false;
      },
    },
  };
  </script>
  