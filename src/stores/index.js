import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

const SERVER = "http://localhost:8000/api"
const token = localStorage.getItem("token")
const apiClient = axios.create({
  baseURL: SERVER,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  },
  withCredentials: true,

});

export const useUserStore = defineStore("data", {
  state() {
    return {
      loggedIn: localStorage.getItem("loggedIn") === "true",
      token: localStorage.getItem("token"),
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
      messages: []
    }
  },

  actions: {
    async register(nombre, apellidos, password, email, confirm_password) {
      try {
        const response = await apiClient.post(`${SERVER}/register`, {
          nombre,
          apellidos,
          password,
          email,
          confirm_password,
        });
        console.log(response.data)
        console.log(response.data.data.token)
        const token = response.data.data.token;
        // Guarda el token en localStorage
        localStorage.setItem("token", token);
        this.token = token;
        this.loggedIn = true;
        localStorage.setItem("loggedIn", "true");
        this.user = response.data.data.user;

        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Forzar la actualización de `apiClient` con el nuevo token
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        this.addMessage("Te has registrad correctamente", 'success')
        return true;

      } catch (error) {
        this.addMessage("Error al registrar el usuario", 'error')
        return false;
      }
    },

    async login(email, password) {
      try {
        const response = await apiClient.post(`${SERVER}/login`, {
          email: email,
          password: password,
        })
        const token = response.data.data.token;
        // Guarda el token en localStorage
        localStorage.setItem("token", token);
        this.token = token;
        this.loggedIn = true;
        localStorage.setItem("loggedIn", "true");
        this.user = response.data.data.user;

        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Forzar la actualización de `apiClient` con el nuevo token
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        this.addMessage("Has iniciado sesión correctamente", 'success')
        return true;
      } catch (error) {
        this.addMessage("Error al iniciar sesión", 'error')
        return false
      }

    },

    logout() {
      this.token = null;
      this.loggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("user");
      apiClient.defaults.headers.Authorization = null;
    },

    async getTorneos() {
      try {
        const response = await apiClient.get(`${SERVER}/tournaments/public`);
        return response.data.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    async getTorneosDelUserActual() {
      const id = parseInt(JSON.parse(localStorage.getItem("user")).id, 10)
      console.log(id)
      try {
        const response = await apiClient.get(`${SERVER}/tournaments/user/${id}`);
        return response.data.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    async addTorneo(torneo) {
      try {
        const response = await apiClient.post(`${SERVER}/tournaments`, torneo);
        this.addMessage("Torneo creado correctamente", 'success')
        return true;
      } catch (error) {
        this.addMessage("Error al crear el torneo", 'error')
        return false;
      }
    },

    async getTorneo(id) {
      try {
        const response = await apiClient.get(`${SERVER}/tournaments/${id}`);
        return response.data.data;
      } catch (error) {
        this.addMessage(error.response.data.message, 'error')
        return null;
      }
    },

    async getUser(id) {
      try {
        const response = await apiClient.get(`${SERVER}/users/${id}`);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    async actualizarPerfil(nuevosDatos) {
      try {
        const response = await apiClient.put(`${SERVER}/users/${this.user.id}`, nuevosDatos);
        this.user = response.data.data;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.addMessage("Perfil actualizado correctamente", 'success')
        return true;
      } catch (error) {
        this.addMessage("Error al actualizar el perfil", 'error')
        return false;
      }
    },

    addMessage(text, type = 'success') {
      const id = Date.now()
      this.messages.push({ id, text, type })

      // Autoeliminar después de 3s
      setTimeout(() => {
        this.removeMessage(id)
      }, 3000)
    },

    removeMessage(id) {
      this.messages = this.messages.filter(msg => msg.id !== id)
    },

    async getTeamsXTorneo(id) {
      try {
        const response = await apiClient.get(`${SERVER}/tournaments/${id}/teams`);
        return response.data.data
      } catch (error) {
        this.addMessage(error.response.data.message, 'error')
        return [];
      }

    },

    async addEquipo(id, equipo) {
      try {
        const response = await apiClient.post(`${SERVER}/tournaments/${id}/teams`, equipo);
        this.addMessage("Equipo creado correctamente", 'success')
        return true;
      } catch (error) {
        this.addMessage("Error al crear el equipo", 'error')
        return false;
      }
    },

    async getEquipo(id) {
      try {
        const response = await apiClient.get(`${SERVER}/teams/${id}`);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
      
    },

    async getJugadoresPorEquipo(id) {
      try {
        const response = await apiClient.get(`${SERVER}/teams/${id}/players`);
        return response.data.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    async deleteEquipo(id) {
      try {
        const response = await apiClient.delete(`${SERVER}/teams/${id}`);
        this.addMessage("Equipo eliminado correctamente", 'success')
        return true;
      } catch (error) {
        this.addMessage("Error al eliminar el equipo", 'error')
        return false;
      }
    },
    
    async enviarInvitacion(id, email, role) {
      try {
        const response = await apiClient.post(`${SERVER}/tournaments/${id}/invite`, { email, role });
        this.addMessage(response.data.message || "Invitación enviada correctamente", 'success');
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || "Error al enviar la invitación";
        this.addMessage(message, 'error');
        return { success: false, message };
      }
    }
    
  }
})
