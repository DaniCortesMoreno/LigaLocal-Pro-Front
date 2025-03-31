import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import MyTournaments from '@/views/MyTournaments.vue'
import TorneosView from '@/views/TorneosView.vue'
import CreateTournamentForm from '@/views/CreateTournamentForm.vue'
import TournamentView from '@/views/TournamentView.vue'
import PerfilView from '@/views/PerfilView.vue'
import CreateTeamForm from '@/views/CreateTeamForm.vue'
import TeamView from '@/views/TeamView.vue'
import PlayerView from '@/views/PlayerView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/registro',
      name: 'Registro',
      component: RegisterView 
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView 
    },
    {
      path: '/mis-torneos',
      name: 'Mis Torneos',
      component: MyTournaments 
    },
    {
      path: '/torneos',
      name: 'Torneos',
      component: TorneosView 
    },
    {
      path: '/torneos/nuevo',
      name: 'Nuevo Torneo',
      component: CreateTournamentForm
    },
    {
      path: '/torneos/:id',
      name: 'Torneo',
      component: TournamentView,
      props: true
    },
    {
      path: "/perfil",
      name: "Perfil",
      component: PerfilView
    },
    {
      path: "/torneos/:torneo_id/equipos/crear",
      name: "Crear Equipo",
      component: CreateTeamForm,
      props: true
    },
    {
      path: "/equipos/:id",
      name: "Equipo",
      component: TeamView,
      props: true
    },
    {
      path: "/jugadores/:id",
      name: "Jugador",
      component: PlayerView,
      props: true
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
