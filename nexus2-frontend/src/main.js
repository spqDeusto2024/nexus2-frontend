// src/main.js
import { createApp } from 'vue';  // Usar createApp en lugar de importar Vue
import App from './App.vue';  // Tu componente raíz
import router from './router'; // Importa el router

// Crea la instancia de la aplicación y monta en el elemento con id 'app'
createApp(App)
  .use(router)  // Usa el router
  .mount('#app');  // Monta la aplicación en el DOM