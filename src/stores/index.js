import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

const SERVER = "http://localhost:8000/api"

const apiClient = axios.create({
  baseURL: SERVER,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const useUserStore = defineStore("data", {
  state() {
    return {
      loggedIn: localStorage.getItem("loggedIn") === "true",
      token: ref(localStorage.getItem("token")),
      //user: ref(localStorage.getItem("user")),
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
        //this.user = response.data.data.user;

        //localStorage.setItem("user", JSON.stringify(response.data.data.user));

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
        //this.user = response.data.data.user;

        //localStorage.setItem("user", JSON.stringify(response.data.data.user));

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
  }
})
