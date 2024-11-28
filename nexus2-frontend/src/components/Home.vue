<template>
  <div class="home">
    <!-- Logo en la esquina superior izquierda -->
    <img src="@/assets/logo.png" alt="Logo Nexus2" class="logo" />
    <div class="welcome-container">
      <h1 class="welcome-title">Bienvenido al refugio Nexus2</h1>
      <p class="subtitle">Seleccione cómo desea iniciar sesión</p>
      <div class="button-container">
        <button class="btn btn-resident" @click="goToResidentLogin">
          <span class="btn-icon">🏠</span> Residente
        </button>
        <button class="btn btn-admin" @click="goToAdminLogin">
          <span class="btn-icon">🛡️</span> Administrador
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    goToResidentLogin() {
      this.$router.push({ name: "ResidentLogin" });
    },
    goToAdminLogin() {
      this.$router.push({ name: "AdminLogin" });
    },
  },
};
</script>

<style scoped>
/* Estilos principales */
.home {
  position: relative; /* Para posicionar el logo */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #121212; /* Fondo oscuro estilo refugio */
  color: #e0e0e0; /* Texto claro para contraste */
  font-family: 'Roboto Mono', monospace; /* Tipografía de consola */
}

/* Logo en la esquina superior izquierda */
.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px; /* Tamaño más grande del logo */
  height: auto; /* Asegura que mantenga las proporciones */
  cursor: pointer; /* Cambiar cursor al pasar sobre el logo */
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.1); /* Efecto de agrandamiento al pasar el ratón */
}

/* Contenedor de bienvenida */
.welcome-container {
  text-align: center;
  background: rgba(0, 0, 0, 0.8); /* Fondo semi-transparente */
  padding: 30px 50px;
  border-radius: 15px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.8); /* Sombra profunda */
  max-width: 500px;
  border: 1px solid #444; /* Bordes sutiles */
}

/* Título */
.welcome-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #f5a623; /* Amarillo que recuerda un ambiente de alerta */
}

/* Subtítulo */
.subtitle {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #b0b0b0;
}

/* Contenedor de botones */
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* Botones */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  border-radius: 10px;
  padding: 15px 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

/* Icono de los botones */
.btn-icon {
  font-size: 1.5rem;
}

/* Botón de Residente */
.btn-resident {
  background: #2d7ff9; /* Azul tecnológico */
  color: #ffffff;
}

.btn-resident:hover {
  background: #1e5cb8;
  transform: scale(1.05);
}

/* Botón de Administrador */
.btn-admin {
  background: #d93030; /* Rojo de advertencia/seguridad */
  color: #ffffff;
}

.btn-admin:hover {
  background: #a71e1e;
  transform: scale(1.05);
}

/* Añadir una animación sutil al contenedor */
.welcome-container {
  animation: fadeIn 1.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
