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
        return true;

      } catch (error) {
        console.error(error);
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
        return true;
      } catch (error) {
        console.error(error);
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
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async getTorneo(id) {
      try {
        const response = await apiClient.get(`${SERVER}/tournaments/${id}`);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }
})
