import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue'; 
import ResidentLogin from './components/ResidentLogin.vue';
import Dashboard from './components/Dashboard.vue';
import DashboardAdmin from './components/DashboardAdmin.vue';
import CreateAdmin from './components/CreateAdmin.vue'; 
import DeleteAdmin from './components/DeleteAdmin.vue'; 
import Profile from './components/Profile.vue'; 
import ResidentProfile from './components/ResidentProfile.vue';
import EstadoMaquinas from './components/EstadoMaquinas.vue';
import CreateResident from './components/CreateResident.vue';
import ListResidents from './components/ListResidents.vue';
import CreateRoom from './components/CreateRoom.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/resident-login',
    name: 'ResidentLogin',
    component: ResidentLogin,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },

  {
    path: '/listResidents',
    name: 'ListResidents',
    component: ListResidents,
  },

  {
    path: '/dashboardAdmin',
    name: 'DashboardAdmin',
    component: DashboardAdmin,
  },
  {
    path: '/deleteAdmin',
    name: 'DeleteAdmin',
    component: DeleteAdmin,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/residentProfile',
    name: 'ResidentProfile',
    component: ResidentProfile,
  },
  {
    path: '/createAdmin',
    name: 'CreateAdmin',
    component: CreateAdmin,
  },
  {
    path: '/createResident',
    name: 'CreateResident',
    component: CreateResident,
  },

  {
    path: '/createRoom',
    name: 'CreateRoom',
    component: CreateRoom,
  },

  {
    path: '/estadoMaquinas',
    name: 'EstadoMaquinas',
    component: EstadoMaquinas,
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: () => import('./components/AdminLogin.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
