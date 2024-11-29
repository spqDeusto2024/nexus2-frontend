import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue'; // Importa la nueva página de inicio
import ResidentLogin from './components/ResidentLogin.vue';
import Dashboard from './components/Dashboard.vue';
import DashboardAdmin from './components/DashboardAdmin.vue'; // Ajusta el path si está en otra carpeta
import CreateAdmin from './components/CreateAdmin.vue'; 
import DeleteAdmin from './components/DeleteAdmin.vue'; 

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
    path: '/createAdmin',
    name: 'CreateAdmin',
    component: CreateAdmin,
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
