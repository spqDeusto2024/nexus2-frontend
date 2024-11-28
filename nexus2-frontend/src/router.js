import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue'; // Importa la nueva página de inicio
import ResidentLogin from './components/ResidentLogin.vue';
import Dashboard from './components/Dashboard.vue';

const routes = [
  {
    path: '/', // Página de inicio
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
